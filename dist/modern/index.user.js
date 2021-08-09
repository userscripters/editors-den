// ==UserScript==
// @author          Oleg Valter <oleg.a.valter@gmail.com>
// @description     semi-automated editing with style
// @grant           none
// @homepage        https://github.com/userscripters/editors-den#readme
// @match           https://*.askubuntu.com/*
// @match           https://*.mathoverflow.net/*
// @match           https://*.serverfault.com/*
// @match           https://*.stackapps.com/*
// @match           https://*.stackexchange.com/*
// @match           https://*.stackoverflow.com/*
// @name            editors-den
// @namespace       userscripters
// @source          git+https://github.com/userscripters/editors-den.git
// @supportURL      https://github.com/userscripters/editors-den/issues
// @version         1.0.0
// ==/UserScript==

"use strict";
(async () => {
    const asyncReduce = (array, init) => {
        return array.reduce(async (a, c) => await c(await a), Promise.resolve(init));
    };
    const getMatchingTags = async (search, version = 2.3) => {
        const uri = new URL(`https://api.stackexchange.com/${version}/tags`);
        uri.search = new URLSearchParams({
            site: location.hostname,
            inname: search.toLowerCase(),
            key: "C0zI0cCMTw5GRQIqHhvTHw((",
        }).toString();
        const res = await fetch(uri.toString());
        if (!res.ok)
            return [];
        const { items } = await res.json();
        return items;
    };
    const inlineLinksToRefs = (text) => {
        const linkRegex = /\[([\w\s:'#-?]+)\]\(([\w:/.#-]+)\)/gim;
        const refsRegex = /\[\d+\]: \w+/gim;
        const refMatches = [...text.matchAll(refsRegex)];
        const { length: existing } = refMatches;
        const matches = [...text.matchAll(linkRegex)];
        const refsToAdd = matches.reduce((acc, [_, _text, link], idx) => `${acc}[${existing + idx + 1}]: ${link}\n`, "");
        return `${text}\n\n${refsToAdd}`;
    };
    const capitalization = (text) => {
        const brands = [
            "I",
            "Gmail",
            "Firefox",
            "JavaScript",
            "HTML",
            "jQuery",
            "URL",
            "SDK",
            "Safari",
            "Linux",
            "Greasemonkey",
            "API",
        ];
        return brands.reduce((a, c) => a.replace(new RegExp(`(\\s+|^)${c}(\\s+|$)`, "gmi"), `$1${c}$2`), text);
    };
    const removeExcessiveLinkFormatting = (text) => text.replace(/\*{2}(\[.+?\]\(.+?\))\*{2}/gim, "$1");
    const reorderPunctuation = (text) => text.replace(/([?!,.])(\s+\(.+?\))/gm, "$2$1");
    const removeSalutations = (text) => text.replace(/^Hi\b/i, "");
    const removeEmptyLines = (text) => text.replace(/(?:^\n$)+/gim, "");
    const removeNoise = (text) => text.replace(/^-*?(?:update|edit)-*?$/gim, "---");
    const removeMultispace = (text) => text.replace(/\b[ ]{2,}/gm, " ").trim();
    const secureLinks = (text) => text.replace(/\bhttp:\/\//gim, "https://");
    const removeSpacesBeforePunctuation = (text) => text.replace(/\s+([,.?!])/gm, "$1");
    const removeTagDuplication = async (title) => {
        const tagPrefixedRegEx = /^(\w+)\s+-\s+/i;
        const [, tagname] = tagPrefixedRegEx.exec(title) || [];
        if (!tagname)
            return title;
        const lcased = tagname.toLowerCase();
        const tags = await getMatchingTags(lcased);
        const matchingTag = tags.find(({ name }) => name === lcased);
        return matchingTag ? title.replace(tagPrefixedRegEx, "") : title;
    };
    const area = document.querySelector("[name=post-text]");
    if (!area)
        return;
    const fixers = [
        capitalization,
        removeNoise,
        removeEmptyLines,
        removeExcessiveLinkFormatting,
        removeSalutations,
        reorderPunctuation,
        removeSpacesBeforePunctuation,
        inlineLinksToRefs,
        removeMultispace,
        secureLinks,
    ];
    const fixed = fixers.reduce((a, c) => c(a), area.value);
    area.value = fixed;
    const event = new Event("input", {
        bubbles: true,
        cancelable: true,
    });
    area.dispatchEvent(event);
    const title = document.getElementById("title");
    if (!title)
        return;
    const titleFixers = [
        removeMultispace,
        capitalization,
        removeTagDuplication,
    ];
    const titleFixed = await asyncReduce(titleFixers, title.value);
    title.value = titleFixed;
    title.dispatchEvent(event);
})();
