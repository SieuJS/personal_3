// templateEngine.js
const fs = require("fs");
const executeIfStatements = require("./executeIf");

class Command {
    constructor ({statement, command , startPoint}) {
        this.statement = statement;
        this.command  = command;
        this.startPoint = startPoint;
    }
}

function customTemplateEngine(filePath, options, callback) {
  fs.readFile(filePath, "utf-8", (err, content) => {
    if (err) return callback(new Error(err));

    const rendered = parseTemplate(content, options);
    return callback(null, rendered);
  });
}

const mark = "21321";

function parseTemplate(content, context) {
  let result = "";
  let currentPos = 0;
  let prevTextEnd = 0;

  // collect command
  while (currentPos < content.length) {
    let startCommandBlock = content.indexOf(`${mark}`) + mark.length + 1;

    let closeCommandTag = content.indexOf("}", startCommandBlock);

    let command = content.slice(startCommandBlock, closeCommandTag);
    detemineCommand(command, content, context);
    // Find out  the next command
    return;
  }
}

function findCommand(content, context, currentPos) {
  let startCommandBlock = content.indexOf(`${mark}`, currentPos) + mark.length + 1;

  let closeCommandTag = content.indexOf("}", startCommandBlock);

  let command = content.slice(startCommandBlock, closeCommandTag);
  detemineCommand(command, content, context, startCommandBlock);
}

function detemineCommand(command, content, context, startPoint) {
  const fracment = command.split(" ");

  if (fracment[0] === "if") {
    return new Command({statement : command, command : "if", startPoint })
    console.log(context[fracment[1].toLowerCase()]);
  }
  if (command.startsWith("for")) {
    console.log("for statement");
  }
}

module.exports = customTemplateEngine;
