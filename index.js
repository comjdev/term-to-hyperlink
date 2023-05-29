function addHyperlinks(text, terms, url, options = {}) {
	if (typeof text !== "string") {
		throw new TypeError("text is expected to be a string.");
	}

	if (typeof url !== "string") {
		throw new TypeError("url is expected to be a string.");
	}

	if (typeof options !== "object") {
		throw new TypeError("options is expected to be a object.");
	}

	if (typeof terms === "string") {
		// Add hyperlink to copy
		text = addHyperlinksToCopy(text, terms, url, options);
	} else if (Array.isArray(terms)) {
		// Sort terms by length, longest first
		terms.sort((a, b) => b.length - a.length);

		// Add hyperlinks to copy
		terms.forEach((term) => {
			if (typeof term !== "string") {
				throw new TypeError(`term "${term}" is expected to be a string`);
			}
			text = addHyperlinksToCopy(text, term, url, options);
		});
	} else {
		throw new TypeError("term is expected to be a string or array of strings.");
	}

	return text;
}

function addHyperlinksToCopy(text, term, url, options) {
	// Step 1: Get hyperlink
	const hyperlink = getHyperlink(term, url, options);

	// Step 2: Replace the term with a hyperlink
	const linkedText = replaceTermWithLink(text, term, hyperlink);

	// Step 3: (Optional) Replace the capitalised term with the hyperlink
	if (!beginsWithUppercaseLetter(term)) return linkedText;

	const capitalizedTerm = term.charAt(0).toUpperCase() + term.slice(1);
	const capitalizedHyperlink = getHyperlink(capitalizedTerm, url, options);

	return replaceTermWithLink(linkedText, capitalizedTerm, capitalizedHyperlink);
}

function replaceTermWithLink(text, term, hyperlink) {
	const regex = `(?<!<a.*>)${term}\\b(?!<\\/a>)`;

	const regExp = new RegExp(regex, "g");

	return text.replace(regExp, hyperlink);
}

function getHyperlink(term, url, options) {
	const defaults = {
		class: undefined,
		target: undefined,
		rel: "noopener noreferrer",
	};

	const settings = Object.assign({}, defaults, options);

	// Remove undefined values
	for (let key in settings) {
		if (settings[key] === undefined) {
			delete settings[key];
		}
	}

	const attributes = Object.keys(settings)
		.map((key) => `${key}="${settings[key]}"`)
		.join(" ");

	return `<a href="${url}" ${attributes}>${term}</a>`;
}

function beginsWithUppercaseLetter(str) {
	return /[A-Z].*/.test(str);
}

module.exports = addHyperlinks;
