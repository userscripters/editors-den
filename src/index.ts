interface Document {
    /**
     * Returns a reference to the first object with the specified value of the ID attribute.
     * @param elementId String that specifies the ID value.
     */
    getElementById<T extends HTMLElement>(elementId: string): T | null;
}

type StacksCommonOptions = {
    classes?: string[];
};

type StacksToastOptions = StacksCommonOptions &
    Partial<{
        buttons: HTMLButtonElement[];
        msgClasses: string[];
        important: boolean;
        type: "info" | "success" | "warning" | "danger" | "none";
    }>;

type StacksIconOptions = StacksCommonOptions & {
    width?: number;
    height?: number;
};

interface Window {
    Stacks: typeof Stacks;
    [x: string]: unknown;
}

type RemoveIndex<T> = {
    [P in keyof T as string extends P
        ? never
        : number extends P
        ? never
        : P]: T[P];
};

type AsyncStorage = RemoveIndex<
    {
        [P in keyof Storage]: Storage[P] extends Function
            ? (
                  ...args: Parameters<Storage[P]>
              ) => Promise<ReturnType<Storage[P]>>
            : Promise<Storage[P]>;
    }
>;

((w, d) => {
    const config = {
        ids: {
            main: "editors-den",
        },
    };

    const storageMap: {
        GM_setValue: Storage;
        GM: AsyncStorage;
    } = {
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
                return item === void 0 ? null : item?.toString();
            },
            setItem(key, val) {
                return GM.setValue(key, val);
            },
            removeItem(key) {
                return GM.deleteValue(key);
            },
        },
    };

    //TODO: switch to configurable preference
    const [, storage] =
        Object.entries(storageMap).find(
            ([key]) => typeof w[key] !== "undefined"
        ) || [];

    class Store {
        static storage: Storage | AsyncStorage = storage || localStorage;

        static prefix = config.ids.main;

        static clear(): void {
            const { storage, prefix } = this;
            storage.removeItem(prefix);
        }

        private static async open() {
            const { storage, prefix } = this;
            const val = await storage.getItem(prefix);
            return val ? JSON.parse(val) : {};
        }

        static async has(key: string) {
            const store = await Store.open();
            return key in store;
        }

        static async load<T>(key: string, def?: T): Promise<T> {
            const val = (await Store.open())[key];
            return val !== void 0 ? val : def;
        }

        static async save<T>(key: string, val: T) {
            const { storage, prefix } = this;
            const old = await Store.open();
            old[key] = val;
            return storage.setItem(prefix, JSON.stringify(old));
        }

        static async toggle(key: string) {
            return Store.save(key, !(await Store.load(key)));
        }

        static async remove(key: string) {
            const { prefix } = this;

            const old = await this.load<Record<string, any>>(prefix, {});
            delete old[key];

            return Store.save(key, old);
        }
    }

    const addStyles = (d: Document, id: string) => {
        const style = d.createElement("style");
        d.head.append(style);
        const { sheet } = style;
        if (!sheet) return;

        /**
         * @author Ebrenc (Catalan Wikipedia)
         * @license CC-BY-SA-2.5
         */
        const inkAndQuill =
            "https://upload.wikimedia.org/wikipedia/commons/c/c4/Quill_and_ink.svg";

        /* menu item icon-related styles */
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

        /* avoid E&D sticking out */
        sheet.insertRule(`#${id} .-link:hover strong {
            background-color: var(--black-700);
        }`);
    };

    /**
     * @see https://stackoverflow.design/product/resources/icons/
     * @summary makes Stacks 18 x 18 icon
     */
    const makeStacksIcon = (
        name: string,
        pathConfig: string,
        { classes = [], width = 14, height = width }: StacksIconOptions = {}
    ) => {
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

    /**
     * @see https://stackoverflow.design/product/components/notices/
     * @summary builder for Stacks notifications
     */
    const makeStacksToast = (
        id: string,
        text: string,
        {
            buttons = [],
            classes = [],
            msgClasses = [],
            type = "none",
            important = false,
        }: StacksToastOptions = {}
    ) => {
        const wrap = document.createElement("div");
        wrap.classList.add("s-toast", ...classes);
        wrap.setAttribute("aria-hidden", "true");
        wrap.setAttribute("role", "alertdialog");
        wrap.setAttribute("aria-labelledby", "notice-message");
        wrap.id = id;

        const aside = document.createElement("aside");
        aside.classList.add("s-notice", "p8", "pl16");
        if (type !== "none") aside.classList.add(`s-notice__${type}`);
        if (important) aside.classList.add("s-notice__important");

        const msgWrap = document.createElement("div");
        msgWrap.classList.add(
            "d-flex",
            "gs16",
            "gsx",
            "ai-center",
            "jc-space-between",
            ...msgClasses
        );

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

        const [dismissIcon] = makeStacksIcon(
            "iconClearSm",
            "M12 3.41 10.59 2 7 5.59 3.41 2 2 3.41 5.59 7 2 10.59 3.41 12 7 8.41 10.59 12 12 10.59 8.41 7 12 3.41z",
            { width: 14 }
        );
        dismissBtn.append(dismissIcon);

        btnWrap.append(...buttons);
        msgWrap.append(message, btnWrap);
        aside.append(msgWrap);
        wrap.append(aside);
        return wrap;
    };

    /**
     * @summary toggles the Stacks toast visibility
     */
    const toggleToast = (target: string | Element, show?: boolean) => {
        const toast =
            typeof target === "string"
                ? document.querySelector(target)
                : target;

        if (!toast) throw new ReferenceError(`missing toast: ${target}`);

        const isShown = toast.getAttribute("aria-hidden") !== "true";
        toast.setAttribute(
            "aria-hidden",
            (show !== void 0 ? !show : isShown).toString()
        );

        return toast;
    };

    /**
     * @summary hides the Stacks toast
     */
    const hideToast = (target: string | Element, hideFor?: number) => {
        const toast = toggleToast(target, false);
        if (hideFor) setTimeout(() => showToast(toast), hideFor * 1e3);
    };

    /**
     * @summary shows the Stacks toast
     */
    const showToast = (target: string | Element, showFor?: number) => {
        const toast = toggleToast(target, true);
        if (showFor) setTimeout(() => hideToast(toast), showFor * 1e3);
    };

    const makeMenuItem = (id: string) => {
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

    const addMenuItem = (itemId: string, action: (...args: any[]) => any) => {
        const menu = d.querySelector("ol.user-logged-in, ol.user-logged-out");
        if (!menu) return console.debug("failed to find main menu");

        const item = d.getElementById(itemId) || makeMenuItem(itemId);
        if (item.isConnected) return;

        menu.append(item);

        item.addEventListener("click", (event) => {
            event.preventDefault();
            action(); //TODO: expand
        });
    };

    const asyncReduce = <T>(array: ((acc: T) => Promise<T> | T)[], init: T) => {
        return array.reduce(
            async (a, c) => await c(await a),
            Promise.resolve(init)
        );
    };

    const getMatchingTags = async (
        search: string,
        version = 2.3
    ): Promise<StackExchangeAPI.Tag[]> => {
        const uri = new URL(`https://api.stackexchange.com/${version}/tags`);
        uri.search = new URLSearchParams({
            site: location.hostname,
            inname: search.toLowerCase(),
            key: "C0zI0cCMTw5GRQIqHhvTHw((",
        }).toString();
        const res = await fetch(uri.toString());
        if (!res.ok) return [];
        const { items } = await res.json();
        return items;
    };

    const inlineLinksToRefs = (text: string) => {
        const linkRegex = /\[([\w\s:'#-?]+)\]\(([\w:/.#-]+)\)/gim;
        const refsRegex = /\[\d+\]: \w+/gim;

        const refMatches = [...text.matchAll(refsRegex)];

        const { length: existing } = refMatches;

        // let lastLinkRef = existing;
        // const normalized = text.replace(linkRegex, (_, txt, link, offset) => {
        //     lastLinkRef += 1;
        //     return `[${txt}][${lastLinkRef}]`;
        // });

        const matches = [...text.matchAll(linkRegex)];

        const refsToAdd = matches.reduce(
            (acc, [_, _text, link], idx) =>
                `${acc}[${existing + idx + 1}]: ${link}\n`,
            ""
        );

        return `${text}\n\n${refsToAdd}`;
    };
    const makeCapitalizationFixer = (caps: string[]) => (text: string) => {
        return caps.reduce(
            (a, c) =>
                a.replace(new RegExp(`(\\b|^)${c}(\\b|$)`, "gmi"), `$1${c}$2`),
            text
        );
    };

    const removeExcessiveLinkFormatting = (text: string) =>
        text.replace(/\*{2}(\[.+?\]\(.+?\))\*{2}/gim, "$1");

    const reorderPunctuation = (text: string) =>
        text.replace(/([?!,.])(\s+\(.+?\))/gm, "$2$1");

    const removeSalutations = (text: string) => text.replace(/^Hi\b/i, "");

    const removeEmptyLines = (text: string) => text.replace(/(?:^\n$)+/gim, "");

    const removeNoise = (text: string) =>
        text.replace(/^-*?(?:update|edit)-*?$/gim, "---");

    const removeMultispace = (text: string) =>
        text.replace(/\b[ ]{2,}/gm, " ").trim();

    const secureLinks = (text: string) =>
        text.replace(/\bhttp:\/\//gim, "https://");

    const removeSpacesBeforePunctuation = (text: string) =>
        text.replace(/\s+([,.?!])/gm, "$1");

    const removeTagDuplication = async (title: string) => {
        const tagPrefixedRegEx = /^(\w+)(?:\s?[-:|])\s+/i;

        const [, tagname] = tagPrefixedRegEx.exec(title) || [];
        if (!tagname) return title;

        const lcased = tagname.toLowerCase();

        const tags = await getMatchingTags(lcased);

        const matchingTag = tags.find(({ name }) => name === lcased);
        return matchingTag ? title.replace(tagPrefixedRegEx, "") : title;
    };

    const disabledOn = [/chat\.(?:stackoverflow|(meta\.)?stackexchange)\.com/];
    const isDisabled = disabledOn.reduce(
        (_a, c) => c.test(location.href),
        false
    );
    if (isDisabled) return;

    w.addEventListener("load", () => {
        const mainId = config.ids.main;

        addStyles(d, mainId);

        const notEditableToast = makeStacksToast(
            `${mainId}-no-editable`,
            "This is not the page you are looking for",
            {
                important: true,
                type: "warning",
            }
        );
        const editSuccessToast = makeStacksToast(
            `${mainId}-edit-success`,
            "Successfully edited the post",
            {
                important: true,
                type: "success",
            }
        );
        d.body.append(notEditableToast, editSuccessToast);

        addMenuItem(mainId, async () => {
            const area =
                d.querySelector<HTMLTextAreaElement>("[name=post-text]");

            const title = d.getElementById<HTMLInputElement>("title");

            if (!area && !title) return showToast(notEditableToast, 3);

            //TODO: move out of the source
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

            const capitalizations = await Store.load<string[]>(
                capsProp,
                capsDefaults
            );

            const capitalize = makeCapitalizationFixer(capitalizations);

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
                removeTagDuplication,
                capitalize,
            ];

            //forces preview update
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
