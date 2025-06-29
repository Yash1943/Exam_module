# MCQ Exam System - Subscription-Based Platform with MariaDB

A comprehensive subscription-based MCQ (Multiple Choice Questions) exam system built with React.js frontend and Node.js backend using MariaDB database. This platform allows users to take exams based on their subscription plans with configurable limits and features.

## Features

### 🎯 Core Features
- **User Authentication & Authorization**
  - JWT-based authentication
  - Email verification
  - Password reset functionality
  - Role-based access control (User, Admin, Super Admin)

- **Subscription Management**
  - Multiple subscription tiers (Free, Basic, Premium, Enterprise)
  - Stripe payment integration
  - Usage tracking and limits
  - Automatic subscription renewal

- **Exam System**
  - Timed exams with strict mode
  - Question shuffling
  - Real-time progress tracking
  - Violation detection (tab switching, window blur)
  - Detailed results and analytics

- **Admin Dashboard**
  - User management
  - Exam creation and management
  - Subscription plan configuration
  - Analytics and reporting

### 💳 Subscription Plans

| Feature | Free | Basic | Premium | Enterprise |
|---------|------|-------|---------|------------|
| Exam Attempts | 1 | 10 | 50 | Unlimited |
| Account Access | 1 | 1 | 3 | 10 |
| Exam Types | Basic | Basic, Intermediate | Basic, Intermediate, Advanced | All Types |
| Support Level | Basic | Basic | Priority | Premium |
| Analytics | ❌ | ✅ | ✅ | ✅ |
| Custom Branding | ❌ | ❌ | ✅ | ✅ |
| API Access | ❌ | ❌ | ❌ | ✅ |
| Monthly Price | $0 | $9.99 | $19.99 | $49.99 |
| Yearly Price | $0 | $99.99 | $199.99 | $499.99 |

## Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Stripe.js** - Payment processing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MariaDB/MySQL** - Database
- **mysql2** - Database driver
- **JWT** - Authentication
- **Stripe** - Payment processing
- **Nodemailer** - Email service
- **bcryptjs** - Password hashing

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MariaDB or MySQL
- Stripe account
- SMTP email service

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mcq-exam-system
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 3. Database Setup

#### Install MariaDB
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mariadb-server

# macOS (using Homebrew)
brew install mariadb

# Windows
# Download from https://mariadb.org/download/
```

#### Create Database
```sql
CREATE DATABASE mcq_exam_system;
CREATE USER 'mcq_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON mcq_exam_system.* TO 'mcq_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Environment Configuration

Create `.env` file in the `server` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3001

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=mcq_user
DB_PASSWORD=your_password
DB_NAME=mcq_exam_system

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@mcqexam.com

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

Create `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 5. Database Migration and Seeding

Run migrations and seed initial data:

```bash
cd server

# Run database migrations
npm run migrate

# Seed initial data (subscription plans, sample exams, admin user)
npm run seed
```

This will create:
- Database tables with proper structure
- Subscription plans
- Sample exams
- Admin user (admin@mcqexam.com / admin123)

### 6. Start the Application

```bash
# Start both frontend and backend
npm run dev

# Or start them separately
npm run client:dev  # Frontend only
npm run server:dev  # Backend only
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Database Schema

### Key Tables

#### Users Table
- Stores user information, authentication data, and subscription details
- Includes profile information (college, branch, semester, etc.)
- Tracks subscription limits and usage

#### Subscription Plans Table
- Defines available subscription tiers
- Configurable features and pricing
- Stripe integration fields

#### Exams Table
- Exam content and configuration
- JSON storage for questions and settings
- Access control based on subscription plans

#### Exam Attempts Table
- Tracks user exam attempts
- Stores answers, scores, and violation data
- Performance analytics

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-email/:token` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password/:token` - Password reset

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users/stats` - Get user statistics
- `DELETE /api/users/account` - Delete user account

### Exam Endpoints
- `GET /api/exams` - Get available exams
- `GET /api/exams/:id` - Get exam details
- `POST /api/exams/:id/start` - Start exam attempt
- `POST /api/exams/:id/submit` - Submit exam
- `GET /api/exams/:id/results/:attemptId` - Get exam results
- `GET /api/exams/history/me` - Get exam history

### Subscription Endpoints
- `GET /api/subscriptions/plans` - Get subscription plans
- `GET /api/subscriptions/current` - Get current subscription
- `POST /api/subscriptions/create-checkout-session` - Create Stripe checkout
- `POST /api/subscriptions/success` - Handle successful payment
- `POST /api/subscriptions/cancel` - Cancel subscription

### Admin Endpoints
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/limits` - Update user limits
- `GET /api/admin/exams` - Get all exams
- `POST /api/admin/exams` - Create exam
- `PUT /api/admin/exams/:id` - Update exam
- `DELETE /api/admin/exams/:id` - Delete exam
- `GET /api/admin/analytics` - Get analytics data

## Stripe Integration

### Setup Webhook
1. Create a webhook endpoint in Stripe Dashboard
2. Set the endpoint URL to: `https://yourdomain.com/api/subscriptions/webhook`
3. Select these events:
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### Test Cards
Use Stripe test cards for development:
- Success: `4242424242424242`
- Decline: `4000000000000002`

## Deployment

### Database Setup (Production)
1. Set up MariaDB/MySQL on your production server
2. Create production database and user
3. Update environment variables with production database credentials

### Frontend (Netlify/Vercel)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in deployment platform

### Backend (Heroku/Railway/DigitalOcean)
1. Set up production MariaDB/MySQL database
2. Configure environment variables
3. Deploy the `server` directory
4. Run migrations: `npm run migrate`
5. Seed initial data: `npm run seed`
6. Set up Stripe webhooks with production URL

## Security Features

- **JWT Authentication** with secure token storage
- **Password Hashing** using bcryptjs
- **Rate Limiting** to prevent abuse
- **Input Validation** using express-validator
- **CORS Protection** for cross-origin requests
- **Helmet.js** for security headers
- **Exam Security** with violation detection
- **SQL Injection Protection** using parameterized queries

## Performance Optimizations

- **Database Indexing** on frequently queried columns
- **Connection Pooling** for database connections
- **JSON Storage** for flexible data structures
- **Efficient Queries** with proper joins and pagination

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: support@mcqexam.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues]

## Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Question bank management
- [ ] Bulk user import
- [ ] Custom exam templates
- [ ] Integration with LMS platforms
- [ ] Multi-language support
- [ ] Proctoring features
- [ ] Redis caching implementation
- [ ] Database replication setup