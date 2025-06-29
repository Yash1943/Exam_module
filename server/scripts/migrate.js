const { executeQuery, testConnection } = require('../config/database');

// Database migration script
const migrations = [
  // Users table
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin', 'super_admin') DEFAULT 'user',
    college_name VARCHAR(255),
    branch VARCHAR(255),
    semester VARCHAR(50),
    prn_no VARCHAR(100),
    phone_no VARCHAR(20),
    aadhar_card_no VARCHAR(12),
    subscription_plan ENUM('free', 'basic', 'premium', 'enterprise') DEFAULT 'free',
    subscription_status ENUM('active', 'inactive', 'cancelled', 'expired') DEFAULT 'inactive',
    subscription_start_date DATETIME,
    subscription_end_date DATETIME,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    exam_attempts INT DEFAULT 0,
    max_exam_attempts INT DEFAULT 1,
    account_access INT DEFAULT 1,
    max_account_access INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires DATETIME,
    last_login DATETIME,
    login_attempts INT DEFAULT 0,
    lock_until DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_subscription_plan (subscription_plan),
    INDEX idx_created_at (created_at)
  )`,

  // Subscription plans table
  `CREATE TABLE IF NOT EXISTS subscription_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    monthly_price DECIMAL(10,2) NOT NULL,
    yearly_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    max_exam_attempts INT NOT NULL,
    max_account_access INT NOT NULL,
    exam_types JSON,
    support_level ENUM('basic', 'priority', 'premium') DEFAULT 'basic',
    analytics_access BOOLEAN DEFAULT FALSE,
    custom_branding BOOLEAN DEFAULT FALSE,
    api_access BOOLEAN DEFAULT FALSE,
    stripe_product_id VARCHAR(255),
    stripe_monthly_price_id VARCHAR(255),
    stripe_yearly_price_id VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_sort_order (sort_order)
  )`,

  // Subscriptions table
  `CREATE TABLE IF NOT EXISTS subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    status ENUM('active', 'inactive', 'cancelled', 'expired', 'past_due') DEFAULT 'inactive',
    billing_cycle ENUM('monthly', 'yearly') NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    next_billing_date DATETIME,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    stripe_subscription_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    payment_method ENUM('stripe', 'paypal', 'bank_transfer') DEFAULT 'stripe',
    exam_attempts_used INT DEFAULT 0,
    account_access_used INT DEFAULT 1,
    metadata JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_stripe_subscription_id (stripe_subscription_id)
  )`,

  // Exams table
  `CREATE TABLE IF NOT EXISTS exams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    questions JSON NOT NULL,
    duration INT NOT NULL COMMENT 'Duration in minutes',
    total_marks INT NOT NULL,
    passing_score INT DEFAULT 60 COMMENT 'Passing score percentage',
    shuffle_questions BOOLEAN DEFAULT TRUE,
    show_results BOOLEAN DEFAULT TRUE,
    allow_review BOOLEAN DEFAULT TRUE,
    strict_mode BOOLEAN DEFAULT TRUE,
    subscription_plans JSON COMMENT 'Array of subscription plans that can access this exam',
    is_public BOOLEAN DEFAULT FALSE,
    start_date DATETIME,
    end_date DATETIME,
    created_by INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    attempts INT DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_category (category),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
  )`,

  // Exam attempts table
  `CREATE TABLE IF NOT EXISTS exam_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    exam_id INT NOT NULL,
    answers JSON,
    score_total INT DEFAULT 0,
    score_percentage DECIMAL(5,2) DEFAULT 0,
    score_correct INT DEFAULT 0,
    score_incorrect INT DEFAULT 0,
    score_unanswered INT DEFAULT 0,
    time_spent INT DEFAULT 0 COMMENT 'Time spent in seconds',
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME,
    status ENUM('in_progress', 'completed', 'abandoned', 'timeout') DEFAULT 'in_progress',
    violations JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_exam_id (exam_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
  )`
];

const runMigrations = async () => {
  try {
    console.log('🚀 Starting database migrations...');
    
    // Test connection first
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }

    // Run each migration
    for (let i = 0; i < migrations.length; i++) {
      console.log(`📝 Running migration ${i + 1}/${migrations.length}...`);
      await executeQuery(migrations[i]);
      console.log(`✅ Migration ${i + 1} completed`);
    }

    console.log('🎉 All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };