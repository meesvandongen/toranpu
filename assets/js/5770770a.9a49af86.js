"use strict";(self.webpackChunktoranpu_docs=self.webpackChunktoranpu_docs||[]).push([[121],{7522:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>g});var n=r(9901);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function u(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var i=n.createContext({}),p=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},c=function(e){var t=p(e.components);return n.createElement(i.Provider,{value:t},e.children)},d="mdxType",s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,c=u(e,["components","mdxType","originalType","parentName"]),d=p(r),m=a,g=d["".concat(i,".").concat(m)]||d[m]||s[m]||o;return r?n.createElement(g,l(l({ref:t},c),{},{components:r})):n.createElement(g,l({ref:t},c))}));function g(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,l=new Array(o);l[0]=m;var u={};for(var i in t)hasOwnProperty.call(t,i)&&(u[i]=t[i]);u.originalType=e,u[d]="string"==typeof e?e:a,l[1]=u;for(var p=2;p<o;p++)l[p]=r[p];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},5547:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>i,contentTitle:()=>l,default:()=>d,frontMatter:()=>o,metadata:()=>u,toc:()=>p});var n=r(5248),a=(r(9901),r(7522));const o={},l=void 0,u={unversionedId:"Card",id:"Card",title:"Card",description:"getColor",source:"@site/../toranpu/docs/Card.md",sourceDirName:".",slug:"/Card",permalink:"/toranpu/Card",draft:!1,editUrl:"https://github.com/meesvandongen/toranpu/tree/main/packages/toranpu-docs/../toranpu/docs/Card.md",tags:[],version:"current",frontMatter:{},sidebar:"defaultSidebar",previous:{title:"Toranpu",permalink:"/toranpu/"},next:{title:"Klondike",permalink:"/toranpu/Klondike"}},i={},p=[{value:"<code>getColor</code>",id:"getcolor",level:2},{value:"Arguments",id:"arguments",level:3},{value:"Returns",id:"returns",level:3},{value:"<code>getRank</code>",id:"getrank",level:2},{value:"Arguments",id:"arguments-1",level:3},{value:"Returns",id:"returns-1",level:3},{value:"<code>getSuit</code>",id:"getsuit",level:2},{value:"Arguments",id:"arguments-2",level:3},{value:"Returns",id:"returns-2",level:3}],c={toc:p};function d(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"getcolor"},(0,a.kt)("inlineCode",{parentName:"h2"},"getColor")),(0,a.kt)("p",null,"Get the color of a card"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'import { getColor } from "toranpu";\n\ngetColor(card)\n')),(0,a.kt)("h3",{id:"arguments"},"Arguments"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"card")," (",(0,a.kt)("em",{parentName:"li"},"Type"),"): The card to get the color of")),(0,a.kt)("h3",{id:"returns"},"Returns"),(0,a.kt)("p",null,"(",(0,a.kt)("em",{parentName:"p"},"Enum"),") The color of a card"),(0,a.kt)("hr",null),(0,a.kt)("h2",{id:"getrank"},(0,a.kt)("inlineCode",{parentName:"h2"},"getRank")),(0,a.kt)("p",null,"Get the rank of a card"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'import { getRank } from "toranpu";\n\ngetRank(card)\n')),(0,a.kt)("h3",{id:"arguments-1"},"Arguments"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"card")," (",(0,a.kt)("em",{parentName:"li"},"Type"),"): The card to get the rank of")),(0,a.kt)("h3",{id:"returns-1"},"Returns"),(0,a.kt)("p",null,"(",(0,a.kt)("em",{parentName:"p"},"Enum"),") The rank of a card"),(0,a.kt)("hr",null),(0,a.kt)("h2",{id:"getsuit"},(0,a.kt)("inlineCode",{parentName:"h2"},"getSuit")),(0,a.kt)("p",null,"Get the suit of a card"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'import { getSuit } from "toranpu";\n\ngetSuit(card)\n')),(0,a.kt)("h3",{id:"arguments-2"},"Arguments"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"card")," (",(0,a.kt)("em",{parentName:"li"},"Type"),"): The card to get the suit of")),(0,a.kt)("h3",{id:"returns-2"},"Returns"),(0,a.kt)("p",null,"(",(0,a.kt)("em",{parentName:"p"},"Enum"),") The suit of a card"))}d.isMDXComponent=!0}}]);