const { executeQuery } = require('../config/database');

class SubscriptionPlan {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.displayName = data.display_name;
    this.description = data.description;
    this.price = {
      monthly: parseFloat(data.monthly_price),
      yearly: parseFloat(data.yearly_price)
    };
    this.currency = data.currency || 'USD';
    this.features = {
      maxExamAttempts: data.max_exam_attempts,
      maxAccountAccess: data.max_account_access,
      examTypes: data.exam_types ? JSON.parse(data.exam_types) : [],
      supportLevel: data.support_level || 'basic',
      analyticsAccess: data.analytics_access !== 0,
      customBranding: data.custom_branding !== 0,
      apiAccess: data.api_access !== 0
    };
    this.stripeProductId = data.stripe_product_id;
    this.stripePriceIds = {
      monthly: data.stripe_monthly_price_id,
      yearly: data.stripe_yearly_price_id
    };
    this.isActive = data.is_active !== 0;
    this.sortOrder = data.sort_order || 0;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new subscription plan
  static async create(planData) {
    const query = `
      INSERT INTO subscription_plans (
        name, display_name, description, monthly_price, yearly_price, currency,
        max_exam_attempts, max_account_access, exam_types, support_level,
        analytics_access, custom_branding, api_access, stripe_product_id,
        stripe_monthly_price_id, stripe_yearly_price_id, sort_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const params = [
      planData.name,
      planData.displayName,
      planData.description,
      planData.price.monthly,
      planData.price.yearly,
      planData.currency || 'USD',
      planData.features.maxExamAttempts,
      planData.features.maxAccountAccess,
      JSON.stringify(planData.features.examTypes),
      planData.features.supportLevel,
      planData.features.analyticsAccess ? 1 : 0,
      planData.features.customBranding ? 1 : 0,
      planData.features.apiAccess ? 1 : 0,
      planData.stripeProductId,
      planData.stripePriceIds?.monthly,
      planData.stripePriceIds?.yearly,
      planData.sortOrder || 0
    ];

    const result = await executeQuery(query, params);
    return await SubscriptionPlan.findById(result.insertId);
  }

  // Find plan by ID
  static async findById(id) {
    const query = 'SELECT * FROM subscription_plans WHERE id = ?';
    const rows = await executeQuery(query, [id]);
    return rows.length > 0 ? new SubscriptionPlan(rows[0]) : null;
  }

  // Find plan by name
  static async findByName(name) {
    const query = 'SELECT * FROM subscription_plans WHERE name = ?';
    const rows = await executeQuery(query, [name]);
    return rows.length > 0 ? new SubscriptionPlan(rows[0]) : null;
  }

  // Get all active plans
  static async findAllActive() {
    const query = 'SELECT * FROM subscription_plans WHERE is_active = 1 ORDER BY sort_order ASC';
    const rows = await executeQuery(query);
    return rows.map(row => new SubscriptionPlan(row));
  }

  // Get all plans
  static async findAll() {
    const query = 'SELECT * FROM subscription_plans ORDER BY sort_order ASC';
    const rows = await executeQuery(query);
    return rows.map(row => new SubscriptionPlan(row));
  }

  // Update plan
  async save() {
    const query = `
      UPDATE subscription_plans SET 
        name = ?, display_name = ?, description = ?, monthly_price = ?, yearly_price = ?,
        currency = ?, max_exam_attempts = ?, max_account_access = ?, exam_types = ?,
        support_level = ?, analytics_access = ?, custom_branding = ?, api_access = ?,
        stripe_product_id = ?, stripe_monthly_price_id = ?, stripe_yearly_price_id = ?,
        is_active = ?, sort_order = ?, updated_at = NOW()
      WHERE id = ?
    `;

    const params = [
      this.name,
      this.displayName,
      this.description,
      this.price.monthly,
      this.price.yearly,
      this.currency,
      this.features.maxExamAttempts,
      this.features.maxAccountAccess,
      JSON.stringify(this.features.examTypes),
      this.features.supportLevel,
      this.features.analyticsAccess ? 1 : 0,
      this.features.customBranding ? 1 : 0,
      this.features.apiAccess ? 1 : 0,
      this.stripeProductId,
      this.stripePriceIds.monthly,
      this.stripePriceIds.yearly,
      this.isActive ? 1 : 0,
      this.sortOrder,
      this.id
    ];

    await executeQuery(query, params);
    return this;
  }
}

class Subscription {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.planId = data.plan_id;
    this.status = data.status;
    this.billingCycle = data.billing_cycle;
    this.startDate = data.start_date;
    this.endDate = data.end_date;
    this.nextBillingDate = data.next_billing_date;
    this.amount = parseFloat(data.amount);
    this.currency = data.currency || 'USD';
    this.stripeSubscriptionId = data.stripe_subscription_id;
    this.stripeCustomerId = data.stripe_customer_id;
    this.paymentMethod = data.payment_method || 'stripe';
    this.usage = {
      examAttempts: data.exam_attempts_used || 0,
      accountAccess: data.account_access_used || 1
    };
    this.metadata = data.metadata ? JSON.parse(data.metadata) : {};
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new subscription
  static async create(subscriptionData) {
    const query = `
      INSERT INTO subscriptions (
        user_id, plan_id, status, billing_cycle, start_date, end_date,
        next_billing_date, amount, currency, stripe_subscription_id,
        stripe_customer_id, payment_method, metadata, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const params = [
      subscriptionData.userId,
      subscriptionData.planId,
      subscriptionData.status,
      subscriptionData.billingCycle,
      subscriptionData.startDate,
      subscriptionData.endDate,
      subscriptionData.nextBillingDate,
      subscriptionData.amount,
      subscriptionData.currency,
      subscriptionData.stripeSubscriptionId,
      subscriptionData.stripeCustomerId,
      subscriptionData.paymentMethod,
      JSON.stringify(subscriptionData.metadata || {})
    ];

    const result = await executeQuery(query, params);
    return await Subscription.findById(result.insertId);
  }

  // Find subscription by ID
  static async findById(id) {
    const query = 'SELECT * FROM subscriptions WHERE id = ?';
    const rows = await executeQuery(query, [id]);
    return rows.length > 0 ? new Subscription(rows[0]) : null;
  }

  // Find active subscription by user ID
  static async findActiveByUserId(userId) {
    const query = 'SELECT * FROM subscriptions WHERE user_id = ? AND status = "active" ORDER BY created_at DESC LIMIT 1';
    const rows = await executeQuery(query, [userId]);
    return rows.length > 0 ? new Subscription(rows[0]) : null;
  }

  // Find subscription by Stripe subscription ID
  static async findByStripeSubscriptionId(stripeSubscriptionId) {
    const query = 'SELECT * FROM subscriptions WHERE stripe_subscription_id = ?';
    const rows = await executeQuery(query, [stripeSubscriptionId]);
    return rows.length > 0 ? new Subscription(rows[0]) : null;
  }

  // Update subscription
  async save() {
    const query = `
      UPDATE subscriptions SET 
        status = ?, billing_cycle = ?, start_date = ?, end_date = ?,
        next_billing_date = ?, amount = ?, currency = ?, stripe_subscription_id = ?,
        stripe_customer_id = ?, payment_method = ?, exam_attempts_used = ?,
        account_access_used = ?, metadata = ?, updated_at = NOW()
      WHERE id = ?
    `;

    const params = [
      this.status,
      this.billingCycle,
      this.startDate,
      this.endDate,
      this.nextBillingDate,
      this.amount,
      this.currency,
      this.stripeSubscriptionId,
      this.stripeCustomerId,
      this.paymentMethod,
      this.usage.examAttempts,
      this.usage.accountAccess,
      JSON.stringify(this.metadata),
      this.id
    ];

    await executeQuery(query, params);
    return this;
  }

  // Check if subscription is active
  isActive() {
    return this.status === 'active' && this.endDate > new Date();
  }

  // Count active subscriptions
  static async countActive() {
    const query = 'SELECT COUNT(*) as total FROM subscriptions WHERE status = "active"';
    const result = await executeQuery(query);
    return result[0].total;
  }
}

module.exports = { SubscriptionPlan, Subscription };