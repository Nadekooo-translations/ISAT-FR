/**
 * Syntax: node extract.js English en
 */

const { argv, argc, exit } = require("node:process");
const { readFileSync, writeFileSync } = require("node:fs");

if (argc <= 4) {
    console.error("Syntax: node extract.js English en");
    exit(-1);
}

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

const languageName = argv[2];
const languageCode = argv[3];

const translations = JSON.parse(String(readFileSync("isat-orig/data/Translations.json")));
const flat = {
    msg: {},
    cmd: {},
    terms: {},
    custom: {},
    objects: {},
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

for (const objectInfo of objects) {
    const objs = JSON.parse(String(readFileSync(`isat-orig/data/${objectInfo.file}.json`)));
    flat.objects[objectInfo.file] = {};

    for (const [idx, obj] of Object.entries(objs)) {
        if (!obj) continue;

        for (const field of objectInfo.fields) {
            if (!flat.objects[objectInfo.file][idx]) {
                flat.objects[objectInfo.file][idx] = {};
            }

            flat.objects[objectInfo.file][idx][field] = obj[field];
        }
    }
}

writeFileSync(languageCode + ".json", JSON.stringify(flat, undefined, 4));
