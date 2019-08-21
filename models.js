const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var urlSchema = new Schema({
	org_url: {
		type: String,
		required: true
	},
	short_url: {
		type: String,
		required: true
	}
	// ,
	// createdDate: {
	// 	type: Date,
	// 	default: Date.now
	// }
});
const shortUrl = mongoose.model("shortUrl", urlSchema);
module.exports = shortUrl;
