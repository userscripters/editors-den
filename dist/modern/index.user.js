// ==UserScript==
// @author          Oleg Valter <oleg.a.valter@gmail.com>
// @description     semi-automated editing with style
// @grant           GM_deleteValue
// @grant           GM_getValue
// @grant           GM_listValues
// @grant           GM_setValue
// @homepage        https://github.com/userscripters/editors-den#readme
// @match           https://*.askubuntu.com/*
// @match           https://*.mathoverflow.net/*
// @match           https://*.serverfault.com/*
// @match           https://*.stackapps.com/*
// @match           https://*.stackexchange.com/*
// @match           https://*.stackoverflow.com/*
// @name            editors-den
// @namespace       userscripters
// @run-at          document-start
// @source          git+https://github.com/userscripters/editors-den.git
// @supportURL      https://github.com/userscripters/editors-den/issues
// @version         0.2.1
// ==/UserScript==

"use strict";
((w, d) => {
    const config = {
        ids: {
            main: "editors-den",
        },
    };
    const storageMap = {
        GM_setValue: {
            get length() {
                return GM_listValues().length;
            },
            clear() {
                const keys = GM_listValues();
                return keys.forEach((key) => GM_deleteValue(key));
            },
            key(index) {
                return GM_listValues()[index];
            },
            getItem(key) {
                return GM_getValue(key);
            },
            setItem(key, val) {
                return GM_setValue(key, val);
            },
            removeItem(key) {
                return GM_deleteValue(key);
            },
        },
        GM: {
            get length() {
                return GM.listValues().then((v) => v.length);
            },
            async clear() {
                const keys = await GM.listValues();
                return keys.forEach((key) => GM.deleteValue(key));
            },
            async key(index) {
                return (await GM.listValues())[index];
            },
            async getItem(key) {
                const item = await GM.getValue(key);
                return item === void 0 ? null : item === null || item === void 0 ? void 0 : item.toString();
            },
            setItem(key, val) {
                return GM.setValue(key, val);
            },
            removeItem(key) {
                return GM.deleteValue(key);
            },
        },
    };
    const [, storage] = Object.entries(storageMap).find(([key]) => typeof w[key] !== "undefined") || [];
    class Store {
        static clear() {
            const { storage, prefix } = this;
            storage.removeItem(prefix);
        }
        static async open() {
            const { storage, prefix } = this;
            const val = await storage.getItem(prefix);
            return val ? JSON.parse(val) : {};
        }
        static async has(key) {
            const store = await Store.open();
            return key in store;
        }
        static async load(key, def) {
            const val = (await Store.open())[key];
            return val !== void 0 ? val : def;
        }
        static async save(key, val) {
            const { storage, prefix } = this;
            const old = await Store.open();
            old[key] = val;
            return storage.setItem(prefix, JSON.stringify(old));
        }
        static async toggle(key) {
            return Store.save(key, !(await Store.load(key)));
        }
        static async remove(key) {
            const { prefix } = this;
            const old = await this.load(prefix, {});
            delete old[key];
            return Store.save(key, old);
        }
    }
    Store.storage = storage || localStorage;
    Store.prefix = config.ids.main;
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
    const ruleReducer = async (array, init) => {
        const messages = [];
        const result = await array.reduce(async (acc, [fixer, msg]) => {
            const resolvedAcc = await acc;
            const fixed = await fixer(resolvedAcc);
            if (fixed !== resolvedAcc && msg)
                messages.push(msg);
            return fixed;
        }, Promise.resolve(init));
        return { result, messages };
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
        if (!items.length) {
            return getMatchingTags(search.replace(/[-]/g, ""), version);
        }
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
    const makeCapitalizationFixer = (caps) => (text) => {
        return caps.reduce((a, c) => a
            .replace(new RegExp(`(?:(\`{3,}[\\s\\S]*?|))(?<!(?:http|ws|ftp)s?:\\/\\/.*?)(\\b)${c}(\\b)(?![\\s\\S]*?\`{3,})`, "gmi"), `$1${c}$2`)
            .replace(new RegExp(`(?<!\`{3,}[\\s\\S]*?|\\b(?:http|ws|ftp)s?:\\/\\/.*?)(\\b)${c}(\\b)(?:|[\\s\\S]*?\`{3,})`, "gmi"), `$1${c}$2`), text);
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
        const tagPrefixedRegEx = /^([\w-]{1,35})(?:\s?[-:|])\s+/i;
        const [, tagname] = tagPrefixedRegEx.exec(title) || [];
        if (!tagname)
            return title;
        const lcased = tagname.toLowerCase();
        const tags = await getMatchingTags(lcased);
        const matchingTag = tags.find(({ name }) => name === lcased);
        if (!matchingTag) {
            const notdashed = lcased.replace(/[-]/g, "");
            const tags = await getMatchingTags(notdashed);
            const matchingTag = tags.find(({ name }) => name === notdashed);
            return matchingTag ? title.replace(tagPrefixedRegEx, "") : title;
        }
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
            const summary = d.querySelector(".js-post-edit-comment-field");
            if (!area && !title)
                return showToast(notEditableToast, 3);
            const capsDefaults = [
                "I",
                "Gmail",
                "Google",
                "Firefox",
                "JavaScript",
                "TypeScript",
                "HTML",
                "jQuery",
                "URL",
                "SDK",
                "Safari",
                "Linux",
                "Greasemonkey",
                "API",
            ];
            const capsProp = "capitalizations";
            const isInitialized = await Store.has(capsProp);
            if (!isInitialized) {
                await Store.save(capsProp, capsDefaults);
            }
            const capitalizations = await Store.load(capsProp, capsDefaults);
            const capitalize = makeCapitalizationFixer(capitalizations);
            const bodyFixers = [
                [capitalize, "properly capitalized"],
                [removeNoise, "removed noise"],
                [removeEmptyLines],
                [removeExcessiveLinkFormatting],
                [removeSalutations],
                [reorderPunctuation],
                [removeSpacesBeforePunctuation],
                [inlineLinksToRefs],
                [removeMultispace],
                [secureLinks],
            ];
            const titleFixers = [
                [removeMultispace],
                [
                    removeTagDuplication,
                    "removed tag from title (see https://stackoverflow.com/help/tagging)",
                ],
                [capitalize, "properly capitalized"],
            ];
            const event = new Event("input", {
                bubbles: true,
                cancelable: true,
            });
            const allMessages = new Set();
            if (area) {
                const { result, messages } = await ruleReducer(bodyFixers, area.value);
                messages.forEach((m) => allMessages.add(m));
                area.value = result;
                area.dispatchEvent(event);
            }
            if (title) {
                const { result, messages } = await ruleReducer(titleFixers, title.value);
                messages.forEach((m) => allMessages.add(m));
                title.value = result;
                title.dispatchEvent(event);
            }
            if (summary) {
                summary.value = [...allMessages].join("; ");
                summary.dispatchEvent(new Event("blur", {
                    bubbles: true,
                    cancelable: true,
                }));
            }
            showToast(editSuccessToast, 3);
        });
    });
})(window, document);
