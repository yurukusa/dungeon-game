(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const c of n.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function i(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=i(r);fetch(r.href,n)}})();const b=5,e={gold:50,dungeonValue:100,treasure:100,grid:Array(9).fill(null).map(()=>[]),selectedMonster:null,hero:null,battleLog:[],lastPlayedAt:Date.now(),wave:1,heroesThisWave:0,heroesPerWave:3,waveState:"intermission",intermissionTicks:0,totalKills:0,gameOver:!1,floatingDmg:[]},p={imp:{name:"インプ",icon:"👿",hp:10,atk:2,price:0,slotSize:1,desc:"無料の雑魚"},slime:{name:"スライム",icon:"🟢",hp:30,atk:5,price:30,slotSize:1,desc:"バランス型"},goblin:{name:"ゴブリン",icon:"👺",hp:40,atk:8,price:60,slotSize:1,desc:"攻撃型"},skeleton:{name:"スケルトン",icon:"💀",hp:60,atk:5,price:80,slotSize:1,desc:"耐久型"},ogre:{name:"オーガ",icon:"👹",hp:150,atk:25,price:200,slotSize:3,desc:"ボス（3枠）"}};function M(t){return e.grid[t].reduce((i,s)=>i+s.slotSize,0)}function $(t){return b-M(t)}function T(t,a){const i=p[a];return!i||e.gold<i.price||$(t)<i.slotSize?!1:(e.gold-=i.price,e.grid[t].push({...i,type:a,currentHp:i.hp,level:1}),!0)}function w(t){var i;const a=((i=p[t.type])==null?void 0:i.price)||10;return Math.floor(a*.5*t.level)}function k(t,a){const i=e.grid[t];if(!i||a>=i.length)return!1;const s=i[a],r=w(s);if(e.gold<r)return!1;e.gold-=r,s.level++;const n=p[s.type];return s.hp=Math.floor(n.hp*(1+s.level*.2)),s.atk=Math.floor(n.atk*(1+s.level*.15)),s.currentHp=s.hp,!0}function P(){const t=1+(e.wave-1)*.3,a=Math.floor((30+e.wave*8)*t),i=Math.floor((5+e.wave*1.5)*t),s=e.heroesThisWave===e.heroesPerWave-1,r=s?2:1,n=s?1.5:1;return{name:s?`⭐ Lv.${e.wave} エリート勇者`:`Lv.${e.wave} 勇者`,icon:s?"🛡️":"⚔️",hp:Math.floor(a*r),maxHp:Math.floor(a*r),atk:Math.floor(i*n),position:-1,hasTreasure:!1,state:"entering",isElite:s}}function S(){if(e.gameOver)return;if(e.waveState==="intermission"){e.intermissionTicks++,e.intermissionTicks>=5&&(e.wave===1&&e.heroesThisWave===0||e.wave++,e.heroesThisWave=0,e.heroesPerWave=3+Math.floor(e.wave/3),e.waveState="active",e.intermissionTicks=0,o(`=== ウェーブ${e.wave} 開始！ ===`));return}if(!e.hero){if(e.heroesThisWave>=e.heroesPerWave){const a=30+e.wave*15;e.gold+=a,e.treasure=Math.min(e.treasure+10,200),o(`★ ウェーブ${e.wave}クリア！ +${a}G ★`),e.waveState="intermission",e.intermissionTicks=0;for(const i of e.grid)for(const s of i)s.currentHp=Math.min(s.hp,s.currentHp+Math.floor(s.hp*.5));return}e.hero=P(),e.heroesThisWave++,o(`${e.hero.name}がダンジョンに侵入！ (${e.heroesThisWave}/${e.heroesPerWave})`);return}const t=e.hero;switch(t.state){case"entering":if(t.position++,t.position>8){t.hasTreasure=!0,t.state="returning",o(`${t.name}が財宝を手に入れた！`);return}t.state="fighting";break;case"fighting":{const s=e.grid[t.position],r=s.filter(d=>d.currentHp>0);if(r.length===0){t.state=t.hasTreasure?"returning":"entering";return}let n=0;for(const d of r)n+=d.atk;if(t.hp-=n,h(t.position,`-${n}`,"#4ecca3"),t.hp<=0){const d=20+Math.floor(e.wave*5),l=t.isElite?d:0;e.gold+=d+l,e.totalKills++,h(t.position,`+${d+l}G`,"#ffd700"),o(`${t.name}を撃破！ +${d+l}G`),e.hero=null;return}const c=r[0];if(c.currentHp-=t.atk,h(t.position,`-${t.atk}`,"#ff6b6b"),c.currentHp<=0){o(`${c.name}Lv${c.level}が倒された！`);const d=s.indexOf(c);d>=0&&s.splice(d,1)}break}case"returning":if(t.position--,t.position<0){const s=Math.min(20+e.wave*5,e.treasure);e.treasure-=s,o(`${t.name}が財宝(${s})を持ち逃げ！`),e.treasure<=0&&(e.gameOver=!0,o("＝＝＝ ゲームオーバー ＝＝＝"),o(`最終ウェーブ: ${e.wave} / 撃破数: ${e.totalKills}`)),e.hero=null;return}e.grid[t.position].filter(s=>s.currentHp>0).length>0&&(t.state="fighting");break}}function g(){let t=0;for(const a of e.grid)for(const i of a)t+=i.level;return t}function L(){e.gold=50,e.dungeonValue=100,e.treasure=100,e.grid=Array(9).fill(null).map(()=>[]),e.selectedMonster=null,e.hero=null,e.battleLog=[],e.lastPlayedAt=Date.now(),e.wave=1,e.heroesThisWave=0,e.heroesPerWave=3,e.waveState="intermission",e.intermissionTicks=0,e.totalKills=0,e.gameOver=!1,o("モンスターを配置して防衛を始めよう！")}let m=0;function h(t,a,i){e.floatingDmg.push({cellIndex:t,text:a,color:i,id:m++});const s=m-1;setTimeout(()=>{e.floatingDmg=e.floatingDmg.filter(r=>r.id!==s)},1e3)}function o(t){e.battleLog.unshift(t),e.battleLog.length>20&&e.battleLog.pop()}const y="idle_defense_save_v3";function f(){const t={gold:e.gold,dungeonValue:e.dungeonValue,treasure:e.treasure,grid:e.grid,wave:e.wave,heroesThisWave:e.heroesThisWave,heroesPerWave:e.heroesPerWave,totalKills:e.totalKills,gameOver:e.gameOver,lastPlayedAt:Date.now()};localStorage.setItem(y,JSON.stringify(t))}function W(){const t=localStorage.getItem(y);if(!t)return!1;try{const a=JSON.parse(t);e.gold=a.gold??50,e.dungeonValue=a.dungeonValue??100,e.treasure=a.treasure??100,e.grid=a.grid??Array(9).fill(null).map(()=>[]),e.wave=a.wave??1,e.heroesThisWave=a.heroesThisWave??0,e.heroesPerWave=a.heroesPerWave??3,e.totalKills=a.totalKills??0,e.gameOver=a.gameOver??!1,e.lastPlayedAt=a.lastPlayedAt??Date.now();const i=Date.now(),s=Math.floor((i-e.lastPlayedAt)/1e3);if(s>0){const r=Math.min(s*g(),1e4);r>0&&(e.gold+=r,o(`オフライン報酬: +${r}G (${Math.floor(s/60)}分)`))}return!0}catch{return!1}}let u=null;function H(){const t=W();o(t?"セーブデータを読み込みました":"=== ウェーブ1 開始！ ==="),v();let a=0;setInterval(()=>{if(!e.gameOver){const i=g();i>0&&(e.gold+=i),S()}a++,a>=30&&(f(),a=0),v()},1e3),window.addEventListener("beforeunload",()=>f()),document.addEventListener("visibilitychange",()=>{document.hidden&&f()})}function A(t){const a=e.grid[t],i=e.hero,s=i&&i.position===t,r=$(t),n=u===t,c=a.map(l=>(Math.ceil(l.currentHp/l.hp*100),`<span title="${l.name} Lv${l.level} HP:${l.currentHp}/${l.hp}">${l.icon}</span>`)).join(""),d=e.floatingDmg.filter(l=>l.cellIndex===t).map(l=>`<div class="float-dmg" style="color:${l.color}">${l.text}</div>`).join("");return`
    <div class="grid-cell ${a.length>0?"has-monster":""} ${s?"hero-here":""} ${n?"cell-selected":""}" data-index="${t}">
      <div class="cell-monsters">${c||'<span class="empty-cell">空</span>'}</div>
      ${s?`<div class="cell-hero">${i.icon}</div>`:""}
      ${d}
      <div class="cell-slots">${r}/5</div>
    </div>
  `}function O(){if(u===null)return"";const t=e.grid[u];if(t.length===0)return'<div class="upgrade-panel"><p class="upgrade-empty">このマスにはモンスターがいません</p></div>';const a=t.map((i,s)=>{const r=w(i),n=e.gold>=r,c=Math.ceil(i.currentHp/i.hp*100);return`
      <div class="upgrade-item ${n?"":"disabled"}" data-cell="${u}" data-idx="${s}">
        <span class="upgrade-icon">${i.icon}</span>
        <span class="upgrade-name">${i.name} Lv${i.level}</span>
        <span class="upgrade-stats">HP${i.hp} ATK${i.atk}</span>
        <span class="upgrade-hp-bar"><span class="upgrade-hp-fill" style="width:${c}%"></span></span>
        <button class="upgrade-btn ${n?"":"disabled"}">強化 ${r}G</button>
      </div>
    `}).join("");return`
    <div class="upgrade-panel">
      <h3>マス${u+1}のモンスター</h3>
      ${a}
    </div>
  `}function v(){var i;const t=document.getElementById("app"),a=e.waveState==="intermission"?e.heroesThisWave===0?`準備中... (${5-e.intermissionTicks}秒)`:`休息中... (${5-e.intermissionTicks}秒)`:`${e.heroesThisWave}/${e.heroesPerWave}体`;if(e.gameOver){t.innerHTML=`
      <div class="game-over-screen">
        <h1>ゲームオーバー</h1>
        <div class="game-over-stats">
          <div class="stat-row"><span>到達ウェーブ</span><span class="stat-value">${e.wave}</span></div>
          <div class="stat-row"><span>総撃破数</span><span class="stat-value">${e.totalKills}</span></div>
        </div>
        <button class="retry-btn" id="retryBtn">もう一度挑戦</button>
      </div>
    `,(i=document.getElementById("retryBtn"))==null||i.addEventListener("click",()=>{L(),u=null,v()});return}t.innerHTML=`
    <div class="header">
      <h1>ダンジョンディフェンス</h1>
      <div class="wave-display">ウェーブ ${e.wave} <span class="wave-detail">${a}</span></div>
    </div>

    <div class="status">
      <div class="status-item">
        <div class="status-label">ゴールド</div>
        <div class="status-value gold">${e.gold}G</div>
      </div>
      <div class="status-item">
        <div class="status-label">財宝</div>
        <div class="status-value treasure">${e.treasure}/200</div>
        <div class="treasure-bar"><span class="treasure-fill" style="width:${e.treasure/2}%"></span></div>
      </div>
      <div class="status-item">
        <div class="status-label">撃破</div>
        <div class="status-value">${e.totalKills}</div>
      </div>
    </div>

    <div class="dungeon-section">
      <div class="dungeon-labels">
        <span class="label-start">入口 ←</span>
        <span class="label-end">→ 財宝💎</span>
      </div>
      ${e.wave===1&&e.grid.every(s=>s.length===0)?'<div class="tutorial-hint">👇 下のショップからモンスターを選んでマスに配置しよう！</div>':""}
      <div class="dungeon-grid">
        ${e.grid.map((s,r)=>A(r)).join("")}
      </div>
    </div>

    ${O()}

    <div class="hero-area">
      <h3>侵入者</h3>
      ${e.hero?`
        <div class="hero-info">
          <div class="hero">${e.hero.icon} ${e.hero.name}</div>
          <div class="hero-hp-bar">
            <span class="hero-hp-fill" style="width:${Math.max(0,e.hero.hp/e.hero.maxHp*100)}%"></span>
            <span class="hero-hp-text">HP ${e.hero.hp}/${e.hero.maxHp}</span>
          </div>
          <div class="hero-status">${e.hero.hasTreasure?"💎 帰還中":"→ 侵入中"} ATK:${e.hero.atk}</div>
        </div>
      `:'<div class="hero-waiting">次の勇者を待機中...</div>'}
    </div>

    <div class="shop">
      <h3>モンスター配置 <span class="shop-hint">（選んでからマスをタップ）</span></h3>
      <div class="shop-items">
        ${Object.entries(p).map(([s,r])=>`
          <div class="shop-item ${e.selectedMonster===s?"selected":""} ${e.gold<r.price?"disabled":""}" data-type="${s}">
            <div class="shop-item-icon">${r.icon}</div>
            <div class="shop-item-name">${r.name}</div>
            <div class="shop-item-price">${r.price===0?"無料":r.price+"G"}</div>
            <div class="shop-item-stats">HP${r.hp} ATK${r.atk}</div>
            <div class="shop-item-slot">${r.slotSize}枠</div>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="battle-log">
      ${e.battleLog.map(s=>`<div class="log-entry ${s.includes("★")?"log-wave":s.includes("撃破")?"log-kill":s.includes("倒された")?"log-death":""}">${s}</div>`).join("")}
    </div>

    <div class="idle-info">
      放置収入: ${g()}G/秒
    </div>
  `,E()}function E(){document.querySelectorAll(".grid-cell").forEach(t=>{t.addEventListener("click",()=>{const a=parseInt(t.dataset.index);if(e.selectedMonster){const i=p[e.selectedMonster];T(a,e.selectedMonster)?(o(`${i.name}を配置！`),e.selectedMonster=null):e.gold<i.price?o("ゴールドが足りない！"):o("スロットが足りない！")}else u=u===a?null:a;v()})}),document.querySelectorAll(".shop-item").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.type;e.selectedMonster=e.selectedMonster===a?null:a,u=null,v()})}),document.querySelectorAll(".upgrade-btn:not(.disabled)").forEach(t=>{t.addEventListener("click",a=>{a.stopPropagation();const i=t.closest(".upgrade-item"),s=parseInt(i.dataset.cell),r=parseInt(i.dataset.idx);if(k(s,r)){const n=e.grid[s][r];o(`${n.name}がLv${n.level}に強化！`)}v()})})}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").catch(()=>{})});H();
