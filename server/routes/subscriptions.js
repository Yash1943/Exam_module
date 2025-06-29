const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { SubscriptionPlan, Subscription } = require('../models/Subscription');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all subscription plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ isActive: true })
      .sort({ sortOrder: 1 });

    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription plans',
      error: error.message
    });
  }
});

// Get user's current subscription
router.get('/current', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('subscription.planId');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const subscription = await Subscription.findOne({
      userId: user._id,
      status: 'active'
    }).populate('planId');

    res.json({
      success: true,
      data: {
        subscription: subscription || null,
        usage: user.subscription.limits
      }
    });
  } catch (error) {
    console.error('Get current subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch current subscription',
      error: error.message
    });
  }
});

// Create subscription checkout session
router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    const { planId, billingCycle } = req.body;

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create or retrieve Stripe customer
    let customer;
    if (user.subscription.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.subscription.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        name: user.fullName,
        metadata: {
          userId: user._id.toString()
        }
      });

      user.subscription.stripeCustomerId = customer.id;
      await user.save();
    }

    const priceId = billingCycle === 'yearly' 
      ? plan.stripePriceIds.yearly 
      : plan.stripePriceIds.monthly;

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
      metadata: {
        userId: user._id.toString(),
        planId: plan._id.toString(),
        billingCycle
      }
    });

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url
      }
    });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create checkout session',
      error: error.message
    });
  }
});

// Handle successful subscription
router.post('/success', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      return res.status(400).json({
        success: false,
        message: 'Invalid session'
      });
    }

    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    const user = await User.findById(req.user.userId);
    const plan = await SubscriptionPlan.findById(session.metadata.planId);

    // Create subscription record
    const newSubscription = new Subscription({
      userId: user._id,
      planId: plan._id,
      status: 'active',
      billingCycle: session.metadata.billingCycle,
      startDate: new Date(subscription.current_period_start * 1000),
      endDate: new Date(subscription.current_period_end * 1000),
      nextBillingDate: new Date(subscription.current_period_end * 1000),
      amount: subscription.items.data[0].price.unit_amount / 100,
      currency: subscription.currency.toUpperCase(),
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer
    });

    await newSubscription.save();

    // Update user subscription info
    user.subscription.plan = plan.name;
    user.subscription.status = 'active';
    user.subscription.startDate = newSubscription.startDate;
    user.subscription.endDate = newSubscription.endDate;
    user.subscription.stripeSubscriptionId = subscription.id;
    user.subscription.limits.maxExamAttempts = plan.features.maxExamAttempts;
    user.subscription.limits.maxAccountAccess = plan.features.maxAccountAccess;

    await user.save();

    res.json({
      success: true,
      message: 'Subscription activated successfully',
      data: {
        subscription: newSubscription,
        plan: plan
      }
    });
  } catch (error) {
    console.error('Subscription success error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process subscription',
      error: error.message
    });
  }
});

// Cancel subscription
router.post('/cancel', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.subscription.stripeSubscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    // Cancel subscription at period end
    await stripe.subscriptions.update(user.subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    // Update subscription status
    await Subscription.findOneAndUpdate(
      { stripeSubscriptionId: user.subscription.stripeSubscriptionId },
      { status: 'cancelled' }
    );

    res.json({
      success: true,
      message: 'Subscription will be cancelled at the end of the current billing period'
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription',
      error: error.message
    });
  }
});

// Webhook for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Helper functions for webhook handlers
async function handleSubscriptionUpdated(subscription) {
  const user = await User.findOne({ 
    'subscription.stripeCustomerId': subscription.customer 
  });
  
  if (user) {
    user.subscription.status = subscription.status;
    user.subscription.endDate = new Date(subscription.current_period_end * 1000);
    await user.save();

    await Subscription.findOneAndUpdate(
      { stripeSubscriptionId: subscription.id },
      { 
        status: subscription.status,
        endDate: new Date(subscription.current_period_end * 1000)
      }
    );
  }
}

async function handleSubscriptionDeleted(subscription) {
  const user = await User.findOne({ 
    'subscription.stripeCustomerId': subscription.customer 
  });
  
  if (user) {
    user.subscription.status = 'cancelled';
    await user.save();

    await Subscription.findOneAndUpdate(
      { stripeSubscriptionId: subscription.id },
      { status: 'cancelled' }
    );
  }
}

async function handlePaymentSucceeded(invoice) {
  // Handle successful payment
  console.log('Payment succeeded for invoice:', invoice.id);
}

async function handlePaymentFailed(invoice) {
  // Handle failed payment
  console.log('Payment failed for invoice:', invoice.id);
}

module.exports = router;