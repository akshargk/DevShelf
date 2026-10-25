const mongoose = require('mongoose');

const snippetRevisionSchema = new mongoose.Schema(
  {
    snippetId: {
      type: Number,
      required: true,
      index: true,
    },
    version: {
      type: Number,
      required: true,
      default: 1,
    },
    title: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changeNote: {
      type: String,
      default: 'Previous version archived before update',
    },
  },
  {
    collection: 'snippet_revisions',
    timestamps: true,
  }
);

module.exports = mongoose.model('SnippetRevision', snippetRevisionSchema);
