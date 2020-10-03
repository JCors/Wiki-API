/** @format */

//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

//	Server Port
const PORT = process.env.PORT || 3000;

// Body Parser
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// EJS
app.set("view engine", "ejs");

// Connect to the Database
mongoose.connect("mongodb://localhost:27017/wikiDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// Create Schema for the Database
const articleSchema = {
	title: String,
	content: String,
};

// Create Model for the Article Schema
const Article = mongoose.model("Article", articleSchema);

// Request Targeting All Articles
app
	.route("/articles")
	.get(function (req, res) {
		Article.find({}, function (err, foundArticles) {
			if (!err) {
				res.send(foundArticles);
			} else {
				console.log(err);
			}
		});
	})
	.delete(function (req, res) {
		Article.deleteMany(function (err) {
			if (!err) {
				res.send("Successfully Deleted All Articles");
			} else {
				res.send(err);
			}
		});
	})
	.post(function (req, res) {
		const newArticles = new Article({
			title: req.body.title,
			content: req.body.content,
		});

		newArticles.save(function (err) {
			if (!err) {
				res.send("Successfully added to a new Article");
			} else {
				res.send(err);
			}
		});
		console.log("Successfully Save Data");
	});

// Request for all specific Articles

app
	.route("/articles/:articlesTitle")
	.get(function (req, res) {
		Article.findOne({ title: req.params.articlesTitle }, function (
			err,
			foundArticles
		) {
			if (foundArticles) {
				res.send(foundArticles);
			} else {
				res.send("No Articles found");
			}
		});
	})

	.put(function (req, res) {
		Article.update(
			{ title: req.params.articlesTitle },
			{ title: req.body.title, content: req.body.content },
			{ overwrite: true },
			function (err) {
				if (!err) {
					res.send("Sucessfully updated the artcle");
				} else {
					res.send(err);
				}
			}
		);
	})

	.patch(function (req, res) {
		Article.update(
			{ title: req.params.articlesTitle },
			{ $set: req.body },
			function (err) {
				if (!err) {
					res.send("Successfully updated the artcle");
				} else {
					res.send(err);
				}
			}
		);
	})

	.delete(function (req, res) {
		Article.deleteOne({title: req.params.articlesTitle}, function (err) {
			if (!err) {
				res.send("Successfully Deleted All Articles");
			} else {
				res.send(err);
			}
		});
	});

// Port listener
app.listen(PORT, () => {
	console.log(`Server is running at port ${PORT}`);
});
