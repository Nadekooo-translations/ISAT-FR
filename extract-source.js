const { argv, argc, exit } = require("node:process");
const { readFileSync, writeFileSync } = require("node:fs");

if (argc <= 4) {
    console.error("Syntax: node extract-source.js Japanese fr");
    exit(-1);
}

const sourceLanguageName = argv[2];
const targetLanguageCode = argv[3];
const placeholder = argv[4];

const translations = JSON.parse(String(readFileSync("Translations.json")));
const flat = {
    msg: {},
    cmd: {},
    terms: {},
    custom: {},
};

for (const msg in translations.msg) {
    if (placeholder) {
        flat.msg[msg] = msg;
    } else {
        flat.msg[msg] = "";
    }
}

for (const cmd in translations.cmd) {
    if (placeholder) {
        flat.cmd[cmd] = cmd;
    } else {
        flat.cmd[cmd] = "";
    }
}

for (const term in translations.terms) {
    if (placeholder) {
        flat.terms[term] = term;
    } else {
        flat.terms[term] = "";
    }
}

for (const msg in translations.custom[sourceLanguageName]) {
    if (placeholder) {
        flat.custom[msg] = msg;
    } else {
        flat.custom[msg] = "";
    }
}

writeFileSync(targetLanguageCode + ".json", JSON.stringify(flat, undefined, 4));
