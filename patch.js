// plugins.js patching

const isJson = (str) => {
	try {
		JSON.parse(str);
		return true;
	} catch {
		return false;
	}
};

const reviveDeepJson = (key, value) => {
	if (typeof value === "string" && isJson(value)) {
		const parsed = JSON.parse(value, reviveDeepJson);

		if (typeof parsed === "string") {
			return value;
		}

		parsed.__rawjson = true;

		return parsed;
	}

	return value;
};

const replaceDeepJson = (key, value) => {
	if (value.__rawjson) {
		delete value.__rawjson;

		return JSON.stringify(value, replaceDeepJson);
	}

	return value;
};

const { readFileSync, writeFileSync } = require("node:fs");
const languageOptionsSnippet = String(readFileSync("./language-options-snippet.js"));
const pluginsJs = String(readFileSync("./isat/js/plugins.js"));
eval(pluginsJs);

// Options

const yepOptionsCode = $plugins.find(p => p.name === "YEP_OptionsCore");
const optionsCategories = JSON.parse(yepOptionsCode.parameters.OptionsCategories, reviveDeepJson);

optionsCategories[0].OptionsList[0].DrawItemCode = JSON.stringify(languageOptionsSnippet);

yepOptionsCode.parameters.OptionsCategories = JSON.stringify(optionsCategories, replaceDeepJson);

// Translation engine

const translation = $plugins.find(p => p.name === "SRD_TranslationEngine");
const translationOptions = translation.parameters;
translationOptions["Default Language"] = "French";
translationOptions["Languages"] = JSON.stringify(["Japanese", "French"]);

writeFileSync("./isat/js/plugins.js", `// Modified by ISAT French Patch ${process.env.COMMIT_HASH ?? 'dev'}\n\nvar $plugins = ${JSON.stringify($plugins)}`);

// Translations.json

const French = "French";
const fr = require("./l10n/fr.json");
const trans = JSON.parse(String(readFileSync("./isat/data/Translations.json")));

const appendTrans = (cat) => {
	for (const msg in fr[cat]) {

		trans[cat] ??= {};


		if (cat === "custom") {
			if (!trans[cat][French]) {
				trans[cat][French] = {};
			}

			trans[cat][French][msg] = fr[cat][msg];
		} else {
			trans[cat][msg] ??= {};
			trans[cat][msg][French] = fr[cat][msg];
		}
	}
};

appendTrans("msg");
appendTrans("cmd");
appendTrans("term");
appendTrans("custom");
appendTrans("hardcoded");

writeFileSync("./isat/data/Translations.json", JSON.stringify(trans));
