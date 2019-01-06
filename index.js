const Readability = require("./Readability.js");
const polka = require("polka");
const JSDOM = require("jsdom").JSDOM;

const { PORT=3000 } = process.env;

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
			let data = JSON.parse(body);

			let doc = new JSDOM(data.content, {
				url: data.url,
			});
			let reader = new Readability(doc.window.document);
			let article = reader.parse();

			res.end(JSON.stringify(article));
		});
	})

	.listen(PORT, err => {
		if (err) throw err;
		console.log(`> Running on localhost:${PORT}`);
	});
