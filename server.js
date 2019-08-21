"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var dns = require("dns");

const shortUrl = require("./models.js");

var cors = require("cors");

var app = express();

// Basic Configuration
require("dotenv").config();
var port = process.env.PORT || 3000;

/** this project needs a db !! **/
console.log(process.env.MONGOLAB_URI);

mongoose.connect(process.env.MONGOLAB_URI, { useNewUrlParser: true });

app.use(cors());

// mounting the body-parser here
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
	res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/api/shorturl/:word", (req, res) => {
	let word = req.params.word;
	console.log(word);
	shortUrl.findOne({ short_url: word }, (err, data) => {
		if (err) {
			return err;
		}
		console.log(data.org_url);
		res.redirect(301, data.org_url);
		//    return (null, data);
	});
});

app.post("/api/shorturl/new", function(req, res) {
	// console.log("YES");
	console.log(req.body.url);
	let randomInt = Math.floor(Math.random() * 100);
	let a = req.body.url.split("https://");
	// console.log(a[1]);
	// console.log(randomInt);
	dns.lookup(a[1], (err, addresses, family) => {
		if (err) {
			// console.log(err);
			res.json({ error: "invalid URL" });
			return err;
		} else {
			shortUrl.findOne({ org_url: req.body.url }, (err, data) => {
				if (err) {
				}
				console.log(data);
				if (data === null) {
					createAndSaveShortUrl(req.body.url, randomInt.toString());
					res.json({
						original_url: req.body.url,
						short_url: randomInt.toString()
					});
				} else {
					console.log(data);
					res.json({
						duplicate: "URL Already Exists",
						short_url: data.short_url
					});
				}
			});
		}
	});
});

var createAndSaveShortUrl = function(org, short) {
	var _shortUrl = new shortUrl({ org_url: org, short_url: short });
	_shortUrl.save((err, data) => {
		console.log(data);
		if (err) {
			return err;
		}

		return null, data;
	});
};

app.listen(port, function() {
	console.log("Node.js listening ...");
});
