const express = require('express');
const router = express.Router();
const knowledgeController = require('../controllers/knowledgeController');
const authMiddleware = require('../middleware/auth');

router.get('/', knowledgeController.getAll);
router.get('/stats', knowledgeController.getStats);
router.get('/:id', knowledgeController.getById);
router.post('/', authMiddleware, knowledgeController.create);
router.put('/:id', authMiddleware, knowledgeController.update);
router.delete('/:id', authMiddleware, knowledgeController.delete);
router.post('/:id/comments', authMiddleware, knowledgeController.addComment);
router.put('/:id/helpful', knowledgeController.markHelpful);

module.exports = router;