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
    var storageMap = {
        GM_setValue: {
            get length() {
                return GM_listValues().length;
            },
            clear: function () {
                var keys = GM_listValues();
                return keys.forEach(function (key) { return GM_deleteValue(key); });
            },
            key: function (index) {
                return GM_listValues()[index];
            },
            getItem: function (key) {
                return GM_getValue(key);
            },
            setItem: function (key, val) {
                return GM_setValue(key, val);
            },
            removeItem: function (key) {
                return GM_deleteValue(key);
            },
        },
        GM: {
            get length() {
                return GM.listValues().then(function (v) { return v.length; });
            },
            clear: function () {
                return __awaiter(this, void 0, void 0, function () {
                    var keys;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4, GM.listValues()];
                            case 1:
                                keys = _b.sent();
                                return [2, keys.forEach(function (key) { return GM.deleteValue(key); })];
                        }
                    });
                });
            },
            key: function (index) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4, GM.listValues()];
                            case 1: return [2, (_b.sent())[index]];
                        }
                    });
                });
            },
            getItem: function (key) {
                return __awaiter(this, void 0, void 0, function () {
                    var item;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4, GM.getValue(key)];
                            case 1:
                                item = _b.sent();
                                return [2, item === void 0 ? null : item === null || item === void 0 ? void 0 : item.toString()];
                        }
                    });
                });
            },
            setItem: function (key, val) {
                return GM.setValue(key, val);
            },
            removeItem: function (key) {
                return GM.deleteValue(key);
            },
        },
    };
    var _b = __read(Object.entries(storageMap).find(function (_b) {
        var _c = __read(_b, 1), key = _c[0];
        return typeof w[key] !== "undefined";
    }) || [], 2), storage = _b[1];
    var Store = (function () {
        function Store() {
        }
        Store.clear = function () {
            var _b = this, storage = _b.storage, prefix = _b.prefix;
            storage.removeItem(prefix);
        };
        Store.open = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _b, storage, prefix, val;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = this, storage = _b.storage, prefix = _b.prefix;
                            return [4, storage.getItem(prefix)];
                        case 1:
                            val = _c.sent();
                            return [2, val ? JSON.parse(val) : {}];
                    }
                });
            });
        };
        Store.has = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var store;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4, Store.open()];
                        case 1:
                            store = _b.sent();
                            return [2, key in store];
                    }
                });
            });
        };
        Store.load = function (key, def) {
            return __awaiter(this, void 0, void 0, function () {
                var val;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4, Store.open()];
                        case 1:
                            val = (_b.sent())[key];
                            return [2, val !== void 0 ? val : def];
                    }
                });
            });
        };
        Store.save = function (key, val) {
            return __awaiter(this, void 0, void 0, function () {
                var _b, storage, prefix, old;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = this, storage = _b.storage, prefix = _b.prefix;
                            return [4, Store.open()];
                        case 1:
                            old = _c.sent();
                            old[key] = val;
                            return [2, storage.setItem(prefix, JSON.stringify(old))];
                    }
                });
            });
        };
        Store.toggle = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _c = (_b = Store).save;
                            _d = [key];
                            return [4, Store.load(key)];
                        case 1: return [2, _c.apply(_b, _d.concat([!(_e.sent())]))];
                    }
                });
            });
        };
        Store.remove = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var prefix, old;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            prefix = this.prefix;
                            return [4, this.load(prefix, {})];
                        case 1:
                            old = _b.sent();
                            delete old[key];
                            return [2, Store.save(key, old)];
                    }
                });
            });
        };
        Store.storage = storage || localStorage;
        Store.prefix = config.ids.main;
        return Store;
    }());
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
    var makeStacksIcon = function (name, pathConfig, _b) {
        var _c;
        var _d = _b === void 0 ? {} : _b, _e = _d.classes, classes = _e === void 0 ? [] : _e, _f = _d.width, width = _f === void 0 ? 14 : _f, _g = _d.height, height = _g === void 0 ? width : _g;
        var ns = "http://www.w3.org/2000/svg";
        var svg = document.createElementNS(ns, "svg");
        (_c = svg.classList).add.apply(_c, __spreadArray(["svg-icon", name], __read(classes)));
        svg.setAttribute("width", width.toString());
        svg.setAttribute("height", height.toString());
        svg.setAttribute("viewBox", "0 0 " + width + " " + height);
        svg.setAttribute("aria-hidden", "true");
        var path = document.createElementNS(ns, "path");
        path.setAttribute("d", pathConfig);
        svg.append(path);
        return [svg, path];
    };
    var makeStacksToast = function (id, text, _b) {
        var _c, _d;
        var _e = _b === void 0 ? {} : _b, _f = _e.buttons, buttons = _f === void 0 ? [] : _f, _g = _e.classes, classes = _g === void 0 ? [] : _g, _h = _e.msgClasses, msgClasses = _h === void 0 ? [] : _h, _j = _e.type, type = _j === void 0 ? "none" : _j, _k = _e.important, important = _k === void 0 ? false : _k;
        var wrap = document.createElement("div");
        (_c = wrap.classList).add.apply(_c, __spreadArray(["s-toast"], __read(classes)));
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
        (_d = msgWrap.classList).add.apply(_d, __spreadArray(["d-flex",
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
        var _l = __read(makeStacksIcon("iconClearSm", "M12 3.41 10.59 2 7 5.59 3.41 2 2 3.41 5.59 7 2 10.59 3.41 12 7 8.41 10.59 12 12 10.59 8.41 7 12 3.41z", { width: 14 }), 1), dismissIcon = _l[0];
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
        return array.reduce(function (a, c) { return __awaiter(void 0, void 0, void 0, function () { var _b; return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = c;
                    return [4, a];
                case 1: return [4, _b.apply(void 0, [_c.sent()])];
                case 2: return [2, _c.sent()];
            }
        }); }); }, Promise.resolve(init));
    };
    var getMatchingTags = function (search, version) {
        if (version === void 0) { version = 2.3; }
        return __awaiter(void 0, void 0, void 0, function () {
            var uri, res, items;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        uri = new URL("https://api.stackexchange.com/" + version + "/tags");
                        uri.search = new URLSearchParams({
                            site: location.hostname,
                            inname: search.toLowerCase(),
                            key: "C0zI0cCMTw5GRQIqHhvTHw((",
                        }).toString();
                        return [4, fetch(uri.toString())];
                    case 1:
                        res = _b.sent();
                        if (!res.ok)
                            return [2, []];
                        return [4, res.json()];
                    case 2:
                        items = (_b.sent()).items;
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
        var refsToAdd = matches.reduce(function (acc, _b, idx) {
            var _c = __read(_b, 3), _ = _c[0], _text = _c[1], link = _c[2];
            return acc + "[" + (existing + idx + 1) + "]: " + link + "\n";
        }, "");
        return text + "\n\n" + refsToAdd;
    };
    var makeCapitalizationFixer = function (caps) { return function (text) {
        return caps.reduce(function (a, c) {
            return a.replace(new RegExp("(\\s+|^)" + c + "(\\s+|$)", "gmi"), "$1" + c + "$2");
        }, text);
    }; };
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
        var tagPrefixedRegEx, _b, tagname, lcased, tags, matchingTag;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tagPrefixedRegEx = /^(\w+)(?:\s+-|:)\s+/i;
                    _b = __read(tagPrefixedRegEx.exec(title) || [], 2), tagname = _b[1];
                    if (!tagname)
                        return [2, title];
                    lcased = tagname.toLowerCase();
                    return [4, getMatchingTags(lcased)];
                case 1:
                    tags = _c.sent();
                    matchingTag = tags.find(function (_b) {
                        var name = _b.name;
                        return name === lcased;
                    });
                    return [2, matchingTag ? title.replace(tagPrefixedRegEx, "") : title];
            }
        });
    }); };
    var disabledOn = [/chat\.(?:stackoverflow|(meta\.)?stackexchange)\.com/];
    var isDisabled = disabledOn.reduce(function (_a, c) { return c.test(location.href); }, false);
    if (isDisabled)
        return;
    w.addEventListener("load", function () {
        var mainId = config.ids.main;
        addStyles(d, mainId);
        var notEditableToast = makeStacksToast(mainId + "-no-editable", "This is not the page you are looking for", {
            important: true,
            type: "warning",
        });
        var editSuccessToast = makeStacksToast(mainId + "-edit-success", "Successfully edited the post", {
            important: true,
            type: "success",
        });
        d.body.append(notEditableToast, editSuccessToast);
        addMenuItem(mainId, function () { return __awaiter(void 0, void 0, void 0, function () {
            var area, title, capsDefaults, capsProp, isInitialized, capitalizations, capitalize, bodyFixers, titleFixers, event, fixed, titleFixed;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        area = d.querySelector("[name=post-text]");
                        title = d.getElementById("title");
                        if (!area && !title)
                            return [2, showToast(notEditableToast, 3)];
                        capsDefaults = [
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
                        capsProp = "capitalizations";
                        return [4, Store.has(capsProp)];
                    case 1:
                        isInitialized = _b.sent();
                        if (!!isInitialized) return [3, 3];
                        return [4, Store.save(capsProp, capsDefaults)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [4, Store.load(capsProp, capsDefaults)];
                    case 4:
                        capitalizations = _b.sent();
                        console.debug({ capitalizations: capitalizations });
                        capitalize = makeCapitalizationFixer(capitalizations);
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
                            removeTagDuplication,
                            capitalize,
                        ];
                        event = new Event("input", {
                            bubbles: true,
                            cancelable: true,
                        });
                        if (!area) return [3, 6];
                        return [4, asyncReduce(bodyFixers, area.value)];
                    case 5:
                        fixed = _b.sent();
                        area.value = fixed;
                        area.dispatchEvent(event);
                        _b.label = 6;
                    case 6:
                        if (!title) return [3, 8];
                        return [4, asyncReduce(titleFixers, title.value)];
                    case 7:
                        titleFixed = _b.sent();
                        title.value = titleFixed;
                        title.dispatchEvent(event);
                        _b.label = 8;
                    case 8:
                        showToast(editSuccessToast, 3);
                        return [2];
                }
            });
        }); });
    });
})(window, document);
