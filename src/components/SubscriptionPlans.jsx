import React, { useState, useEffect } from 'react';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../context/AuthContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const SubscriptionPlans = () => {
  const { userData } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/subscriptions/plans');
      const data = await response.json();
      if (data.success) {
        setPlans(data.data);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    if (!userData) {
      alert('Please login to subscribe');
      return;
    }

    setProcessingPlan(planId);

    try {
      const response = await fetch('/api/subscriptions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          planId,
          billingCycle
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.data.sessionId
        });

        if (error) {
          console.error('Stripe error:', error);
          alert('Payment failed. Please try again.');
        }
      } else {
        alert(data.message || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setProcessingPlan(null);
    }
  };

  const getPlanIcon = (planName) => {
    switch (planName) {
      case 'free':
        return <Star className="w-8 h-8 text-gray-500" />;
      case 'basic':
        return <Zap className="w-8 h-8 text-blue-500" />;
      case 'premium':
        return <Crown className="w-8 h-8 text-purple-500" />;
      case 'enterprise':
        return <Crown className="w-8 h-8 text-gold-500" />;
      default:
        return <Star className="w-8 h-8 text-gray-500" />;
    }
  };

  const getPlanColor = (planName) => {
    switch (planName) {
      case 'free':
        return 'border-gray-200 hover:border-gray-300';
      case 'basic':
        return 'border-blue-200 hover:border-blue-300';
      case 'premium':
        return 'border-purple-200 hover:border-purple-300 ring-2 ring-purple-500';
      case 'enterprise':
        return 'border-yellow-200 hover:border-yellow-300';
      default:
        return 'border-gray-200 hover:border-gray-300';
    }
  };

  const getButtonColor = (planName) => {
    switch (planName) {
      case 'free':
        return 'bg-gray-500 hover:bg-gray-600';
      case 'basic':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'premium':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'enterprise':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Select the perfect plan for your learning journey
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${billingCycle === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${billingCycle === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Save 20%
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className={`bg-white rounded-2xl shadow-lg p-8 relative transition-all duration-300 ${getPlanColor(plan.name)} ${
                plan.name === 'premium' ? 'transform scale-105' : ''
              }`}
            >
              {plan.name === 'premium' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  {getPlanIcon(plan.name)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.displayName}
                </h3>
                <p className="text-gray-600 mb-4">
                  {plan.description}
                </p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly}
                  </span>
                  <span className="text-gray-600">
                    /{billingCycle === 'yearly' ? 'year' : 'month'}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">
                    {plan.features.maxExamAttempts === -1 
                      ? 'Unlimited exam attempts' 
                      : `${plan.features.maxExamAttempts} exam attempts`}
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">
                    {plan.features.maxAccountAccess} account access
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">
                    {plan.features.examTypes.join(', ')} exams
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">
                    {plan.features.supportLevel} support
                  </span>
                </div>
                {plan.features.analyticsAccess && (
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Analytics access</span>
                  </div>
                )}
                {plan.features.customBranding && (
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Custom branding</span>
                  </div>
                )}
                {plan.features.apiAccess && (
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">API access</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleSubscribe(plan._id)}
                disabled={processingPlan === plan._id || plan.name === 'free'}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${getButtonColor(plan.name)} ${
                  processingPlan === plan._id ? 'opacity-50 cursor-not-allowed' : ''
                } ${plan.name === 'free' ? 'bg-gray-400 cursor-not-allowed' : ''}`}
              >
                {processingPlan === plan._id ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : plan.name === 'free' ? (
                  'Current Plan'
                ) : (
                  `Subscribe to ${plan.displayName}`
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                What happens if I exceed my exam attempts?
              </h3>
              <p className="text-gray-600">
                You'll need to upgrade your plan or wait for the next billing cycle to get additional attempts.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes, all new users start with a free plan that includes limited access to our platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;