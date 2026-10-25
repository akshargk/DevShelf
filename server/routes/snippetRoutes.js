const express = require('express');
const router = express.Router();
const snippetController = require('../controllers/snippetController');
const authMiddleware = require('../middleware/auth');

// All snippet routes require JWT authentication
router.use(authMiddleware);

router.get('/meta/languages-and-tags', snippetController.getLanguagesAndTags);
router.get('/', snippetController.getSnippets);
router.get('/:id', snippetController.getSnippetById);
router.post('/', snippetController.createSnippet);
router.put('/:id', snippetController.updateSnippet);
router.delete('/:id', snippetController.deleteSnippet);
router.patch('/:id/favorite', snippetController.toggleFavorite);
router.get('/:id/revisions', snippetController.getSnippetRevisions);

module.exports = router;
