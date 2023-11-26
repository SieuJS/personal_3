// templateEngine.js
const fs = require("fs");
const parseTemplate = require('./test')

const mark = "21321";

function customTemplateEngine(filePath, options, callback) {
  fs.readFile(filePath, "utf-8", (err, content) => {
    if (err) return callback(new Error(err));

    const rendered = parseTemplate(content, options);
    return callback(null, rendered);
  });
}





module.exports = customTemplateEngine;
