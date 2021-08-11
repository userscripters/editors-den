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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
(function (w, d) {
    var config = {
        ids: {
            main: "editors-den",
        },
    };
    var addStyles = function (d, id) {
        var style = d.createElement("style");
        d.head.append(style);
        var sheet = style.sheet;
        if (!sheet)
            return;
        var inkAndQuill = "https://upload.wikimedia.org/wikipedia/commons/c/c4/Quill_and_ink.svg";
        sheet.insertRule("#" + id + " strong {\n            background-color: var(--black-400);\n            mask-image: url(" + inkAndQuill + ");\n            mask-repeat: no-repeat;\n            mask-size: 18px 18px;\n            mask-origin: content-box;\n            mask-position: center;\n            -webkit-mask-image: url(" + inkAndQuill + ");\n            -webkit-mask-repeat: no-repeat;\n            -webkit-mask-size: 18px 18px;\n            -webkit-mask-origin: content-box;\n            -webkit-mask-position: center;\n            min-height: 18px;\n        }");
        sheet.insertRule("#" + id + " .-link:hover strong {\n            background-color: var(--black-700);\n        }");
    };
    var makeStacksIcon = function (name, pathConfig, _a) {
        var _b;
        var _c = _a === void 0 ? {} : _a, _d = _c.classes, classes = _d === void 0 ? [] : _d, _e = _c.width, width = _e === void 0 ? 14 : _e, _f = _c.height, height = _f === void 0 ? width : _f;
        var ns = "http://www.w3.org/2000/svg";
        var svg = document.createElementNS(ns, "svg");
        (_b = svg.classList).add.apply(_b, __spreadArray(["svg-icon", name], __read(classes)));
        svg.setAttribute("width", width.toString());
        svg.setAttribute("height", height.toString());
        svg.setAttribute("viewBox", "0 0 " + width + " " + height);
        svg.setAttribute("aria-hidden", "true");
        var path = document.createElementNS(ns, "path");
        path.setAttribute("d", pathConfig);
        svg.append(path);
        return [svg, path];
    };
    var makeStacksToast = function (id, text, _a) {
        var _b, _c;
        var _d = _a === void 0 ? {} : _a, _e = _d.buttons, buttons = _e === void 0 ? [] : _e, _f = _d.classes, classes = _f === void 0 ? [] : _f, _g = _d.msgClasses, msgClasses = _g === void 0 ? [] : _g, _h = _d.type, type = _h === void 0 ? "none" : _h, _j = _d.important, important = _j === void 0 ? false : _j;
        var wrap = document.createElement("div");
        (_b = wrap.classList).add.apply(_b, __spreadArray(["s-toast"], __read(classes)));
        wrap.setAttribute("aria-hidden", "true");
        wrap.setAttribute("role", "alertdialog");
        wrap.setAttribute("aria-labelledby", "notice-message");
        wrap.id = id;
        var aside = document.createElement("aside");
        aside.classList.add("s-notice", "p8", "pl16");
        if (type !== "none")
            aside.classList.add("s-notice__" + type);
        if (important)
            aside.classList.add("s-notice__important");
        var msgWrap = document.createElement("div");
        (_c = msgWrap.classList).add.apply(_c, __spreadArray(["d-flex",
            "gs16",
            "gsx",
            "ai-center",
            "jc-space-between"], __read(msgClasses)));
        var message = document.createElement("div");
        message.classList.add("flex--item");
        message.textContent = text;
        var btnWrap = document.createElement("div");
        btnWrap.classList.add("d-flex");
        var dismissBtn = document.createElement("button");
        dismissBtn.type = "button";
        dismissBtn.classList.add("s-btn", "s-notice--btn");
        dismissBtn.setAttribute("aria-label", "Dismiss");
        buttons.push(dismissBtn);
        var _k = __read(makeStacksIcon("iconClearSm", "M12 3.41 10.59 2 7 5.59 3.41 2 2 3.41 5.59 7 2 10.59 3.41 12 7 8.41 10.59 12 12 10.59 8.41 7 12 3.41z", { width: 14 }), 1), dismissIcon = _k[0];
        dismissBtn.append(dismissIcon);
        btnWrap.append.apply(btnWrap, __spreadArray([], __read(buttons)));
        msgWrap.append(message, btnWrap);
        aside.append(msgWrap);
        wrap.append(aside);
        return wrap;
    };
    var toggleToast = function (target, show) {
        var toast = typeof target === "string"
            ? document.querySelector(target)
            : target;
        if (!toast)
            throw new ReferenceError("missing toast: " + target);
        var isShown = toast.getAttribute("aria-hidden") !== "true";
        toast.setAttribute("aria-hidden", (show !== void 0 ? !show : isShown).toString());
        return toast;
    };
    var hideToast = function (target, hideFor) {
        var toast = toggleToast(target, false);
        if (hideFor)
            setTimeout(function () { return showToast(toast); }, hideFor * 1e3);
    };
    var showToast = function (target, showFor) {
        var toast = toggleToast(target, true);
        if (showFor)
            setTimeout(function () { return hideToast(toast); }, showFor * 1e3);
    };
    var makeMenuItem = function (id) {
        var item = d.createElement("li");
        item.classList.add("-item");
        item.id = id;
        item.title = "Apply auto-edits";
        var link = d.createElement("a");
        link.classList.add("-link");
        var text = d.createElement("strong");
        text.textContent = "E&D";
        link.append(text);
        item.append(link);
        return item;
    };
    var addMenuItem = function (itemId, action) {
        var menu = d.querySelector("ol.user-logged-in, ol.user-logged-out");
        if (!menu)
            return console.debug("failed to find main menu");
        var item = d.getElementById(itemId) || makeMenuItem(itemId);
        if (item.isConnected)
            return;
        menu.append(item);
        item.addEventListener("click", function (event) {
            event.preventDefault();
            action();
        });
    };
    var asyncReduce = function (array, init) {
        return array.reduce(function (a, c) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = c;
                    return [4, a];
                case 1: return [4, _a.apply(void 0, [_b.sent()])];
                case 2: return [2, _b.sent()];
            }
        }); }); }, Promise.resolve(init));
    };
    var getMatchingTags = function (search, version) {
        if (version === void 0) { version = 2.3; }
        return __awaiter(void 0, void 0, void 0, function () {
            var uri, res, items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uri = new URL("https://api.stackexchange.com/" + version + "/tags");
                        uri.search = new URLSearchParams({
                            site: location.hostname,
                            inname: search.toLowerCase(),
                            key: "C0zI0cCMTw5GRQIqHhvTHw((",
                        }).toString();
                        return [4, fetch(uri.toString())];
                    case 1:
                        res = _a.sent();
                        if (!res.ok)
                            return [2, []];
                        return [4, res.json()];
                    case 2:
                        items = (_a.sent()).items;
                        return [2, items];
                }
            });
        });
    };
    var inlineLinksToRefs = function (text) {
        var linkRegex = /\[([\w\s:'#-?]+)\]\(([\w:/.#-]+)\)/gim;
        var refsRegex = /\[\d+\]: \w+/gim;
        var refMatches = __spreadArray([], __read(text.matchAll(refsRegex)));
        var existing = refMatches.length;
        var matches = __spreadArray([], __read(text.matchAll(linkRegex)));
        var refsToAdd = matches.reduce(function (acc, _a, idx) {
            var _b = __read(_a, 3), _ = _b[0], _text = _b[1], link = _b[2];
            return acc + "[" + (existing + idx + 1) + "]: " + link + "\n";
        }, "");
        return text + "\n\n" + refsToAdd;
    };
    var capitalize = function (text) {
        var brands = [
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
        return brands.reduce(function (a, c) {
            return a.replace(new RegExp("(\\s+|^)" + c + "(\\s+|$)", "gmi"), "$1" + c + "$2");
        }, text);
    };
    var removeExcessiveLinkFormatting = function (text) {
        return text.replace(/\*{2}(\[.+?\]\(.+?\))\*{2}/gim, "$1");
    };
    var reorderPunctuation = function (text) {
        return text.replace(/([?!,.])(\s+\(.+?\))/gm, "$2$1");
    };
    var removeSalutations = function (text) { return text.replace(/^Hi\b/i, ""); };
    var removeEmptyLines = function (text) { return text.replace(/(?:^\n$)+/gim, ""); };
    var removeNoise = function (text) {
        return text.replace(/^-*?(?:update|edit)-*?$/gim, "---");
    };
    var removeMultispace = function (text) {
        return text.replace(/\b[ ]{2,}/gm, " ").trim();
    };
    var secureLinks = function (text) {
        return text.replace(/\bhttp:\/\//gim, "https://");
    };
    var removeSpacesBeforePunctuation = function (text) {
        return text.replace(/\s+([,.?!])/gm, "$1");
    };
    var removeTagDuplication = function (title) { return __awaiter(void 0, void 0, void 0, function () {
        var tagPrefixedRegEx, _a, tagname, lcased, tags, matchingTag;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tagPrefixedRegEx = /^(\w+)\s+-\s+/i;
                    _a = __read(tagPrefixedRegEx.exec(title) || [], 2), tagname = _a[1];
                    if (!tagname)
                        return [2, title];
                    lcased = tagname.toLowerCase();
                    return [4, getMatchingTags(lcased)];
                case 1:
                    tags = _b.sent();
                    matchingTag = tags.find(function (_a) {
                        var name = _a.name;
                        return name === lcased;
                    });
                    return [2, matchingTag ? title.replace(tagPrefixedRegEx, "") : title];
            }
        });
    }); };
    w.addEventListener("load", function () {
        var mainId = config.ids.main;
        addStyles(d, mainId);
        var notEditableToast = makeStacksToast(mainId + "-no-editable", "This is not a page you are looking for", {
            important: true,
            type: "warning",
        });
        var editSuccessToast = makeStacksToast(mainId + "-edit-success", "Successfully edited", {
            important: true,
            type: "success",
        });
        d.body.append(notEditableToast, editSuccessToast);
        addMenuItem(mainId, function () { return __awaiter(void 0, void 0, void 0, function () {
            var area, title, bodyFixers, titleFixers, event, fixed, titleFixed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        area = d.querySelector("[name=post-text]");
                        title = d.getElementById("title");
                        if (!area && !title)
                            return [2, showToast(notEditableToast, 3)];
                        bodyFixers = [
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
                        titleFixers = [
                            removeMultispace,
                            capitalize,
                            removeTagDuplication,
                        ];
                        event = new Event("input", {
                            bubbles: true,
                            cancelable: true,
                        });
                        if (!area) return [3, 2];
                        return [4, asyncReduce(bodyFixers, area.value)];
                    case 1:
                        fixed = _a.sent();
                        area.value = fixed;
                        area.dispatchEvent(event);
                        _a.label = 2;
                    case 2:
                        if (!title) return [3, 4];
                        return [4, asyncReduce(titleFixers, title.value)];
                    case 3:
                        titleFixed = _a.sent();
                        title.value = titleFixed;
                        title.dispatchEvent(event);
                        _a.label = 4;
                    case 4:
                        showToast(editSuccessToast, 3);
                        return [2];
                }
            });
        }); });
    });
})(window, document);
