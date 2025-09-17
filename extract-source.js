const { argv, argc, exit } = require("node:process");
const { readFileSync, writeFileSync } = require("node:fs");

if (argc <= 4) {
    console.error("Syntax: node extract-source.js Japanese fr");
    exit(-1);
}

const sourceLanguageName = argv[2];
const targetLanguageCode = argv[3];
const placeholder = argv[4];

const objects = [
    {
        file: "Actors",
        fields: ["name"]
    },
    {
        file: "Armors",
        fields: ["name", "description"],
    },
    {
        file: "Classes",
        fields: ["name"],
    },
    {
        file: "Enemies",
        fields: ["name"],
    },
    {
        file: "Items",
        fields: ["name", "description"],
    },
    {
        file: "Skills",
        fields: ["message1", "message2", "name", "description"],
    },
    {
        file: "Weapons",
        fields: ["name", "description"],
    },
];

const translations = JSON.parse(String(readFileSync("isat-orig/data/Translations.json")));
const flat = {
    msg: {},
    cmd: {},
    terms: {},
    custom: {},
    objects: {},
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

for (const objectInfo of objects) {
    const objs = JSON.parse(String(readFileSync(`isat-orig/data/${objectInfo.file}.json`)));
    flat.objects[objectInfo.file] = {};

    for (const obj of objs) {
        if (!obj) continue;

        for (const field of objectInfo.fields) {
            flat.objects[objectInfo.file][field] = obj[field];
        }
    }
}

writeFileSync(targetLanguageCode + ".json", JSON.stringify(flat, undefined, 4));
