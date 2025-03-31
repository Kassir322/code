// routes/reviewRoutes.js
const express = require('express')
const router = express.Router()
const ReviewController = require('../controllers/ReviewController')
const authMiddleware = require('../middlewares/authMiddleware')

// Публичные маршруты (не требуют авторизации)
router.get('/study-card/:studyCardId', ReviewController.getStudyCardReviews)
router.get('/:id', ReviewController.getReviewById)

// Защищенные маршруты (требуют авторизации)
router.get('/user/my-reviews', authMiddleware, ReviewController.getUserReviews)
router.post('/', authMiddleware, ReviewController.createReview)
router.put('/:id', authMiddleware, ReviewController.updateReview)
router.delete('/:id', authMiddleware, ReviewController.deleteReview)

module.exports = router
