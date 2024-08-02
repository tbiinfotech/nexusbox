import{m as tt,l as et,n as T,_ as o,r as y,q as nt,t as it,y as ot,X as rt,j as st,v as C,w as at,x as lt,Y as dt,T as pt,A as P}from"./index-bef0a3c7.js";function ct(n){return tt("MuiCollapse",n)}et("MuiCollapse",["root","horizontal","vertical","entered","hidden","wrapper","wrapperInner"]);const ut=["addEndListener","children","className","collapsedSize","component","easing","in","onEnter","onEntered","onEntering","onExit","onExited","onExiting","orientation","style","timeout","TransitionComponent"],ht=n=>{const{orientation:e,classes:r}=n,p={root:["root",`${e}`],entered:["entered"],hidden:["hidden"],wrapper:["wrapper",`${e}`],wrapperInner:["wrapperInner",`${e}`]};return lt(p,ct,r)},mt=T("div",{name:"MuiCollapse",slot:"Root",overridesResolver:(n,e)=>{const{ownerState:r}=n;return[e.root,e[r.orientation],r.state==="entered"&&e.entered,r.state==="exited"&&!r.in&&r.collapsedSize==="0px"&&e.hidden]}})(({theme:n,ownerState:e})=>o({height:0,overflow:"hidden",transition:n.transitions.create("height")},e.orientation==="horizontal"&&{height:"auto",width:0,transition:n.transitions.create("width")},e.state==="entered"&&o({height:"auto",overflow:"visible"},e.orientation==="horizontal"&&{width:"auto"}),e.state==="exited"&&!e.in&&e.collapsedSize==="0px"&&{visibility:"hidden"})),ft=T("div",{name:"MuiCollapse",slot:"Wrapper",overridesResolver:(n,e)=>e.wrapper})(({ownerState:n})=>o({display:"flex",width:"100%"},n.orientation==="horizontal"&&{width:"auto",height:"100%"})),gt=T("div",{name:"MuiCollapse",slot:"WrapperInner",overridesResolver:(n,e)=>e.wrapperInner})(({ownerState:n})=>o({width:"100%"},n.orientation==="horizontal"&&{width:"auto",height:"100%"})),A=y.forwardRef(function(e,r){const p=nt({props:e,name:"MuiCollapse"}),{addEndListener:S,children:U,className:_,collapsedSize:f="0px",component:b,easing:$,in:D,onEnter:W,onEntered:j,onEntering:I,onExit:M,onExited:q,onExiting:F,orientation:H="vertical",style:z,timeout:a=dt.standard,TransitionComponent:X=pt}=p,Y=it(p,ut),g=o({},p,{orientation:H,collapsedSize:f}),c=ht(g),L=ot(),k=rt(),l=y.useRef(null),v=y.useRef(),x=typeof f=="number"?`${f}px`:f,u=H==="horizontal",h=u?"width":"height",E=y.useRef(null),B=st(r,E),d=t=>i=>{if(t){const s=E.current;i===void 0?t(s):t(s,i)}},R=()=>l.current?l.current[u?"clientWidth":"clientHeight"]:0,G=d((t,i)=>{l.current&&u&&(l.current.style.position="absolute"),t.style[h]=x,W&&W(t,i)}),J=d((t,i)=>{const s=R();l.current&&u&&(l.current.style.position="");const{duration:m,easing:w}=P({style:z,timeout:a,easing:$},{mode:"enter"});if(a==="auto"){const N=L.transitions.getAutoHeightDuration(s);t.style.transitionDuration=`${N}ms`,v.current=N}else t.style.transitionDuration=typeof m=="string"?m:`${m}ms`;t.style[h]=`${s}px`,t.style.transitionTimingFunction=w,I&&I(t,i)}),K=d((t,i)=>{t.style[h]="auto",j&&j(t,i)}),O=d(t=>{t.style[h]=`${R()}px`,M&&M(t)}),Q=d(q),V=d(t=>{const i=R(),{duration:s,easing:m}=P({style:z,timeout:a,easing:$},{mode:"exit"});if(a==="auto"){const w=L.transitions.getAutoHeightDuration(i);t.style.transitionDuration=`${w}ms`,v.current=w}else t.style.transitionDuration=typeof s=="string"?s:`${s}ms`;t.style[h]=x,t.style.transitionTimingFunction=m,F&&F(t)}),Z=t=>{a==="auto"&&k.start(v.current||0,t),S&&S(E.current,t)};return C.jsx(X,o({in:D,onEnter:G,onEntered:K,onEntering:J,onExit:O,onExited:Q,onExiting:V,addEndListener:Z,nodeRef:E,timeout:a==="auto"?null:a},Y,{children:(t,i)=>C.jsx(mt,o({as:b,className:at(c.root,_,{entered:c.entered,exited:!D&&x==="0px"&&c.hidden}[t]),style:o({[u?"minWidth":"minHeight"]:x},z),ref:B},i,{ownerState:o({},g,{state:t}),children:C.jsx(ft,{ownerState:o({},g,{state:t}),className:c.wrapper,ref:l,children:C.jsx(gt,{ownerState:o({},g,{state:t}),className:c.wrapperInner,children:U})})}))}))});A.muiSupportAuto=!0;const Et=A;export{Et as C};
