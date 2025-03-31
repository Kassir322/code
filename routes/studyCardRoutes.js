// routes/studyCardRoutes.js
const express = require('express')
const router = express.Router()
const StudyCardController = require('../controllers/StudyCardController')
const authMiddleware = require('../middlewares/authMiddleware')

// Публичные маршруты (не требуют авторизации)
router.get('/', StudyCardController.getAllStudyCards)
router.get('/:id', StudyCardController.getStudyCardById)
router.get('/filters/subjects', StudyCardController.getSubjects)
router.get('/filters/card-types', StudyCardController.getCardTypes)
router.get('/filters/school-grades', StudyCardController.getSchoolGrades)

// Защищенные маршруты (требуют авторизации и прав администратора)
router.post('/', authMiddleware, StudyCardController.createStudyCard)
router.put('/:id', authMiddleware, StudyCardController.updateStudyCard)
router.delete('/:id', authMiddleware, StudyCardController.deleteStudyCard)

module.exports = router
