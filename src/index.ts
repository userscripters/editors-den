interface Document {
    /**
     * Returns a reference to the first object with the specified value of the ID attribute.
     * @param elementId String that specifies the ID value.
     */
    getElementById<T extends HTMLElement>(elementId: string): T | null;
}

//TODO: expand
type TagInfo = { name: string };

(async () => {
    const asyncReduce = async <T>(
        array: ((acc: T) => Promise<T> | T)[],
        init: T
    ) => {
        return array.reduce(
            async (a, c) => await c(await a),
            Promise.resolve(init)
        );
    };

    const getMatchingTags = async (
        search: string,
        version = 2.3
    ): Promise<TagInfo[]> => {
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
    const capitalization = (text: string) => {
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
        return brands.reduce(
            (a, c) =>
                a.replace(
                    new RegExp(`(\\s+|^)${c}(\\s+|$)`, "gmi"),
                    `$1${c}$2`
                ),
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
        const tagPrefixedRegEx = /^(\w+)\s+-\s+/i;

        const [, tagname] = tagPrefixedRegEx.exec(title) || [];
        if (!tagname) return title;

        const lcased = tagname.toLowerCase();

        const tags = await getMatchingTags(lcased);

        const matchingTag = tags.find(({ name }) => name === lcased);
        return matchingTag ? title.replace(tagPrefixedRegEx, "") : title;
    };

    const area =
        document.querySelector<HTMLTextAreaElement>("[name=post-text]");

    if (!area) return;

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

    //force preview update
    const event = new Event("input", {
        bubbles: true,
        cancelable: true,
    });
    area.dispatchEvent(event);

    const title = document.getElementById<HTMLInputElement>("title");
    if (!title) return;

    const titleFixers = [
        removeMultispace,
        capitalization,
        removeTagDuplication,
    ];

    const titleFixed = await asyncReduce(titleFixers, title.value);

    title.value = titleFixed;

    title.dispatchEvent(event);
})();
