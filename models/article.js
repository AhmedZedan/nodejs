const mongoose = require("mongoose");

const schema = mongoose.Schema;

// the schema of the document 
const articleSchema = new schema({
    title: String,
    body: String,
    numberOfLikes: Number
});

// create the model that will use this schema
const article = mongoose.model("article", articleSchema);

// to be able to use the article model in the endpoints in the index file
// we should export it
module.exports = article;