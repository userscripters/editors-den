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

"use strict";((e,o)=>{const t={ids:{main:"editors-den"}},n=(e,t,{buttons:n=[],classes:a=[],msgClasses:s=[],type:i="none",important:r=!1}={})=>{const o=document.createElement("div");o.classList.add("s-toast",...a),o.setAttribute("aria-hidden","true"),o.setAttribute("role","alertdialog"),o.setAttribute("aria-labelledby","notice-message"),o.id=e;const c=document.createElement("aside");c.classList.add("s-notice","p8","pl16"),"none"!==i&&c.classList.add(`s-notice__${i}`),r&&c.classList.add("s-notice__important");const d=document.createElement("div");d.classList.add("d-flex","gs16","gsx","ai-center","jc-space-between",...s);const l=document.createElement("div");l.classList.add("flex--item"),l.textContent=t;const m=document.createElement("div");m.classList.add("d-flex");const u=document.createElement("button");u.type="button",u.classList.add("s-btn","s-notice--btn"),u.setAttribute("aria-label","Dismiss"),n.push(u);var[t]=((e,t,{classes:n=[],width:a=14,height:s=a})=>{var i="http://www.w3.org/2000/svg";const r=document.createElementNS(i,"svg");r.classList.add("svg-icon",e,...n),r.setAttribute("width",a.toString()),r.setAttribute("height",s.toString()),r.setAttribute("viewBox",`0 0 ${a} ${s}`),r.setAttribute("aria-hidden","true");const o=document.createElementNS(i,"path");return o.setAttribute("d",t),r.append(o),[r,o]})("iconClearSm","M12 3.41 10.59 2 7 5.59 3.41 2 2 3.41 5.59 7 2 10.59 3.41 12 7 8.41 10.59 12 12 10.59 8.41 7 12 3.41z",{width:14});return u.append(t),m.append(...n),d.append(l,m),c.append(d),o.append(c),o},a=(e,t)=>{const n="string"==typeof e?document.querySelector(e):e;if(!n)throw new ReferenceError(`missing toast: ${e}`);const a="true"!==n.getAttribute("aria-hidden");return n.setAttribute("aria-hidden",(void 0!==t?!t:a).toString()),n},c=(e,t)=>{const n=a(e,!0);t&&setTimeout(()=>((e,t)=>{const n=a(e,!1);t&&setTimeout(()=>c(n),1e3*t)})(n),1e3*t)},s=(e,t)=>{const n=o.querySelector("ol.user-logged-in, ol.user-logged-out");if(!n)return console.debug("failed to find main menu");const a=o.getElementById(e)||(e=>{const t=o.createElement("li");t.classList.add("-item"),t.id=e,t.title="Apply auto-edits";const n=o.createElement("a");n.classList.add("-link");const a=o.createElement("strong");return a.textContent="E&D",n.append(a),t.append(n),t})(e);a.isConnected||(n.append(a),a.addEventListener("click",e=>{e.preventDefault(),t()}))},d=(e,t)=>e.reduce(async(e,t)=>t(await e),Promise.resolve(t)),l=e=>{const a=[...e.matchAll(/\[\d+\]: \w+/gim)]["length"],t=[...e.matchAll(/\[([\w\s:'#-?]+)\]\(([\w:/.#-]+)\)/gim)];return`${e}\n\n${t.reduce((e,[,,t],n)=>`${e}[${a+n+1}]: ${t}\n`,"")}`},m=e=>{return["I","Gmail","Google","Firefox","JavaScript","HTML","jQuery","URL","SDK","Safari","Linux","Greasemonkey","API"].reduce((e,t)=>e.replace(new RegExp(`(\\s+|^)${t}(\\s+|$)`,"gmi"),`$1${t}$2`),e)},u=e=>e.replace(/\*{2}(\[.+?\]\(.+?\))\*{2}/gim,"$1"),p=e=>e.replace(/([?!,.])(\s+\(.+?\))/gm,"$2$1"),g=e=>e.replace(/^Hi\b/i,""),b=e=>e.replace(/(?:^\n$)+/gim,""),h=e=>e.replace(/^-*?(?:update|edit)-*?$/gim,"---"),w=e=>e.replace(/\b[ ]{2,}/gm," ").trim(),v=e=>e.replace(/\bhttp:\/\//gim,"https://"),k=e=>e.replace(/\s+([,.?!])/gm,"$1"),$=async e=>{const t=/^(\w+)\s+-\s+/i,[,n]=t.exec(e)||[];if(!n)return e;const a=n.toLowerCase(),s=await(async(e,t=2.3)=>{const n=new URL(`https://api.stackexchange.com/${t}/tags`);n.search=new URLSearchParams({site:location.hostname,inname:e.toLowerCase(),key:"C0zI0cCMTw5GRQIqHhvTHw(("}).toString();const a=await fetch(n.toString());if(!a.ok)return[];var e=(await a.json())["items"];return e})(a);return s.find(({name:e})=>e===a)?e.replace(t,""):e};[/chat\.(?:stackoverflow|(meta\.)?stackexchange)\.com/].reduce((e,t)=>t.test(location.href),!1)||e.addEventListener("load",()=>{var e=t.ids.main;((e,t)=>{var n=e.createElement("style");e.head.append(n);const a=n["sheet"];a&&(n="https://upload.wikimedia.org/wikipedia/commons/c/c4/Quill_and_ink.svg",a.insertRule(`#${t} strong {
            background-color: var(--black-400);
            mask-image: url(${n});
            mask-repeat: no-repeat;
            mask-size: 18px 18px;
            mask-origin: content-box;
            mask-position: center;
            -webkit-mask-image: url(${n});
            -webkit-mask-repeat: no-repeat;
            -webkit-mask-size: 18px 18px;
            -webkit-mask-origin: content-box;
            -webkit-mask-position: center;
            min-height: 18px;
        }`),a.insertRule(`#${t} .-link:hover strong {
            background-color: var(--black-700);
        }`))})(o,e);const i=n(`${e}-no-editable`,"This is not the page you are looking for",{important:!0,type:"warning"}),r=n(`${e}-edit-success`,"Successfully edited the post",{important:!0,type:"success"});o.body.append(i,r),s(e,async()=>{const e=o.querySelector("[name=post-text]"),t=o.getElementById("title");if(!e&&!t)return c(i,3);var n=[m,h,b,u,g,p,k,l,w,v],a=[w,m,$],s=new Event("input",{bubbles:!0,cancelable:!0});e&&(n=await d(n,e.value),e.value=n,e.dispatchEvent(s)),t&&(a=await d(a,t.value),t.value=a,t.dispatchEvent(s)),c(r,3)})})})(window,document);