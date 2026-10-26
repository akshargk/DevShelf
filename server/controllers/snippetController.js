const prisma = require('../config/db');
const SnippetRevision = require('../models/SnippetRevision');

// Helper to normalize tags array
const normalizeTags = (tagsInput) => {
  if (!tagsInput) return [];
  if (Array.isArray(tagsInput)) {
    return tagsInput
      .map((t) => (typeof t === 'string' ? t.trim().toLowerCase() : ''))
      .filter(Boolean);
  }
  if (typeof tagsInput === 'string') {
    return tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
  }
  return [];
};

// Helper to sanitize code: unescapes literal "\n" or "\r\n" if code was sent as double-escaped string
const sanitizeCode = (raw) => {
  if (typeof raw !== 'string') return '';
  if (!raw.includes('\n') && raw.includes('\\n')) {
    return raw.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\t/g, '  ').trim();
  }
  return raw.trim();
};

// GET /api/snippets
const getSnippets = async (req, res, next) => {
  try {
    const userId = Number(req.user?.id);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const { search, language, tag, favorite } = req.query;

    const where = {
      userId,
    };

    // Filter by favorite
    if (favorite === 'true' || favorite === true) {
      where.isFavorite = true;
    }

    // Filter by language
    if (language && language !== 'all') {
      where.language = {
        equals: language,
        mode: 'insensitive',
      };
    }

    // Filter by tag
    if (tag && tag !== 'all') {
      where.tags = {
        some: {
          name: {
            equals: tag.toLowerCase(),
            mode: 'insensitive',
          },
        },
      };
    }

    // Search by title, code, or description
    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { code: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
      ];
    }

    const snippets = await prisma.snippet.findMany({
      where,
      include: {
        tags: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return res.json({
      success: true,
      count: snippets.length,
      snippets,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/snippets/:id
const getSnippetById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid snippet ID' });
    }

    const snippet = await prisma.snippet.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
      include: {
        tags: {
          select: { id: true, name: true },
        },
      },
    });

    if (!snippet) {
      return res.status(404).json({ success: false, message: 'Snippet not found' });
    }

    return res.json({ success: true, snippet });
  } catch (error) {
    next(error);
  }
};

// POST /api/snippets
const createSnippet = async (req, res, next) => {
  try {
    const { title, code, language, description, tags, changeNote } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: 'Code is required' });
    }
    if (!language || !language.trim()) {
      return res.status(400).json({ success: false, message: 'Programming language is required' });
    }

    const cleanTags = normalizeTags(tags);

    // Build tag connectOrCreate objects
    const tagConnectOrCreate = cleanTags.map((tagName) => ({
      where: { name: tagName },
      create: { name: tagName },
    }));

    // Create snippet in PostgreSQL via Prisma
    const snippet = await prisma.snippet.create({
      data: {
        userId: req.user.id,
        title: title.trim(),
        code: sanitizeCode(code),
        language: language.trim().toLowerCase(),
        description: description ? description.trim() : null,
        tags: {
          connectOrCreate: tagConnectOrCreate,
        },
      },
      include: {
        tags: {
          select: { id: true, name: true },
        },
      },
    });

    // Module 3: Store initial version in MongoDB
    try {
      await SnippetRevision.create({
        snippetId: snippet.id,
        version: 1,
        title: snippet.title,
        code: snippet.code,
        language: snippet.language,
        description: snippet.description || '',
        tags: snippet.tags.map((t) => t.name),
        changedAt: new Date(),
        changeNote: changeNote || 'Initial snippet creation',
      });
    } catch (mongoErr) {
      console.warn('[MongoDB] Warning: Failed to record initial revision:', mongoErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Snippet created successfully',
      snippet,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/snippets/:id
const updateSnippet = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid snippet ID' });
    }

    const { title, code, language, description, tags, changeNote } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: 'Code is required' });
    }
    if (!language || !language.trim()) {
      return res.status(400).json({ success: false, message: 'Programming language is required' });
    }

    // 1. Fetch current PostgreSQL version
    const current = await prisma.snippet.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
      include: {
        tags: true,
      },
    });

    if (!current) {
      return res.status(404).json({ success: false, message: 'Snippet not found' });
    }

    // 2. Update PostgreSQL
    const cleanTags = normalizeTags(tags);
    const tagConnectOrCreate = cleanTags.map((tagName) => ({
      where: { name: tagName },
      create: { name: tagName },
    }));

    const updated = await prisma.snippet.update({
      where: { id },
      data: {
        title: title.trim(),
        code: sanitizeCode(code),
        language: language.trim().toLowerCase(),
        description: description ? description.trim() : null,
        tags: {
          set: [], // clear existing relations
          connectOrCreate: tagConnectOrCreate,
        },
      },
      include: {
        tags: {
          select: { id: true, name: true },
        },
      },
    });

    // 3. Save newly updated version to MongoDB revision history (Module 3)
    try {
      const lastRevision = await SnippetRevision.findOne({ snippetId: id })
        .sort({ version: -1 })
        .select('version')
        .lean();
      const nextVersion = lastRevision ? lastRevision.version + 1 : 1;

      await SnippetRevision.create({
        snippetId: id,
        version: nextVersion,
        title: updated.title,
        code: updated.code,
        language: updated.language,
        description: updated.description || '',
        tags: updated.tags.map((t) => t.name),
        changedAt: new Date(),
        changeNote: changeNote || 'Updated snippet content',
      });
    } catch (mongoErr) {
      console.error('[MongoDB] Error archiving revision:', mongoErr.message);

      // Rollback PostgreSQL update to maintain multi-database consistency
      try {
        await prisma.snippet.update({
          where: { id },
          data: {
            title: current.title,
            code: current.code,
            language: current.language,
            description: current.description,
            tags: {
              set: [],
              connectOrCreate: current.tags.map((t) => ({
                where: { name: t.name },
                create: { name: t.name },
              })),
            },
          },
        });
      } catch (rollbackErr) {
        console.error('[Prisma] Rollback failed:', rollbackErr.message);
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to archive snippet revision in MongoDB: ' + mongoErr.message,
      });
    }

    return res.json({
      success: true,
      message: 'Snippet updated successfully',
      snippet: updated,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/snippets/:id
const deleteSnippet = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid snippet ID' });
    }

    const current = await prisma.snippet.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!current) {
      return res.status(404).json({ success: false, message: 'Snippet not found' });
    }

    // Delete in PostgreSQL
    await prisma.snippet.delete({
      where: { id },
    });

    // Clean up MongoDB revisions
    try {
      await SnippetRevision.deleteMany({ snippetId: id });
    } catch (mongoErr) {
      console.warn('[MongoDB] Failed to delete revisions:', mongoErr.message);
    }

    return res.json({
      success: true,
      message: 'Snippet deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/snippets/:id/favorite
const toggleFavorite = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid snippet ID' });
    }

    const snippet = await prisma.snippet.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!snippet) {
      return res.status(404).json({ success: false, message: 'Snippet not found' });
    }

    const updated = await prisma.snippet.update({
      where: { id },
      data: {
        isFavorite: !snippet.isFavorite,
      },
      include: {
        tags: {
          select: { id: true, name: true },
        },
      },
    });

    return res.json({
      success: true,
      message: updated.isFavorite ? 'Marked as favorite' : 'Removed from favorites',
      snippet: updated,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/snippets/:id/revisions
// Module 3: MongoDB Document revision history
const getSnippetRevisions = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid snippet ID' });
    }

    // Verify snippet belongs to user
    const snippet = await prisma.snippet.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
      select: { id: true },
    });

    if (!snippet) {
      return res.status(404).json({ success: false, message: 'Snippet not found' });
    }

    const revisions = await SnippetRevision.find({ snippetId: id })
      .sort({ version: -1 })
      .lean();

    return res.json({
      success: true,
      count: revisions.length,
      revisions,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/snippets/meta/languages-and-tags
// Helper to retrieve distinct languages and tags for current user
const getLanguagesAndTags = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const snippets = await prisma.snippet.findMany({
      where: { userId },
      select: {
        language: true,
        tags: {
          select: { name: true },
        },
      },
    });

    const languagesSet = new Set();
    const tagsSet = new Set();

    snippets.forEach((s) => {
      if (s.language) languagesSet.add(s.language);
      if (s.tags) {
        s.tags.forEach((t) => tagsSet.add(t.name));
      }
    });

    return res.json({
      success: true,
      languages: Array.from(languagesSet).sort(),
      tags: Array.from(tagsSet).sort(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSnippets,
  getSnippetById,
  createSnippet,
  updateSnippet,
  deleteSnippet,
  toggleFavorite,
  getSnippetRevisions,
  getLanguagesAndTags,
};
