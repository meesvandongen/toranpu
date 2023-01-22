"use strict";(self.webpackChunktoranpu_docs=self.webpackChunktoranpu_docs||[]).push([[918],{4377:(e,t,n)=>{n.d(t,{Z:()=>A});var o=n(9901),c=Object.defineProperty,s=(e,t,n)=>(((e,t,n)=>{t in e?c(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n})(e,"symbol"!=typeof t?t+"":t,n),n),u=(e=>(e.ace="A",e.two="2",e.three="3",e.four="4",e.five="5",e.six="6",e.seven="7",e.eight="8",e.nine="9",e.ten="T",e.jack="J",e.queen="Q",e.king="K",e))(u||{}),r=(e=>(e.clubs="c",e.spades="s",e.diamonds="d",e.hearts="h",e))(r||{}),a=(e=>(e.black="black",e.red="red",e))(a||{});const i=class{constructor(e){s(this,"_seed"),s(this,"_value",NaN),this._seed="string"==typeof e?this.hashCode(e):"number"==typeof e?this.getSafeSeed(e):this.getSafeSeed(i.MIN+Math.floor((i.MAX-i.MIN)*Math.random())),this.reset()}nextInt(e=10,t=100){return this.recalculate(),Math.floor(this.map(this._value,i.MIN,i.MAX,e,t+1))}reset(){this._value=this._seed}recalculate(){this._value=this.xorshift(this._value)}xorshift(e){return e^=e<<13,e^=e>>17,e^=e<<5}map(e,t,n,o,c){return(e-t)/(n-t)*(c-o)+o}hashCode(e){let t=0;if(e){const n=e.length;for(let o=0;o<n;o++)t=(t<<5)-t+e.charCodeAt(o),t|=0,t=this.xorshift(t)}return this.getSafeSeed(t)}getSafeSeed(e){return 0===e?1:e}};let l=i;s(l,"MIN",-2147483648),s(l,"MAX",2147483647);const f=[u.ace,u.two,u.three,u.four,u.five,u.six,u.seven,u.eight,u.nine,u.ten,u.jack,u.queen,u.king],d=[r.clubs,r.spades,r.diamonds,r.hearts];function h(e){switch(e){case u.ace:return 1;case u.king:return 13;case u.queen:return 12;case u.jack:return 11;case u.ten:return 10;default:return parseInt(e,10)}}function p(e){return h(v(e))}function g(e){return e.pop()}function b(e,t){const n=e.length-t;return e.splice(n,t)}function m(e,t){e.push(t)}function k(e,t){e.push(...t)}function v(e){return e[0]}function M(e){return e[1]}function S(e){const t=M(e);return t===r.clubs||t===r.spades?a.black:a.red}function y(e,t,n){let o=e.tableau[t].open;return function(e,t){return e.slice(e.length-t)}(o,o.length-n)}function _(e,t,n){const o=y(e,t.column,t.index);return"tableau"===n.type?C(e,o,n.column):"foundation"===n.type&&(1===o.length&&I(e,o[0],n.column))}function x(e,t,n){k(e.tableau[n].open,t)}function C(e,t,n){const o=e.tableau[n],c=o.open[o.open.length-1],s=S(c),r=p(c),a=t[0],i=v(a),l=S(a),f=p(a);return void 0===c?i===u.king:!(f!==r-1||l===s)}function w(e,t,n){m(e.foundations[n],t)}function I(e,t,n){const o=e.foundations[n],c=o[o.length-1];if(void 0===c)return v(t)===u.ace;const s=M(c),r=M(t);return!(1!==function(e,t){const n=v(e),o=v(t);return h(n)-h(o)}(t,c)||s!==r)}function N(e,t){return"tableau"===t.type?C(e,e.stock,t.column):I(e,e.stock[0],t.column)}const A={React:o,...o,drawFromStock:function(e){if(0===e.stock.length)return void function(e){const t=b(e.discard,e.discard.length);t.reverse(),k(e.stock,t)}(e);const t=g(e.stock);m(e.discard,t)},getCanMoveFromStock:N,getCanMoveFromTableau:_,getColor:S,getIsWinningState:function(e){return e.foundations.every((e=>13===e.length))},getRank:v,getSuit:M,getTableauCards:y,moveFromStock:function(e,t){if(!N(e,t))return;const n=g(e.stock);"tableau"!==t.type?w(e,n,t.column):x(e,[n],t.column)},moveFromTableau:function(e,t,n){if(!_(e,t,n))return;const o=function(e,t,n){let o=e.tableau[t].open,c=e.tableau[t].closed;const s=b(o,o.length-n);0===o.length&&c.length>0&&m(o,g(c));return s}(e,t.column,t.index);"tableau"!==n.type?w(e,o[0],n.column):x(e,o,n.column)},setupGame:function(e){const t={foundations:[[],[],[],[]],stock:[],discard:[],tableau:[{open:[],closed:[]},{open:[],closed:[]},{open:[],closed:[]},{open:[],closed:[]},{open:[],closed:[]},{open:[],closed:[]},{open:[],closed:[]}]},n=d.flatMap((e=>f.map((t=>`${t}${e}`))));!function(e,t){const n=new l(t);e.sort((()=>n.nextInt(0,2)-1))}(n,e);for(let o=0;o<7;o++){const e=t.tableau[o],c=g(n);m(e.open,c);for(let t=0;t<o;t++){const t=g(n);m(e.closed,t)}}return t.stock=n,t}}}}]);