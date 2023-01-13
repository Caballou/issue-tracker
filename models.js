const mongoose = require('mongoose');
const { Schema } = mongoose;

const IssueSchema = new Schema({
  project: String,
  issue_title: { type: String, require: true},
  issue_text: { type: String, require: true},
  created_on: Date,
  updated_on: Date,
  created_by: { type: String, require: true},
  assigned_to: String,
  open: Boolean,
  status_text: String
});

const Issues = mongoose.model('Issue', IssueSchema);

exports.Issues = Issues;
