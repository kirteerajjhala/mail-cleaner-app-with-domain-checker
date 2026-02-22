const mongoose = require("mongoose");

const EmailRecordSchema = new mongoose.Schema({
  user: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    email: String,
    username: String,
    role: String,
  },
  email: { type: String },
  subject: { type: String },
  body: { type: String },
  createdAt: { type: Date, default: Date.now },
  EmailType : {type :String , enum :["incoming" , "outgoing"] }
});

module.exports = mongoose.model("EmailRecord", EmailRecordSchema);
