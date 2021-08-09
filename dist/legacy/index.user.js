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
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var asyncReduce, getMatchingTags, inlineLinksToRefs, capitalization, removeExcessiveLinkFormatting, reorderPunctuation, removeSalutations, removeEmptyLines, removeNoise, removeMultispace, secureLinks, removeSpacesBeforePunctuation, removeTagDuplication, area, fixers, fixed, event, title, titleFixers, titleFixed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                asyncReduce = function (array, init) {
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
                getMatchingTags = function (search, version) {
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
                inlineLinksToRefs = function (text) {
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
                capitalization = function (text) {
                    var brands = [
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
                    return brands.reduce(function (a, c) {
                        return a.replace(new RegExp("(\\s+|^)" + c + "(\\s+|$)", "gmi"), "$1" + c + "$2");
                    }, text);
                };
                removeExcessiveLinkFormatting = function (text) {
                    return text.replace(/\*{2}(\[.+?\]\(.+?\))\*{2}/gim, "$1");
                };
                reorderPunctuation = function (text) {
                    return text.replace(/([?!,.])(\s+\(.+?\))/gm, "$2$1");
                };
                removeSalutations = function (text) { return text.replace(/^Hi\b/i, ""); };
                removeEmptyLines = function (text) { return text.replace(/(?:^\n$)+/gim, ""); };
                removeNoise = function (text) {
                    return text.replace(/^-*?(?:update|edit)-*?$/gim, "---");
                };
                removeMultispace = function (text) {
                    return text.replace(/\b[ ]{2,}/gm, " ").trim();
                };
                secureLinks = function (text) {
                    return text.replace(/\bhttp:\/\//gim, "https://");
                };
                removeSpacesBeforePunctuation = function (text) {
                    return text.replace(/\s+([,.?!])/gm, "$1");
                };
                removeTagDuplication = function (title) { return __awaiter(void 0, void 0, void 0, function () {
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
                area = document.querySelector("[name=post-text]");
                if (!area)
                    return [2];
                fixers = [
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
                fixed = fixers.reduce(function (a, c) { return c(a); }, area.value);
                area.value = fixed;
                event = new Event("input", {
                    bubbles: true,
                    cancelable: true,
                });
                area.dispatchEvent(event);
                title = document.getElementById("title");
                if (!title)
                    return [2];
                titleFixers = [
                    removeMultispace,
                    capitalization,
                    removeTagDuplication,
                ];
                return [4, asyncReduce(titleFixers, title.value)];
            case 1:
                titleFixed = _a.sent();
                title.value = titleFixed;
                title.dispatchEvent(event);
                return [2];
        }
    });
}); })();
