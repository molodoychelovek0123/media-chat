import{r as d,j as t}from"./index-128ded5b.js";const g=d.memo(({message:n,theme:r})=>{const m=d.useCallback(c=>{navigator.clipboard.writeText(c).then(()=>{console.log("Код скопирован в буфер обмена")})},[]),x=d.useCallback(c=>{const a=c.split(`
`);return a.map((o,e)=>{if(o.startsWith("### "))return t.jsx("h3",{className:"text-lg font-semibold mt-4 mb-2",style:{color:r.colors.text.primary},children:o.replace("### ","")},e);if(o.startsWith("## "))return t.jsx("h2",{className:"text-xl font-bold mt-4 mb-2",style:{color:r.colors.text.primary},children:o.replace("## ","")},e);if(o.startsWith("# "))return t.jsx("h1",{className:"text-2xl font-bold mt-4 mb-3",style:{color:r.colors.text.primary},children:o.replace("# ","")},e);if(o.startsWith("```")){const i=a.findIndex(l=>l.startsWith("```")),p=a.findIndex((l,y)=>y>i&&l.startsWith("```"));if(i===e&&p>i){const l=a.slice(i+1,p).join(`
`);return t.jsxs("div",{className:"my-3",children:[t.jsxs("div",{className:"flex justify-between items-center px-3 py-2 rounded-t-lg text-xs",style:{backgroundColor:r.colors.background,color:r.colors.text.secondary},children:[t.jsx("span",{children:"Код"}),t.jsx("button",{onClick:()=>m(l),className:"px-2 py-1 rounded hover:opacity-80 transition-opacity",style:{backgroundColor:r.colors.primary,color:"#FFFFFF"},children:"Копировать"})]}),t.jsx("pre",{className:"p-3 rounded-b-lg overflow-x-auto text-sm",style:{backgroundColor:r.colors.background,color:r.colors.text.primary,border:`1px solid ${r.colors.border}`},children:t.jsx("code",{children:l})})]},e)}return null}if(o==="```"&&e>0)return null;let s=o;return s=s.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),s=s.replace(/\*(.*?)\*/g,"<em>$1</em>"),s=s.replace(/`(.*?)`/g,"<code>$1</code>"),s=s.replace(/\[(.*?)\]\((.*?)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer" style="color: '+r.colors.primary+'">$1</a>'),o.startsWith("- ")||o.startsWith("* ")?t.jsx("li",{className:"ml-4",style:{color:r.colors.text.primary},dangerouslySetInnerHTML:{__html:s.slice(2)}},e):o.trim()===""?t.jsx("br",{},e):t.jsx("p",{className:"mb-2 last:mb-0",dangerouslySetInnerHTML:{__html:s}},e)})},[r,m]),u=d.useCallback(c=>c.split(`
`).map((a,o)=>t.jsx("p",{className:"mb-2 last:mb-0",children:a},o)),[]);return t.jsxs("div",{className:"text-message",children:[n.format==="markdown"?x(n.content):u(n.content),n.format==="markdown"&&t.jsx("style",{children:`
          .text-message strong { 
            font-weight: 600; 
            color: ${r.colors.text.primary};
          }
          .text-message em { 
            font-style: italic; 
            color: ${r.colors.text.primary};
          }
          .text-message code { 
            background: ${r.colors.background}; 
            padding: 0.1rem 0.3rem; 
            border-radius: 0.25rem; 
            font-family: monospace; 
            color: ${r.colors.text.primary};
            border: 1px solid ${r.colors.border};
          }
          .text-message a { 
            text-decoration: underline; 
            transition: opacity 0.2s;
          }
          .text-message a:hover { 
            opacity: 0.8; 
          }
          .text-message ul { 
            list-style-type: disc; 
            margin-left: 1rem; 
            margin-bottom: 1rem;
          }
          .text-message li { 
            margin-bottom: 0.25rem; 
          }
        `})]})});g.displayName="TextMessage";export{g as default};
