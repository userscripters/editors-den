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
// @version         0.1.0
// ==/UserScript==

"use strict";
((w, d) => {
    const config = {
        ids: {
            main: "editors-den",
        },
    };
    const addStyles = (d, id) => {
        const style = d.createElement("style");
        d.head.append(style);
        const { sheet } = style;
        if (!sheet)
            return;
        const inkAndQuill = "https://upload.wikimedia.org/wikipedia/commons/c/c4/Quill_and_ink.svg";
        sheet.insertRule(`#${id} strong {
            background-color: var(--black-400);
            mask-image: url(${inkAndQuill});
            mask-repeat: no-repeat;
            mask-size: 18px 18px;
            mask-origin: content-box;
            mask-position: center;
            -webkit-mask-image: url(${inkAndQuill});
            -webkit-mask-repeat: no-repeat;
            -webkit-mask-size: 18px 18px;
            -webkit-mask-origin: content-box;
            -webkit-mask-position: center;
            min-height: 18px;
        }`);
        sheet.insertRule(`#${id} .-link:hover strong {
            background-color: var(--black-700);
        }`);
    };
    const makeStacksIcon = (name, pathConfig, { classes = [], width = 14, height = width } = {}) => {
        const ns = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(ns, "svg");
        svg.classList.add("svg-icon", name, ...classes);
        svg.setAttribute("width", width.toString());
        svg.setAttribute("height", height.toString());
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        svg.setAttribute("aria-hidden", "true");
        const path = document.createElementNS(ns, "path");
        path.setAttribute("d", pathConfig);
        svg.append(path);
        return [svg, path];
    };
    const makeStacksToast = (id, text, { buttons = [], classes = [], msgClasses = [], type = "none", important = false, } = {}) => {
        const wrap = document.createElement("div");
        wrap.classList.add("s-toast", ...classes);
        wrap.setAttribute("aria-hidden", "true");
        wrap.setAttribute("role", "alertdialog");
        wrap.setAttribute("aria-labelledby", "notice-message");
        wrap.id = id;
        const aside = document.createElement("aside");
        aside.classList.add("s-notice", "p8", "pl16");
        if (type !== "none")
            aside.classList.add(`s-notice__${type}`);
        if (important)
            aside.classList.add("s-notice__important");
        const msgWrap = document.createElement("div");
        msgWrap.classList.add("d-flex", "gs16", "gsx", "ai-center", "jc-space-between", ...msgClasses);
        const message = document.createElement("div");
        message.classList.add("flex--item");
        message.textContent = text;
        const btnWrap = document.createElement("div");
        btnWrap.classList.add("d-flex");
        const dismissBtn = document.createElement("button");
        dismissBtn.type = "button";
        dismissBtn.classList.add("s-btn", "s-notice--btn");
        dismissBtn.setAttribute("aria-label", "Dismiss");
        buttons.push(dismissBtn);
        const [dismissIcon] = makeStacksIcon("iconClearSm", "M12 3.41 10.59 2 7 5.59 3.41 2 2 3.41 5.59 7 2 10.59 3.41 12 7 8.41 10.59 12 12 10.59 8.41 7 12 3.41z", { width: 14 });
        dismissBtn.append(dismissIcon);
        btnWrap.append(...buttons);
        msgWrap.append(message, btnWrap);
        aside.append(msgWrap);
        wrap.append(aside);
        return wrap;
    };
    const toggleToast = (target, show) => {
        const toast = typeof target === "string"
            ? document.querySelector(target)
            : target;
        if (!toast)
            throw new ReferenceError(`missing toast: ${target}`);
        const isShown = toast.getAttribute("aria-hidden") !== "true";
        toast.setAttribute("aria-hidden", (show !== void 0 ? !show : isShown).toString());
        return toast;
    };
    const hideToast = (target, hideFor) => {
        const toast = toggleToast(target, false);
        if (hideFor)
            setTimeout(() => showToast(toast), hideFor * 1e3);
    };
    const showToast = (target, showFor) => {
        const toast = toggleToast(target, true);
        if (showFor)
            setTimeout(() => hideToast(toast), showFor * 1e3);
    };
    const makeMenuItem = (id) => {
        const item = d.createElement("li");
        item.classList.add("-item");
        item.id = id;
        item.title = "Apply auto-edits";
        const link = d.createElement("a");
        link.classList.add("-link");
        const text = d.createElement("strong");
        text.textContent = "E&D";
        link.append(text);
        item.append(link);
        return item;
    };
    const addMenuItem = (itemId, action) => {
        const menu = d.querySelector("ol.user-logged-in, ol.user-logged-out");
        if (!menu)
            return console.debug("failed to find main menu");
        const item = d.getElementById(itemId) || makeMenuItem(itemId);
        if (item.isConnected)
            return;
        menu.append(item);
        item.addEventListener("click", (event) => {
            event.preventDefault();
            action();
        });
    };
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
    const capitalize = (text) => {
        const brands = [
            "I",
            "Gmail",
            "Google",
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
    const disabledOn = [/chat\.(?:stackoverflow|(meta\.)?stackexchange)\.com/];
    const isDisabled = disabledOn.reduce((_a, c) => c.test(location.href), false);
    if (isDisabled)
        return;
    w.addEventListener("load", () => {
        const mainId = config.ids.main;
        addStyles(d, mainId);
        const notEditableToast = makeStacksToast(`${mainId}-no-editable`, "This is not the page you are looking for", {
            important: true,
            type: "warning",
        });
        const editSuccessToast = makeStacksToast(`${mainId}-edit-success`, "Successfully edited the post", {
            important: true,
            type: "success",
        });
        d.body.append(notEditableToast, editSuccessToast);
        addMenuItem(mainId, async () => {
            const area = d.querySelector("[name=post-text]");
            const title = d.getElementById("title");
            if (!area && !title)
                return showToast(notEditableToast, 3);
            const bodyFixers = [
                capitalize,
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
            const titleFixers = [
                removeMultispace,
                capitalize,
                removeTagDuplication,
            ];
            const event = new Event("input", {
                bubbles: true,
                cancelable: true,
            });
            if (area) {
                const fixed = await asyncReduce(bodyFixers, area.value);
                area.value = fixed;
                area.dispatchEvent(event);
            }
            if (title) {
                const titleFixed = await asyncReduce(titleFixers, title.value);
                title.value = titleFixed;
                title.dispatchEvent(event);
            }
            showToast(editSuccessToast, 3);
        });
    });
})(window, document);
