const Readability = require("./Readability.js");
const polka = require("polka");
const JSDOM = require("jsdom").JSDOM;

const { PORT=3000 } = process.env;

// takes in a DOM object, and returns as many opengraph properties as we can
readOpengraph = (doc) => {
	let propsMap = {
		title: "meta[property='og:title']",
		type: "meta[property='og:type']",
		url: "meta[property='og:url']",
		image: "meta[property='og:image']",
		description: "meta[property='og:description']",
		siteName: "meta[property='og:site_name']",

		published: "meta[property='article:published_time']",
		modified: "meta[property='article:modified_time']",
		author: "meta[property='article:author']",
	};

	let propsMapAll = {
		tag: "meta[property='article:tag']",
	};

	let ret = {};

	Object.keys(propsMap).forEach((key) => {
		let selected = doc.querySelector(propsMap[key]);

		if (selected)
			ret[key] = selected.content;
	});

	Object.keys(propsMapAll).forEach((key) => {
		let selected = doc.querySelectorAll(propsMapAll[key]);

		if (selected) {
			ret[key] = [];

			for (let i = 0; i < selected.length; i++)
				ret[key].push(selected[i].content);
		}
	});

	return ret;
};

polka()
	.post("/api/get", (req, res) => {
		let body = "";

		req.on("data", function (data) {
			body += data;

			// No bodies >10MiB
			if (body.length > 10e6)
				request.connection.destroy();
		});

		req.on("end", function () {
			try {
				let data = JSON.parse(body);

				let doc = new JSDOM(data.content, {
					url: data.url,
				});
				let reader = new Readability(doc.window.document);
				let article = reader.parse();

				let meta = readOpengraph(doc.window.document);

				res.end(JSON.stringify({
					// this is just taken from the HTML by readability
					article: article,
					// this is parsed from the meta tags, and will be more accurate if it is there.
					meta: meta,
				}));

			} catch(e) {
				console.log(e);
				res.statusCode = 400;
				res.end("Bad Request");
			}

		});
	})

	.listen(PORT, err => {
		if (err) throw err;
		console.log(`> Running on localhost:${PORT}`);
	});
