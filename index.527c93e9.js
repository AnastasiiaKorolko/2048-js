!function(){function t(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function e(e){return function(e){if(Array.isArray(e))return t(e)}(e)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(e)||function(e,r){if(e){if("string"==typeof e)return t(e,void 0);var n=Object.prototype.toString.call(e).slice(8,-1);if("Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return t(e,void 0)}}(e)||function(){throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var r=new/*#__PURE__*/(function(){var t;function r(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];if(!function(t,e){if(!(t instanceof e))throw TypeError("Cannot call a class as a function")}(this,r),4===t.length&&t.every(function(t){return 4===t.length}))this.initialState=t,this.restart();else throw Error("Initial state is not valid!")}return t=[{key:"moveLeft",value:function(){var t=this;if("playing"===this.status){var e=this.state.map(function(e){return t.merge(e,0)});this.handleMove(e)}}},{key:"moveRight",value:function(){var t=this;if("playing"===this.status){var e=this.state.map(function(e){return t.merge(e,1)});this.handleMove(e)}}},{key:"moveUp",value:function(){var t=this;if("playing"===this.status){var e=this.rotateMatrix(this.state,1).map(function(e){return t.merge(e,1)}),r=this.rotateMatrix(e,0);this.handleMove(r)}}},{key:"moveDown",value:function(){var t=this;if("playing"===this.status){var e=this.rotateMatrix(this.state,1).map(function(e){return t.merge(e,0)}),r=this.rotateMatrix(e,0);this.handleMove(r)}}},{key:"handleMove",value:function(t){this.isStateDifferent(t)&&(this.state=t,this.firstMoveMade=!0,this.putNewNumber(),this.isGameOver()?this.status="lose":this.isGameWon()&&(this.status="win"))}},{key:"getScore",value:function(){return this.score}},{key:"getState",value:function(){return this.state}},{key:"getStatus",value:function(){return this.status}},{key:"start",value:function(){this.restart(),this.status="playing",this.putNewNumber(),this.putNewNumber()}},{key:"restart",value:function(){this.state=this.cloneState(this.initialState),this.score=0,this.status="idle",this.firstMoveMade=!1}},{key:"cloneState",value:function(t){return t.map(function(t){return e(t)})}},{key:"isStateDifferent",value:function(t){return JSON.stringify(this.state)!==JSON.stringify(t)}},{key:"getFirstMoveMade",value:function(){return this.firstMoveMade}},{key:"getAvailableCell",value:function(){var t=[];return this.state.forEach(function(e,r){e.forEach(function(e,n){e||t.push({x:n,y:r})})}),t}},{key:"generateNumber",value:function(){return .9>Math.random()?2:4}},{key:"putNewNumber",value:function(){var t=this.getAvailableCell();if(t.length>0){var e=t[Math.floor(Math.random()*t.length)],r=e.x,n=e.y;this.state[n][r]=this.generateNumber()}}},{key:"isGameOver",value:function(){var t=this;return 0===this.getAvailableCell().length&&[function(){return t.testMove(t.moveLeft.bind(t))},function(){return t.testMove(t.moveRight.bind(t))},function(){return t.testMove(t.moveUp.bind(t))},function(){return t.testMove(t.moveDown.bind(t))}].every(function(t){return!t()})}},{key:"testMove",value:function(t){var e=this.cloneState(this.state);t();var r=this.isStateDifferent(e);return this.state=e,r}},{key:"isGameWon",value:function(){return this.state.some(function(t){return t.some(function(t){return 2048===t})})}},{key:"rotateMatrix",value:function(t,e){var r=t.length,n=Array.from({length:r},function(){return Array(r).fill(0)});if(e)for(var i=0;i<r;i++)for(var a=0;a<r;a++)n[a][r-1-i]=t[i][a];else for(var o=0;o<r;o++)for(var s=0;s<r;s++)n[r-1-s][o]=t[o][s];return n}},{key:"merge",value:function(t,r){for(var n=r?e(t).reverse():e(t),i=[],a=0,o=n.filter(function(t){return 0!==t}),s=0;s<o.length;s++)o[s]===o[s+1]?(i.push(2*o[s]),a+=2*o[s],s++):i.push(o[s]);for(;i.length<t.length;)i.push(0);return this.score+=a,r?i.reverse():i}}],function(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}(r.prototype,t),r}());function n(){var t,e,n,a;t=r.getState(),document.querySelectorAll(".field-row").forEach(function(e,r){t[r].forEach(function(t,r){var n=e.children[r];n.className="field-cell field-cell--".concat(t),n.innerText=t>0?t:"",t>0&&(n.classList.add("merge"),setTimeout(function(){return n.classList.remove("merge")},600))})}),e=r.getScore(),document.querySelector(".game-score").innerText=e,r.getFirstMoveMade()?(i.className="button restart",i.innerText="Restart"):(i.className="button start",i.innerText="Start"),n=r.getStatus(),document.querySelectorAll(".message").forEach(function(t){t.classList.add("hidden")}),(a=({idle:"message-start",win:"message-win",lose:"message-lose"})[n])&&document.querySelector(".".concat(a)).classList.remove("hidden")}var i=document.querySelector(".button");i.addEventListener("click",function(){switch(i.innerText){case"Start":r.start();break;case"Restart":r.restart()}n()}),document.addEventListener("keydown",function(t){var e={ArrowUp:function(){return r.moveUp()},ArrowRight:function(){return r.moveRight()},ArrowDown:function(){return r.moveDown()},ArrowLeft:function(){return r.moveLeft()}}[t.key];e&&(t.preventDefault(),e()),n()})}();
//# sourceMappingURL=index.527c93e9.js.map
