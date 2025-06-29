const { executeQuery } = require('../config/database');

class Exam {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.category = data.category;
    this.questions = data.questions ? JSON.parse(data.questions) : [];
    this.settings = {
      duration: data.duration,
      totalMarks: data.total_marks,
      passingScore: data.passing_score || 60,
      shuffleQuestions: data.shuffle_questions !== 0,
      showResults: data.show_results !== 0,
      allowReview: data.allow_review !== 0,
      strictMode: data.strict_mode !== 0
    };
    this.access = {
      subscriptionPlans: data.subscription_plans ? JSON.parse(data.subscription_plans) : [],
      isPublic: data.is_public !== 0,
      startDate: data.start_date,
      endDate: data.end_date
    };
    this.createdBy = data.created_by;
    this.isActive = data.is_active !== 0;
    this.attempts = data.attempts || 0;
    this.averageScore = parseFloat(data.average_score) || 0;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new exam
  static async create(examData) {
    const query = `
      INSERT INTO exams (
        title, description, category, questions, duration, total_marks,
        passing_score, shuffle_questions, show_results, allow_review, strict_mode,
        subscription_plans, is_public, start_date, end_date, created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const params = [
      examData.title,
      examData.description,
      examData.category,
      JSON.stringify(examData.questions),
      examData.settings.duration,
      examData.settings.totalMarks,
      examData.settings.passingScore || 60,
      examData.settings.shuffleQuestions ? 1 : 0,
      examData.settings.showResults ? 1 : 0,
      examData.settings.allowReview ? 1 : 0,
      examData.settings.strictMode ? 1 : 0,
      JSON.stringify(examData.access.subscriptionPlans),
      examData.access.isPublic ? 1 : 0,
      examData.access.startDate,
      examData.access.endDate,
      examData.createdBy
    ];

    const result = await executeQuery(query, params);
    return await Exam.findById(result.insertId);
  }

  // Find exam by ID
  static async findById(id) {
    const query = 'SELECT * FROM exams WHERE id = ?';
    const rows = await executeQuery(query, [id]);
    return rows.length > 0 ? new Exam(rows[0]) : null;
  }

  // Get all active exams
  static async findAllActive() {
    const query = 'SELECT * FROM exams WHERE is_active = 1 ORDER BY created_at DESC';
    const rows = await executeQuery(query);
    return rows.map(row => new Exam(row));
  }

  // Get exams with pagination
  static async findAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const query = 'SELECT * FROM exams ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const countQuery = 'SELECT COUNT(*) as total FROM exams';

    const [exams, countResult] = await Promise.all([
      executeQuery(query, [limit, offset]),
      executeQuery(countQuery)
    ]);

    return {
      exams: exams.map(exam => new Exam(exam)),
      total: countResult[0].total,
      pages: Math.ceil(countResult[0].total / limit)
    };
  }

  // Update exam
  async save() {
    const query = `
      UPDATE exams SET 
        title = ?, description = ?, category = ?, questions = ?, duration = ?,
        total_marks = ?, passing_score = ?, shuffle_questions = ?, show_results = ?,
        allow_review = ?, strict_mode = ?, subscription_plans = ?, is_public = ?,
        start_date = ?, end_date = ?, is_active = ?, attempts = ?, average_score = ?,
        updated_at = NOW()
      WHERE id = ?
    `;

    const params = [
      this.title,
      this.description,
      this.category,
      JSON.stringify(this.questions),
      this.settings.duration,
      this.settings.totalMarks,
      this.settings.passingScore,
      this.settings.shuffleQuestions ? 1 : 0,
      this.settings.showResults ? 1 : 0,
      this.settings.allowReview ? 1 : 0,
      this.settings.strictMode ? 1 : 0,
      JSON.stringify(this.access.subscriptionPlans),
      this.access.isPublic ? 1 : 0,
      this.access.startDate,
      this.access.endDate,
      this.isActive ? 1 : 0,
      this.attempts,
      this.averageScore,
      this.id
    ];

    await executeQuery(query, params);
    return this;
  }

  // Count total exams
  static async count() {
    const query = 'SELECT COUNT(*) as total FROM exams WHERE is_active = 1';
    const result = await executeQuery(query);
    return result[0].total;
  }
}

class ExamAttempt {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.examId = data.exam_id;
    this.answers = data.answers ? JSON.parse(data.answers) : [];
    this.score = {
      total: data.score_total || 0,
      percentage: parseFloat(data.score_percentage) || 0,
      correct: data.score_correct || 0,
      incorrect: data.score_incorrect || 0,
      unanswered: data.score_unanswered || 0
    };
    this.timeSpent = data.time_spent || 0;
    this.startTime = data.start_time;
    this.endTime = data.end_time;
    this.status = data.status || 'in_progress';
    this.violations = data.violations ? JSON.parse(data.violations) : [];
    this.ipAddress = data.ip_address;
    this.userAgent = data.user_agent;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new exam attempt
  static async create(attemptData) {
    const query = `
      INSERT INTO exam_attempts (
        user_id, exam_id, start_time, ip_address, user_agent, created_at, updated_at
      ) VALUES (?, ?, NOW(), ?, ?, NOW(), NOW())
    `;

    const params = [
      attemptData.userId,
      attemptData.examId,
      attemptData.ipAddress,
      attemptData.userAgent
    ];

    const result = await executeQuery(query, params);
    return await ExamAttempt.findById(result.insertId);
  }

  // Find attempt by ID
  static async findById(id) {
    const query = 'SELECT * FROM exam_attempts WHERE id = ?';
    const rows = await executeQuery(query, [id]);
    return rows.length > 0 ? new ExamAttempt(rows[0]) : null;
  }

  // Find in-progress attempt
  static async findInProgress(userId, examId) {
    const query = 'SELECT * FROM exam_attempts WHERE user_id = ? AND exam_id = ? AND status = "in_progress"';
    const rows = await executeQuery(query, [userId, examId]);
    return rows.length > 0 ? new ExamAttempt(rows[0]) : null;
  }

  // Get user's exam history
  static async findByUserId(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT ea.*, e.title as exam_title, e.category as exam_category 
      FROM exam_attempts ea 
      JOIN exams e ON ea.exam_id = e.id 
      WHERE ea.user_id = ? AND ea.status = 'completed' 
      ORDER BY ea.created_at DESC 
      LIMIT ? OFFSET ?
    `;
    const countQuery = 'SELECT COUNT(*) as total FROM exam_attempts WHERE user_id = ? AND status = "completed"';

    const [attempts, countResult] = await Promise.all([
      executeQuery(query, [userId, limit, offset]),
      executeQuery(countQuery, [userId])
    ]);

    return {
      attempts: attempts.map(attempt => new ExamAttempt(attempt)),
      total: countResult[0].total,
      pages: Math.ceil(countResult[0].total / limit)
    };
  }

  // Update attempt
  async save() {
    const query = `
      UPDATE exam_attempts SET 
        answers = ?, score_total = ?, score_percentage = ?, score_correct = ?,
        score_incorrect = ?, score_unanswered = ?, time_spent = ?, end_time = ?,
        status = ?, violations = ?, updated_at = NOW()
      WHERE id = ?
    `;

    const params = [
      JSON.stringify(this.answers),
      this.score.total,
      this.score.percentage,
      this.score.correct,
      this.score.incorrect,
      this.score.unanswered,
      this.timeSpent,
      this.endTime,
      this.status,
      JSON.stringify(this.violations),
      this.id
    ];

    await executeQuery(query, params);
    return this;
  }

  // Count completed attempts
  static async countCompleted() {
    const query = 'SELECT COUNT(*) as total FROM exam_attempts WHERE status = "completed"';
    const result = await executeQuery(query);
    return result[0].total;
  }

  // Get recent attempts for admin
  static async getRecent(limit = 10) {
    const query = `
      SELECT ea.*, u.full_name as user_name, u.email as user_email, e.title as exam_title
      FROM exam_attempts ea
      JOIN users u ON ea.user_id = u.id
      JOIN exams e ON ea.exam_id = e.id
      WHERE ea.status = 'completed'
      ORDER BY ea.created_at DESC
      LIMIT ?
    `;
    const rows = await executeQuery(query, [limit]);
    return rows.map(row => new ExamAttempt(row));
  }
}

module.exports = { Exam, ExamAttempt };