/**
 * Syntax: node extract.js fr
 */

const { argv, argc, exit } = require("node:process");
const { readFileSync, writeFileSync } = require("node:fs");

if (argc <= 4) {
    console.error("Syntax: node extract.js fr");
    exit(-1);
}

const languageCode = argv[2];

const translations = JSON.parse(String(readFileSync("Translations.json")));
const flat = {msg: {}, custom: {}};

for (const msg in translations.msg) {
    flat.msg[msg] = "";
}

for (const msg in translations.custom["Japanese"]) {
    flat.custom[msg] = "";
}

// TODO terms, commands, etc

writeFileSync(languageCode + ".json", JSON.stringify(flat, undefined, 4));
