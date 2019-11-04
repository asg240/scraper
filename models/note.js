const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let NoteSchema = new Schema({
  articleID: String,
  body: String
});


let Note = mongoose.model("Note", NoteSchema);




module.exports = Note;