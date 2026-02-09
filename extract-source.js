const { argv, argc, exit } = require("node:process");
const { readFileSync, writeFileSync } = require("node:fs");

if (argc <= 4) {
    console.error("Syntax: node extract-source.js Japanese fr");
    exit(-1);
}

const sourceLanguageName = argv[2];
const targetLanguageCode = argv[3];
const placeholder = argv[4];

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

// EXTRACT TRANSLATIONS IN SCRIPTS

const extractScriptTranslations = (prefix, ops) => {
    for (let i = 0; i < ops.length; i++) {
        let op = ops[i];

        if (op.code !== 111 || op.parameters[0] !== 12 || op.parameters[1] !== "ConfigManager.getLanguage() === \"English\"") continue;

        for (; i < ops.length && (op.code !== 111 || op.parameters[0] !== 12 || op.parameters[1] !== "ConfigManager.getLanguage() === \"Japanese\""); i++) {
            op = ops[i];

            if (op.code === 122 && op.parameters[2] === 0 && op.parameters[3] === 4) {
                let obj = flat;

                for (const key of prefix) {
                    obj = obj[key] ??= {};
                }

                obj[i.toString()] = JSON.stringify(op.parameters[4]); // FIXME ignore those that are actual code
            }
        }
    }
};

JSON.parse(String(readFileSync("isat-orig/data/CommonEvents.json")))
        .filter(Boolean)
        .forEach(e => extractScriptTranslations(['CommonEvents', String(e.id)], e.list))

writeFileSync(targetLanguageCode + ".json", JSON.stringify(flat, undefined, 4));
