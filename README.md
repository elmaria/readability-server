# readability-server

A HTTP server exposing [Mozilla's Readability](https://github.com/mozilla/readability).

I made this for use in one of my own projects, though it may well be useful elsewhere!

Please file an issue if you find anything wrong :)

## Running

```
PORT=3000 node index.js
```

## Usage
```
curl -XPOST --data '{"url":"http://google.com", "content": "<body>readability<script>alert('pwned')</script></body>"}' localhost:8000/api/get

->

{
  "title": "",
  "byline": null,
  "dir": null,
  "content": "<div id=\"readability-page-1\" class=\"page\">readability</div>",
  "textContent": "readability",
  "length": 11,
  "siteName": null
}

```