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

"use strict";(async()=>{var e=e=>{return["I","Gmail","Firefox","JavaScript","HTML","jQuery","URL","SDK","Safari","Linux","Greasemonkey","API"].reduce((e,t)=>e.replace(new RegExp(`(\\s+|^)${t}(\\s+|$)`,"gmi"),`$1${t}$2`),e)},t=e=>e.replace(/\b[ ]{2,}/gm," ").trim();const a=document.querySelector("[name=post-text]");if(a){const s=[e,e=>e.replace(/^-*?(?:update|edit)-*?$/gim,"---"),e=>e.replace(/(?:^\n$)+/gim,""),e=>e.replace(/\*{2}(\[.+?\]\(.+?\))\*{2}/gim,"$1"),e=>e.replace(/^Hi\b/i,""),e=>e.replace(/([?!,.])(\s+\(.+?\))/gm,"$2$1"),e=>e.replace(/\s+([,.?!])/gm,"$1"),e=>{const n=[...e.matchAll(/\[\d+\]: \w+/gim)]["length"],t=[...e.matchAll(/\[([\w\s:'#-?]+)\]\(([\w:/.#-]+)\)/gim)];return`${e}\n\n${t.reduce((e,[,,t],a)=>`${e}[${n+a+1}]: ${t}\n`,"")}`},t,e=>e.replace(/\bhttp:\/\//gim,"https://")];var n=s.reduce((e,t)=>t(e),a.value);a.value=n;var r,c=new Event("input",{bubbles:!0,cancelable:!0});a.dispatchEvent(c);const i=document.getElementById("title");i&&(r=i.value,n=await[t,e,async e=>{const t=/^(\w+)\s+-\s+/i,[,a]=t.exec(e)||[];if(!a)return e;const n=a.toLowerCase(),r=await(async(e,t=2.3)=>{const a=new URL(`https://api.stackexchange.com/${t}/tags`);a.search=new URLSearchParams({site:location.hostname,inname:e.toLowerCase(),key:"C0zI0cCMTw5GRQIqHhvTHw(("}).toString();const n=await fetch(a.toString());if(!n.ok)return[];var e=(await n.json())["items"];return e})(n);return r.find(({name:e})=>e===n)?e.replace(t,""):e}].reduce(async(e,t)=>t(await e),Promise.resolve(r)),i.value=n,i.dispatchEvent(c))}})();