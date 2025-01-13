/**
 * Syntax: node extract.js English en
 */

const { argv, argc, exit } = require("node:process");
const { readFileSync, writeFileSync } = require("node:fs");

if (argc <= 4) {
    console.error("Syntax: node extract.js English en");
    exit(-1);
}

const languageName = argv[2];
const languageCode = argv[3];

const translations = JSON.parse(String(readFileSync("Translations.json")));
const flat = {
    msg: {},
    cmd: {},
    terms: {},
    custom: {},
};

for (const msg in translations.msg) {
    flat.msg[msg] = translations.msg[msg][languageName];
}

for (const cmd in translations.cmd) {
    flat.cmd[cmd] = translations.cmd[cmd][languageName];
}

for (const term in translations.terms) {
    flat.terms[term] = translations.terms[term][languageName];
}

for (const msg in translations.custom[languageName]) {
    flat.custom[msg] = translations.custom[languageName][msg];
}

writeFileSync(languageCode + ".json", JSON.stringify(flat, undefined, 4));
