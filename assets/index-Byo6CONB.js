var Me=o=>{throw TypeError(o)};var ge=(o,e,t)=>e.has(o)||Me("Cannot "+t);var n=(o,e,t)=>(ge(o,e,"read from private field"),t?t.call(o):e.get(o)),d=(o,e,t)=>e.has(o)?Me("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(o):e.set(o,t),u=(o,e,t,i)=>(ge(o,e,"write to private field"),i?i.call(o,t):e.set(o,t),t),h=(o,e,t)=>(ge(o,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(r){if(r.ep)return;r.ep=!0;const a=t(r);fetch(r.href,a)}})();function st(o,e="en-US",t={}){return new Date(o).toLocaleDateString(e,{year:"numeric",month:"long",day:"numeric",...t})}function lt({skipTransition:o=!1,updateDOM:e}){const t=document.getElementById("main-content");if(o||!document.startViewTransition){const r=(async()=>{t&&(t.classList.remove("fade-in"),t.classList.add("fade-out"),await new Promise(a=>setTimeout(a,300))),await e(),t&&(t.classList.remove("fade-out"),t.classList.add("fade-in"),await new Promise(a=>setTimeout(a,300)),t.classList.remove("fade-in"))})().then(()=>{});return{ready:Promise.reject(Error("View transitions unsupported")),updateCallbackDone:r,finished:r}}return document.startViewTransition(e)}function Ae(){return`
    <div class="loader loader-absolute"></div>
  `}function ct(){return`
    <li><a id="bookmark-button" class="bookmark-button" href="#/bookmark"></a></li>
  `}function dt(){return`
    <li><a id="new-report-button" class="btn new-report-button" href="#/new-story-guest">Add Story Guest<i class="fas fa-plus"></i></a></li>
    <li><a id="login-button" href="#/login">Login</a></li>
    <li><a id="register-button" href="#/register">Register</a></li>
  `}function ut(){return`
    <li><a id="new-report-button" class="btn new-report-button" href="#/new-story">Add Story <i class="fas fa-plus"></i></a></li>
    <li><a id="logout-button" class="logout-button" href="#/logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
  `}function pt(){return`
    <div id="reports-list-empty" class="reports-list__empty">
      <h2>Tidak ada laporan yang tersedia</h2>
      <p>Saat ini, tidak ada laporan kerusakan fasilitas umum yang dapat ditampilkan.</p>
    </div>
  `}function mt(o){return`
    <div id="reports-list-error" class="reports-list__error">
      <h2>Terjadi kesalahan pengambilan daftar laporan</h2>
      <p>${o||"Gunakan jaringan lain atau laporkan error ini."}</p>
    </div>
  `}function ht({id:o,name:e,description:t,photoUrl:i,createdAt:r,lat:a,lon:s,placeName:c}){return`
    <div tabindex="0" class="report-item" data-reportid="${o}">
      <img class="report-item__image" src="${i}" alt="${e}">
      <div class="report-item__body">
        <div class="report-item__main">
          <h2 id="report-title" class="report-item__title">${e}</h2>
          <div class="report-item__more-info">
            <div class="report-item__createdat">
              <i class="fas fa-calendar-alt"></i> ${st(r,"id-ID")}
            </div>
            ${a&&s?`
              <div class="report-item__location">
                <i class="fas fa-map"></i> ${c}
              </div>
            `:""}
          </div>
        </div>
        <div id="report-description" class="report-item__description">
          ${t}
        </div>
        <div class="report-item__more-info">
          <div class="report-item__author">
            Dibuat oleh: ${e}
          </div>
        </div>
        <a class="btn report-item__read-more" href="#/stories/${o}">
          Selengkapnya <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `}function be(){return`
    <button id="subscribe-button" class="btn subscribe-button">
      Subscribe <i class="fas fa-bell"></i>
    </button>
  `}function je(){return`
    <button id="unsubscribe-button" class="btn unsubscribe-button">
      Unsubscribe <i class="fas fa-bell-slash"></i>
    </button>
  `}function gt(){return`
    <button id="report-detail-save" class="btn btn-transparent">
      Simpan laporan <i class="far fa-bookmark"></i>
    </button>
  `}function ft(){return`
    <button id="report-detail-remove" class="btn btn-transparent">
      Buang laporan <i class="fas fa-bookmark"></i>
    </button>
  `}const De="accessToken",V="https://story-api.dicoding.dev/v1";function yt(o){const e=o.split("/");return{resource:e[1]||null,id:e[2]||null}}function bt(o){let e="";return o.resource&&(e=e.concat(`/${o.resource}`)),o.id&&(e=e.concat("/:id")),e||"/"}function vt(){return location.hash.replace("#","")||"/"}function Fe(){const o=vt(),e=yt(o);return bt(e)}function P(){try{const o=localStorage.getItem(De);return o==="null"||o==="undefined"?null:o}catch(o){return console.error("getAccessToken: error:",o),null}}function wt(o){try{return localStorage.setItem(De,o),!0}catch(e){return console.error("putAccessToken: error:",e),!1}}function $e(){try{return localStorage.removeItem(De),!0}catch(o){return console.error("getLogout: error:",o),!1}}const kt=["/login","/register"];function ve(o){const e=Fe(),t=!!P();return kt.includes(e)&&t?(location.hash="/",null):o}function K(o){return!P()?(location.hash="/login",null):o}function Ge(){$e()}const St=Object.freeze(Object.defineProperty({__proto__:null,checkAuthenticatedRoute:K,checkUnauthenticatedRouteOnly:ve,getAccessToken:P,getLogout:Ge,putAccessToken:wt,removeAccessToken:$e},Symbol.toStringTag,{value:"Module"})),we=(o,e)=>e.some(t=>o instanceof t);let Ce,_e;function xt(){return Ce||(Ce=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Bt(){return _e||(_e=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ke=new WeakMap,fe=new WeakMap,he=new WeakMap;function Lt(o){const e=new Promise((t,i)=>{const r=()=>{o.removeEventListener("success",a),o.removeEventListener("error",s)},a=()=>{t(z(o.result)),r()},s=()=>{i(o.error),r()};o.addEventListener("success",a),o.addEventListener("error",s)});return he.set(e,o),e}function Et(o){if(ke.has(o))return;const e=new Promise((t,i)=>{const r=()=>{o.removeEventListener("complete",a),o.removeEventListener("error",s),o.removeEventListener("abort",s)},a=()=>{t(),r()},s=()=>{i(o.error||new DOMException("AbortError","AbortError")),r()};o.addEventListener("complete",a),o.addEventListener("error",s),o.addEventListener("abort",s)});ke.set(o,e)}let Se={get(o,e,t){if(o instanceof IDBTransaction){if(e==="done")return ke.get(o);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return z(o[e])},set(o,e,t){return o[e]=t,!0},has(o,e){return o instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in o}};function qe(o){Se=o(Se)}function Tt(o){return Bt().includes(o)?function(...e){return o.apply(xe(this),e),z(this.request)}:function(...e){return z(o.apply(xe(this),e))}}function It(o){return typeof o=="function"?Tt(o):(o instanceof IDBTransaction&&Et(o),we(o,xt())?new Proxy(o,Se):o)}function z(o){if(o instanceof IDBRequest)return Lt(o);if(fe.has(o))return fe.get(o);const e=It(o);return e!==o&&(fe.set(o,e),he.set(e,o)),e}const xe=o=>he.get(o);function Dt(o,e,{blocked:t,upgrade:i,blocking:r,terminated:a}={}){const s=indexedDB.open(o,e),c=z(s);return i&&s.addEventListener("upgradeneeded",l=>{i(z(s.result),l.oldVersion,l.newVersion,z(s.transaction),l)}),t&&s.addEventListener("blocked",l=>t(l.oldVersion,l.newVersion,l)),c.then(l=>{a&&l.addEventListener("close",()=>a()),r&&l.addEventListener("versionchange",f=>r(f.oldVersion,f.newVersion,f))}).catch(()=>{}),c}const Pt=["get","getKey","getAll","getAllKeys","count"],Mt=["put","add","delete","clear"],ye=new Map;function Re(o,e){if(!(o instanceof IDBDatabase&&!(e in o)&&typeof e=="string"))return;if(ye.get(e))return ye.get(e);const t=e.replace(/FromIndex$/,""),i=e!==t,r=Mt.includes(t);if(!(t in(i?IDBIndex:IDBObjectStore).prototype)||!(r||Pt.includes(t)))return;const a=async function(s,...c){const l=this.transaction(s,r?"readwrite":"readonly");let f=l.store;return i&&(f=f.index(c.shift())),(await Promise.all([f[t](...c),r&&l.done]))[0]};return ye.set(e,a),a}qe(o=>({...o,get:(e,t,i)=>Re(e,t)||o.get(e,t,i),has:(e,t)=>!!Re(e,t)||o.has(e,t)}));const At=["continue","continuePrimaryKey","advance"],Oe={},Be=new WeakMap,Ne=new WeakMap,Ct={get(o,e){if(!At.includes(e))return o[e];let t=Oe[e];return t||(t=Oe[e]=function(...i){Be.set(this,Ne.get(this)[e](...i))}),t}};async function*_t(...o){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...o)),!e)return;e=e;const t=new Proxy(e,Ct);for(Ne.set(t,e),he.set(t,xe(e));e;)yield t,e=await(Be.get(t)||e.continue()),Be.delete(t)}function Ue(o,e){return e===Symbol.asyncIterator&&we(o,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&we(o,[IDBIndex,IDBObjectStore])}qe(o=>({...o,get(e,t,i){return Ue(e,t)?_t:o.get(e,t,i)},has(e,t){return Ue(e,t)||o.has(e,t)}}));const Rt="story-app-db",Ot=2,$="stories",Y="offline-stories",O=Dt(Rt,Ot,{upgrade(o,e){o.objectStoreNames.contains($)||o.createObjectStore($,{keyPath:"id"}),e<2&&!o.objectStoreNames.contains(Y)&&o.createObjectStore(Y,{keyPath:"id",autoIncrement:!0}),console.log(`[IndexedDB] Database upgraded/created to version ${o.version}.`)}}),G={async saveStory(o){const e=await O,t={...o};return t.photoBlob instanceof Blob?(t._photoBlobData=await t.photoBlob.arrayBuffer(),t._photoBlobType=t.photoBlob.type,delete t.photoBlob):(delete t._photoBlobData,delete t._photoBlobType),console.log("[StoryDB] Saving story:",t),e.put($,t)},async getStory(o){const t=await(await O).get($,o);return t&&t._photoBlobData&&(t.photoBlob=new Blob([t._photoBlobData],{type:t._photoBlobType||"image/jpeg"}),delete t._photoBlobData,delete t._photoBlobType),console.log("[StoryDB] Retrieved story:",t),t},async getAllStories(){return(await(await O).getAll($)).map(t=>(t._photoBlobData&&(t.photoBlob=new Blob([t._photoBlobData],{type:t._photoBlobType||"image/jpeg"}),delete t._photoBlobData,delete t._photoBlobType),t))},async deleteStory(o){const e=await O;return console.log("[StoryDB] Deleting story with ID:",o),e.delete($,o)},async clearAllStories(){const o=await O;return console.log("[StoryDB] Clearing all stories from STORY_STORE."),o.clear($)}},Le={async add(o){const e=await O,t={...o};return t.photo instanceof File?(t.photoBlob=await t.photo.arrayBuffer(),t.photoName=t.photo.name,t.photoType=t.photo.type,delete t.photo):(delete t.photoBlob,delete t.photoName,delete t.photoType),t.token=localStorage.getItem("accessToken"),t.timestamp=new Date().toISOString(),console.log("[OfflineStoryQueue] Adding story to queue:",t),e.add(Y,t)},async getAll(){const o=await O;return console.log("[OfflineStoryQueue] Getting all stories from queue."),await o.getAll(Y)},async delete(o){const e=await O;return console.log("[OfflineStoryQueue] Deleting story from queue with ID:",o),e.delete(Y,o)},async clearAll(){const o=await O;return console.log("[OfflineStoryQueue] Clearing all stories from OFFLINE_STORE."),o.clear(Y)}},de={REGISTER:`${V}/register`,LOGIN:`${V}/login`,STORY:`${V}/stories`,STORY_DETAIL:o=>`${V.replace(/\/$/,"")}/stories/${o}`,STORY_GUEST:`${V}/stories/guest`};async function Ut({name:o,email:e,password:t}){const i=JSON.stringify({name:o,email:e,password:t}),r=await fetch(de.REGISTER,{method:"POST",headers:{"Content-Type":"application/json"},body:i});return{...await r.json(),ok:r.ok}}async function jt({email:o,password:e}){const t=JSON.stringify({email:o,password:e}),i=await fetch(de.LOGIN,{method:"POST",headers:{"Content-Type":"application/json"},body:t});return{...await i.json(),ok:i.ok}}async function He(o,e,t={}){const i={method:"GET",headers:{Authorization:`Bearer ${e}`},...t},r=await fetch(o,i),a=await r.json();if(!r.ok){const s=new Error(a.message||`API request failed with status ${r.status}`);throw s.status=r.status,s.data=a,s}return a}async function ze({description:o,photo:e,lat:t,lon:i}){const r=P();if(!r)return{error:!0,message:"Unauthorized. Please login.",ok:!1};if(!navigator.onLine)try{const a=new FileReader,s=await new Promise((c,l)=>{a.onload=()=>c(a.result),a.onerror=l,a.readAsDataURL(e)});return await Le.add({description:o,photoBase64:s,lat:t,lon:i,token:r,timestamp:Date.now()}),console.warn("📌 Story disimpan ke queue karena offline"),{offline:!0,message:"Cerita disimpan untuk dikirim saat online.",ok:!0}}catch(a){return console.error("❌ Gagal simpan offline story:",a),{error:!0,message:"Gagal menyimpan cerita secara offline.",ok:!1}}try{const a=new FormData;a.append("description",o),a.append("photo",e),t!==void 0&&i!==void 0&&t!==null&&i!==null&&(a.append("lat",parseFloat(t)),a.append("lon",parseFloat(i)));const s=await fetch(de.STORY,{method:"POST",headers:{Authorization:`Bearer ${r}`},body:a});return{...await s.json(),ok:s.ok}}catch(a){return console.error("Error submitting story:",a),{error:!0,message:a.message||"Failed to submit story.",ok:!1}}}const Ve=Object.freeze(Object.defineProperty({__proto__:null,ENDPOINTS:de,Login:jt,Register:Ut,addStory:ze,fetchWithAuth:He,getAccessToken:P,getToken:P},Symbol.toStringTag,{value:"Module"}));class Ft{constructor({apiUrl:e,getToken:t}){this.apiUrl=e||"https://story-api.dicoding.dev/v1/stories",this.getToken=t}async getStories({page:e,size:t,location:i}={}){const r=await this.getToken();if(!r)throw new Error("Token tidak ditemukan, silakan login ulang");const a=new URLSearchParams;e&&a.append("page",e),t&&a.append("size",t),i!==void 0&&a.append("location",i);const s=a.toString()?`${this.apiUrl}?${a}`:this.apiUrl,c=await He(s,r,{method:"GET"});return Array.isArray(c.listStory)?c.listStory:[]}}var ee,te;class $t{constructor(){d(this,ee,null);d(this,te,null)}async render(){return`
      <section class="container">
        <h1 class="section-title">Daftar MyStory</h1>
        <div class="reports-list__container">
          <div id="reports-list"></div>
          <div id="reports-list-loading-container"></div>
        </div>
        <div id="map"></div>
        <div id="map-loading-container"></div>
      </section>
    `}async afterRender(){u(this,ee,new Ft({apiUrl:"https://story-api.dicoding.dev/v1/stories",getToken:P}));try{const e=await n(this,ee).getStories();this.populateReportsList("",e)}catch(e){this.populateReportsListError(e.message)}}populateReportsList(e,t){if(t.length<=0){this.populateReportsListEmpty();return}const i=t.reduce((r,a)=>r.concat(ht({...a,placeName:a.placeName})),"");document.getElementById("reports-list").innerHTML=`
      <div class="reports-list">${i}</div>
    `,this.initialMap(t)}populateReportsListEmpty(){document.getElementById("reports-list").innerHTML=pt()}populateReportsListError(e){document.getElementById("reports-list").innerHTML=mt(e)}async initialMap(e=[]){if(n(this,te))return;if(!window.L){console.error("Leaflet belum dimuat. Pastikan sudah import Leaflet di index.html");return}const r=window.L.map("map").setView([-2.5489,118.0149],4.5);window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}).addTo(r),Array.isArray(e)&&e.forEach(a=>{a.lat&&a.lon&&window.L.marker([a.lat,a.lon]).addTo(r).bindPopup(`<b>${a.name}</b><br>${a.description}`)}),u(this,te,r)}showMapLoading(){document.getElementById("map-loading-container").innerHTML=Ae()}hideMapLoading(){document.getElementById("map-loading-container").innerHTML=""}showLoading(){document.getElementById("reports-list-loading-container").innerHTML=Ae()}hideLoading(){document.getElementById("reports-list-loading-container").innerHTML=""}}ee=new WeakMap,te=new WeakMap;var M,oe,ne;class Gt{constructor({view:e,model:t,authModel:i}){d(this,M);d(this,oe);d(this,ne);u(this,M,e),u(this,oe,t),u(this,ne,i)}async getLogin({email:e,password:t}){n(this,M).showSubmitLoadingButton();try{const i=await n(this,oe).Login({email:e,password:t});if(!i.ok){console.error("getLogin: response:",i),n(this,M).loginFailed(i.message);return}n(this,ne).putAccessToken(i.loginResult.token),n(this,M).loginSuccessfully(i.message,i.loginResult)}catch(i){console.error("getLogin: error:",i),n(this,M).loginFailed(i.message)}finally{n(this,M).hideSubmitLoadingButton()}}}M=new WeakMap,oe=new WeakMap,ne=new WeakMap;var ie,pe,We;class qt{constructor(){d(this,pe);d(this,ie,null)}async render(){return`
      <section class="login-container">
        <article class="login-form-container">
          <h1 class="login__title">Masuk akun</h1>

          <form id="login-form" class="login-form">
            <div class="form-control">
              <label for="email-input" class="login-form__email-title">Email</label>

              <div class="login-form__title-container">
                <input id="email-input" type="email" name="email" placeholder="Contoh: nama@email.com">
              </div>
            </div>
            <div class="form-control">
              <label for="password-input" class="login-form__password-title">Password</label>

              <div class="login-form__title-container">
                <input id="password-input" type="password" name="password" placeholder="Masukkan password Anda">
              </div>
            </div>
            <div class="form-buttons login-form__form-buttons">
              <div id="submit-button-container">
                <button class="btn" type="submit">Masuk</button>
              </div>
              <p class="login-form__do-not-have-account">Belum punya akun? <a href="#/register">Daftar</a></p>
            </div>
          </form>
        </article>
      </section>
    `}async afterRender(){u(this,ie,new Gt({view:this,model:Ve,authModel:St})),h(this,pe,We).call(this)}loginSuccessfully(e){console.log(e),location.hash="/"}loginFailed(e){alert(e)}showSubmitLoadingButton(){document.getElementById("submit-button-container").innerHTML=`
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Masuk
      </button>
    `}hideSubmitLoadingButton(){document.getElementById("submit-button-container").innerHTML=`
      <button class="btn" type="submit">Masuk</button>
    `}}ie=new WeakMap,pe=new WeakSet,We=function(){document.getElementById("login-form").addEventListener("submit",async e=>{e.preventDefault();const t={email:document.getElementById("email-input").value,password:document.getElementById("password-input").value};await n(this,ie).getLogin(t)})};var A,re;class Nt{constructor({view:e,model:t}){d(this,A);d(this,re);u(this,A,e),u(this,re,t)}async getRegistered({name:e,email:t,password:i}){n(this,A).showSubmitLoadingButton();try{const r=await n(this,re).Register({name:e,email:t,password:i});if(!r.ok){console.error("getRegistered: response:",r),n(this,A).registeredFailed(r.message);return}n(this,A).registeredSuccessfully(r.message,r.data)}catch(r){console.error("getRegistered: error:",r),n(this,A).registeredFailed(r.message)}finally{n(this,A).hideSubmitLoadingButton()}}}A=new WeakMap,re=new WeakMap;var ae,me,Ke;class Ht{constructor(){d(this,me);d(this,ae,null)}async render(){return`
      <div style="display:flex;justify-content:center;align-items:center;height:90vh;">
        <div style="border:2px solid #ccc;padding:2em 3em;border-radius:12px;min-width:350px;background:#fff;box-shadow:0 2px 8px #0001;">
          <h2 style="text-align:center;font-size:2.5rem;font-weight:bold;margin-bottom:1.5em;">Sign Up</h2>
          <form id="registerForm" autocomplete="off">
            <div style="margin-bottom:1em;">
              <label for="name" style="display:block;font-size:1.1em;margin-bottom:0.3em;">Nama</label>
              <input type="text" id="name" placeholder="Nama" required style="width:100%;padding:0.6em;border:1.5px solid #aaa;border-radius:6px;font-size:1.1em;" />
            </div>
            <div style="margin-bottom:1em;">
              <label for="email" style="display:block;font-size:1.1em;margin-bottom:0.3em;">Email</label>
              <input type="email" id="email" placeholder="Email" required style="width:100%;padding:0.6em;border:1.5px solid #aaa;border-radius:6px;font-size:1.1em;" />
            </div>
            <div style="margin-bottom:1.5em;">
              <label for="password" style="display:block;font-size:1.1em;margin-bottom:0.3em;">Password</label>
              <input type="password" id="password" placeholder="Password" required minlength="8" style="width:100%;padding:0.6em;border:1.5px solid #aaa;border-radius:6px;font-size:1.1em;" />
            </div>
            <div id="submit-button-container">
              <button type="submit" style="width:100%;padding:0.7em 0;font-size:1.2em;background:#0099ff;color:#fff;border:none;border-radius:8px;margin-bottom:1em;cursor:pointer;box-shadow:0 2px 4px #0001;">Sign Up</button>
            </div>
          </form>
          <div id="registerMsg" style="min-height:1.5em;text-align:center;color:#d00;margin-bottom:1em;"></div>
          <div style="text-align:center;font-size:1.1em;">
            Already have an account? <a href="#/login" style="color:#0099ff;text-decoration:none;font-weight:bold;">Log In</a>
          </div>
        </div>
      </div>
    `}async afterRender(){u(this,ae,new Nt({view:this,model:Ve})),h(this,me,Ke).call(this)}registeredSuccessfully(e){console.log(e),location.hash="/login"}registeredFailed(e){alert(e)}showSubmitLoadingButton(){document.getElementById("submit-button-container").innerHTML=`
    <button type="submit" disabled style="
      width: 100%;
      padding: 0.7em 0;
      font-size: 1.2em;
      background: #0099ff;
      color: #fff;
      border: none;
      border-radius: 8px;
      margin-bottom: 1em;
      cursor: not-allowed;
      box-shadow: 0 2px 4px #0001;
    ">
      <i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i> Signing Up...
    </button>
  `}hideSubmitLoadingButton(){document.getElementById("submit-button-container").innerHTML=`
    <button type="submit" style="
      width: 100%;
      padding: 0.7em 0;
      font-size: 1.2em;
      background: #0099ff;
      color: #fff;
      border: none;
      border-radius: 8px;
      margin-bottom: 1em;
      cursor: pointer;
      box-shadow: 0 2px 4px #0001;
    ">Sign Up</button>
  `}}ae=new WeakMap,me=new WeakSet,Ke=function(){document.getElementById("registerForm").addEventListener("submit",async t=>{t.preventDefault();const i={name:document.getElementById("name").value,email:document.getElementById("email").value,password:document.getElementById("password").value};await n(this,ae).getRegistered(i)})};async function Ye({description:o,photo:e,lat:t,lon:i}){try{return await ze({description:o,photo:e,lat:t,lon:i})}catch(r){return{ok:!1,message:r.message}}}var v,J,Q,se,q,B,le,I,C,N,H,g,X,D,_,E,k,W,Je,Qe,Xe;class zt{constructor(){d(this,k);d(this,v,null);d(this,J,null);d(this,Q,null);d(this,se,null);d(this,q,null);d(this,B,null);d(this,le,null);d(this,I,null);d(this,C,null);d(this,N,null);d(this,H,null);d(this,g,null);d(this,X,null);d(this,D,null);d(this,_,null);d(this,E,null);K()}async render(){return`
      <div class="content">
        <h2 class="content__heading" style="text-align:center;">Tambah Story Baru</h2>
        <div class="card" style="max-width:600px;margin:24px auto;padding:32px 24px 24px 24px;box-shadow:0 1px 8px #0001;border-radius:12px;background:#fff;">
          <form id="add-story-form" class="add-story-form">
            <div class="form-group">
              <label for="description">Deskripsi*</label>
              <input id="description" name="description" type="text" required placeholder="Tulis deskripsi..." aria-describedby="description-error" />
              <p id="description-error" class="error-message" aria-live="polite"></p>
            </div>
            <div class="form-group">
              <label for="photo">Photo* (max 1MB)</label>
              <input id="photo" name="photo" type="file" accept="image/*" aria-describedby="photo-error" />
              <button type="button" id="open-camera-btn" class="btn btn--secondary" style="margin-top: 5px;">Buka Kamera</button>
              <p id="photo-error" class="error-message" aria-live="polite"></p>
            </div>
            <div id="camera-view" style="display:none; margin-bottom:12px;">
              <video id="camera-video" autoplay playsinline style="width:100%; max-width:300px; border:1px solid #ccc;"></video>
              <button type="button" id="take-photo-btn" class="btn btn--secondary" style="margin-top:5px;">Ambil Foto</button>
              <canvas id="camera-canvas" style="display:none;"></canvas>
              <h4>Preview Foto Kamera:</h4>
              <img id="photo-preview" src="#" alt="Preview Foto" style="max-width:200px; max-height:200px; margin-top:5px; display:none; border:1px solid #ddd;" />
            </div>
            <div class="form-group">
              <label for="lat">Latitude (opsional)</label>
              <input id="lat" name="lat" type="number" step="any" placeholder="-6.200000" />
            </div>
            <div class="form-group">
              <label for="lon">Longitude (opsional)</label>
              <input id="lon" name="lon" type="number" step="any" placeholder="106.800000" />
            </div>
            <div class="form-group">
              <label>Pilih lokasi pada peta (klik marker):</label>
              <div id="add-story-map" style="height:200px; margin-bottom:12px; border-radius:8px; border:1px solid #ccc;"></div>
            </div>
            <button type="submit" class="btn btn--primary" style="width:100%">Tambah Story</button>
            <p id="add-story-message" class="message" style="margin-top:16px" aria-live="polite"></p>
          </form>
        </div>
      </div>
    `}async afterRender(){if(u(this,v,document.getElementById("add-story-form")),u(this,J,n(this,v).querySelector("#description")),u(this,Q,n(this,v).querySelector("#photo")),u(this,se,n(this,v).querySelector("#open-camera-btn")),u(this,q,n(this,v).querySelector("#camera-view")),u(this,B,n(this,v).querySelector("#camera-video")),u(this,le,n(this,v).querySelector("#take-photo-btn")),u(this,I,n(this,v).querySelector("#camera-canvas")),u(this,C,n(this,v).querySelector("#photo-preview")),u(this,N,n(this,v).querySelector("#lat")),u(this,H,n(this,v).querySelector("#lon")),u(this,g,n(this,v).querySelector("#add-story-message")),u(this,X,n(this,v).querySelector("#description-error")),u(this,D,n(this,v).querySelector("#photo-error")),window.L&&document.getElementById("add-story-map")){const e=L.map("add-story-map").setView([-6.2,106.8],11);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"&copy; OpenStreetMap contributors"}).addTo(e);let t;e.on("click",i=>{const{lat:r,lng:a}=i.latlng;n(this,N).value=r,n(this,H).value=a,t?t.setLatLng(i.latlng):t=L.marker(i.latlng).addTo(e)})}n(this,se).addEventListener("click",h(this,k,Je).bind(this)),n(this,le).addEventListener("click",h(this,k,Qe).bind(this)),n(this,v).addEventListener("submit",h(this,k,Xe).bind(this)),window.addEventListener("beforeunload",h(this,k,W).bind(this))}}v=new WeakMap,J=new WeakMap,Q=new WeakMap,se=new WeakMap,q=new WeakMap,B=new WeakMap,le=new WeakMap,I=new WeakMap,C=new WeakMap,N=new WeakMap,H=new WeakMap,g=new WeakMap,X=new WeakMap,D=new WeakMap,_=new WeakMap,E=new WeakMap,k=new WeakSet,W=function(){n(this,_)&&(n(this,_).getTracks().forEach(e=>e.stop()),u(this,_,null),n(this,B)&&(n(this,B).srcObject=null)),n(this,q)&&(n(this,q).style.display="none")},Je=async function(){if(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)try{h(this,k,W).call(this),u(this,_,await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}})),n(this,B).srcObject=n(this,_),n(this,q).style.display="block",n(this,C).style.display="none",u(this,E,null),n(this,g).textContent="",n(this,D).textContent=""}catch(e){console.error("Error accessing camera:",e),n(this,g).textContent="Tidak bisa mengakses kamera: "+e.message,n(this,g).style.color="red",h(this,k,W).call(this)}else n(this,g).textContent="getUserMedia tidak didukung di browser ini.",n(this,g).style.color="red"},Qe=function(){n(this,_)&&n(this,B).readyState===n(this,B).HAVE_ENOUGH_DATA?(n(this,I).width=n(this,B).videoWidth,n(this,I).height=n(this,B).videoHeight,n(this,I).getContext("2d").drawImage(n(this,B),0,0,n(this,I).width,n(this,I).height),n(this,I).toBlob(t=>{u(this,E,new File([t],"camera_photo.jpg",{type:"image/jpeg"})),n(this,C).src=URL.createObjectURL(n(this,E)),n(this,C).style.display="block",n(this,g).textContent="Foto berhasil diambil dari kamera.",n(this,g).style.color="green",n(this,D).textContent="",h(this,k,W).call(this)},"image/jpeg",.9)):(n(this,g).textContent="Stream kamera belum siap atau tidak ada.",n(this,g).style.color="red")},Xe=async function(e){e.preventDefault();let t=!0;n(this,X).textContent="",n(this,D).textContent="",n(this,g).textContent="",n(this,J).value.trim()||(n(this,X).textContent="Deskripsi wajib diisi.",t=!1);const i=n(this,Q).files[0];if(!i&&!n(this,E)?(n(this,D).textContent="Photo wajib diunggah atau diambil dari kamera.",t=!1):i&&i.size>1e6?(n(this,D).textContent="Ukuran foto maksimal 1MB.",t=!1):n(this,E)&&n(this,E).size>1e6&&(n(this,D).textContent="Ukuran foto dari kamera maksimal 1MB.",t=!1),!t){n(this,g).textContent="Harap perbaiki error pada form.",n(this,g).style.color="red";return}n(this,g).textContent="Mengirim...",n(this,g).style.color="black";const r=await Ye({description:n(this,J).value.trim(),photo:n(this,E)||i,lat:n(this,N).value?parseFloat(n(this,N).value):void 0,lon:n(this,H).value?parseFloat(n(this,H).value):void 0});r.ok?(n(this,g).textContent="Story berhasil ditambahkan!",n(this,g).style.color="green",n(this,v).reset(),n(this,Q).value="",u(this,E,null),n(this,C).style.display="none",n(this,C).src="#",h(this,k,W).call(this)):(n(this,g).textContent=r.message||"Gagal menambah story.",n(this,g).style.color="red")};function Vt(){const o=document.getElementById("add-story-root");if(!o){console.error("Element #add-story-root tidak ditemukan");return}o.innerHTML="";const e=document.createElement("form");e.style.maxWidth="400px",e.style.margin="0 auto";let t=null,i=null;e.innerHTML=`
    <h2>Tambah Story Baru</h2>
    <div style="margin-bottom:12px">
      <label for="description">Deskripsi*</label><br />
      <input id="description" type="text" required placeholder="Tulis deskripsi..." style="width:100%" />
    </div>
    <div style="margin-bottom:12px">
      <label for="photo">Photo* (max 1MB)</label><br />
      <input id="photo" type="file" accept="image/*" />
      <button type="button" id="open-camera-btn" style="margin-top: 5px;">Buka Kamera</button>
    </div>
    <div id="camera-view" style="display:none; margin-bottom:12px;">
      <video id="camera-video" autoplay playsinline style="width:100%; max-width:300px; border:1px solid #ccc;"></video>
      <button type="button" id="take-photo-btn" style="margin-top:5px;">Ambil Foto</button>
      <canvas id="camera-canvas" style="display:none;"></canvas>
      <h4>Preview Foto Kamera:</h4>
      <img id="photo-preview" src="#" alt="Preview Foto" style="max-width:200px; max-height:200px; margin-top:5px; display:none; border:1px solid #ddd;" />
    </div>
    <div style="margin-bottom:12px">
      <label for="lat">Latitude (opsional)</label><br />
      <input id="lat" type="number" step="any" placeholder="-6.2" style="width:100%" />
    </div>
    <div style="margin-bottom:12px">
      <label for="lon">Longitude (opsional)</label><br />
      <input id="lon" type="number" step="any" placeholder="106.8" style="width:100%" />
    </div>
    <button type="submit" style="width:100%">Tambah Story</button>
    <p id="add-story-message" style="margin-top:16px"></p>
  `,o.appendChild(e);const r=e.querySelector("#description"),a=e.querySelector("#photo"),s=e.querySelector("#open-camera-btn"),c=e.querySelector("#camera-view"),l=e.querySelector("#camera-video"),f=e.querySelector("#take-photo-btn"),w=e.querySelector("#camera-canvas"),U=e.querySelector("#photo-preview"),j=e.querySelector("#lat"),F=e.querySelector("#lon"),p=e.querySelector("#add-story-message");function b(){t&&(t.getTracks().forEach(m=>m.stop()),t=null,l&&(l.srcObject=null)),c&&(c.style.display="none")}s.onclick=async()=>{if(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)try{b(),t=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}),l.srcObject=t,c.style.display="block",U.style.display="none",i=null,p.textContent=""}catch(m){console.error("Error accessing camera:",m),p.textContent="Tidak bisa mengakses kamera: "+m.message,p.style.color="red",b()}else p.textContent="getUserMedia tidak didukung di browser ini.",p.style.color="red"},f.onclick=()=>{t&&l.readyState===l.HAVE_ENOUGH_DATA?(w.width=l.videoWidth,w.height=l.videoHeight,w.getContext("2d").drawImage(l,0,0,w.width,w.height),w.toBlob(x=>{i=new File([x],"camera_photo.jpg",{type:"image/jpeg"}),U.src=URL.createObjectURL(i),U.style.display="block",p.textContent="Foto berhasil diambil dari kamera.",p.style.color="green",b()},"image/jpeg",.9)):(p.textContent="Stream kamera belum siap atau tidak ada.",p.style.color="red")},e.onsubmit=async m=>{if(m.preventDefault(),!r.value.trim()){p.textContent="Deskripsi wajib diisi.",p.style.color="red";return}if(!a.files[0]&&!i){p.textContent="Photo wajib diunggah.",p.style.color="red";return}p.textContent="Mengirim...",p.style.color="black";const x=await Ye({description:r.value.trim(),photo:i||a.files[0],lat:j.value?parseFloat(j.value):void 0,lon:F.value?parseFloat(F.value):void 0});x.ok?(p.textContent="Story berhasil ditambahkan!",p.style.color="green",e.reset(),a.value="",i=null,U.style.display="none",U.src="#",t&&(t.getTracks().forEach(T=>T.stop()),t=null),c.style.display="none"):(p.textContent=x.message||"Gagal menambah story.",p.style.color="red")},window.addEventListener("hashchange",b)}document.addEventListener("DOMContentLoaded",()=>{document.getElementById("add-story-root")&&Vt()});const Ee={vapidPublicKey:"BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk",apiBaseUrl:"https://story-api.dicoding.dev/v1"};console.log("[Main] Script loaded.");function Ze(){const o=localStorage.getItem("accessToken");return console.log("[Auth] Access token:",o?`***${o.slice(-5)}`:"Tidak ada token"),o}function Wt(o){const e="=".repeat((4-o.length%4)%4),t=(o+e).replace(/-/g,"+").replace(/_/g,"/"),i=window.atob(t);return Uint8Array.from([...i].map(r=>r.charCodeAt(0)))}async function et(){try{const o=await navigator.serviceWorker.ready;console.log("[Push] Service Worker siap:",o.scope);const e=await Notification.requestPermission();return console.log("[Push] Izin notifikasi:",e),e!=="granted"?(console.warn("[Push] Izin tidak diberikan"),null):o}catch(o){throw console.error("[Push] Gagal inisialisasi:",o),o}}async function tt(){try{const e=await(await navigator.serviceWorker.ready).pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:Wt(Ee.vapidPublicKey)}),t=Ze();if(!t)throw new Error("User belum login");const i=btoa(String.fromCharCode(...new Uint8Array(e.getKey("p256dh")))),r=btoa(String.fromCharCode(...new Uint8Array(e.getKey("auth"))));if(!(await fetch(`${Ee.apiBaseUrl}/notifications/subscribe`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({endpoint:e.endpoint,keys:{p256dh:i,auth:r}})})).ok)throw new Error("Gagal kirim subscription ke server");return console.log("[Push] ✅ Berhasil subscribe"),!0}catch(o){throw console.error("[Push] ❌ Gagal subscribe:",o),o}}async function ot(){try{const e=await(await navigator.serviceWorker.ready).pushManager.getSubscription();if(!e)return console.warn("[Push] Tidak ada subscription aktif"),!1;await e.unsubscribe();const t=Ze();if(!t)throw new Error("User belum login");if(!(await fetch(`${Ee.apiBaseUrl}/notifications/subscribe`,{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({endpoint:e.endpoint})})).ok)throw new Error("Gagal hapus subscription dari server");return console.log("[Push] ✅ Berhasil unsubscribe"),!0}catch(o){throw console.error("[Push] ❌ Gagal unsubscribe:",o),o}}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js",{scope:"/"}).then(o=>{console.log("[Service Worker] Registered with scope:",o.scope)}).catch(o=>{console.error("[Service Worker] Registration failed:",o)})});window.addEventListener("online",async()=>{console.log("[Sync] Online kembali, mulai sinkronisasi story offline...");const o=await Le.getAll();for(const e of o){const{description:t,photoBase64:i,lat:r,lon:a,token:s,id:c}=e;try{const l=await(await fetch(i)).blob(),f=new File([l],"photo.jpg",{type:l.type}),w=new FormData;w.append("description",t),w.append("photo",f),r!==void 0&&a!==void 0&&(w.append("lat",parseFloat(r)),w.append("lon",parseFloat(a))),(await fetch(de.STORY,{method:"POST",headers:{Authorization:`Bearer ${s}`},body:w})).ok?(await Le.delete(c),console.log("✅ Berhasil kirim story dari offline queue")):console.warn("⚠️ Gagal kirim story, akan dicoba ulang nanti")}catch(l){console.error("❌ Error saat upload story offline:",l)}}});class Kt{constructor(){}async render(){return`
      <div class="content">
        <div class="card" id="story-detail-card" style="max-width:600px;margin:24px auto;padding:32px 24px 24px 24px;box-shadow:0 1px 8px #0001;border-radius:12px;background:#fff;">
          <div id="story-detail-loading">Loading detail story...</div>
          <div id="story-detail-content" style="display:none"></div>
        </div>
      </div>
    `}async afterRender(){var p;const t=window.location.hash.match(/#\/stories\/(.+)$/),i=t?t[1]:null,r=document.getElementById("story-detail-loading"),a=document.getElementById("story-detail-content");if(!i){r.textContent="ID story tidak ditemukan di URL.";return}r.textContent="Mengambil data...";let s=null,c="";try{const b=localStorage.getItem("accessToken");if(!b)throw new Error("User not authenticated.");const m=await fetch(`${V}/stories/${i}`,{method:"GET",headers:{Authorization:`Bearer ${b}`,"Content-Type":"application/json"}});if(!m.ok)throw new Error("Gagal mengambil dari server, mencoba mode offline.");s=(await m.json()).story,c=s.photoUrl,console.log("[StoryDetailPage] Story loaded online:",s)}catch(b){console.warn("[StoryDetailPage] Gagal fetch online:",b.message,"Mencoba dari IndexedDB...");const m=await G.getStory(i);if(!m){r.textContent="Gagal mengambil detail story: "+b.message+" dan tidak ada di penyimpanan offline.";return}s=m,s.photoBlob?(c=URL.createObjectURL(s.photoBlob),console.log("✅ Menggunakan photoBlob offline dari IndexedDB",s.photoBlob)):(c="",console.warn("⚠️ photoBlob tidak ditemukan di story offline!")),console.log("[StoryDetailPage] Story loaded offline:",s)}if(a.innerHTML=`
      ${c?`<img src="${c}" alt="${s.name}" style="width:100%;max-width:350px;display:block;margin:0 auto 16px auto;border-radius:8px;object-fit:cover;" />`:""}
      <h2 style="margin-bottom:8px;">${s.name}</h2>
      <div style="color:#888;font-size:0.95em;margin-bottom:10px;">${new Date(s.createdAt).toLocaleString()}</div>
      <div style="margin-bottom:16px;">${s.description}</div>
      <div id="story-detail-map" style="height:200px;border-radius:8px;border:1px solid #ccc;margin-bottom:12px;"></div>
      <div id="notif-btn" style="text-align:center;margin-top:16px;"></div>
      <div id="save-actions-container" style="text-align:center;margin-top:16px;"></div>
    `,r.style.display="none",a.style.display="block",window.L&&s.lat&&s.lon){const b=L.map("story-detail-map").setView([s.lat,s.lon],13);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"&copy; OpenStreetMap contributors"}).addTo(b),L.marker([s.lat,s.lon]).addTo(b).bindPopup(`<b>${s.name}</b><br>${s.description}`).openPopup()}else document.getElementById("story-detail-map").innerHTML='<div style="color:#888;text-align:center;padding-top:70px;">Tidak ada lokasi</div>';const l=document.getElementById("notif-btn");l.innerHTML=be(),await et();const f=()=>{var b,m;(b=document.getElementById("subscribe-btn"))==null||b.addEventListener("click",async()=>{try{await tt(),l.innerHTML=je(),f()}catch(x){alert("Gagal subscribe: "+x.message)}}),(m=document.getElementById("unsubscribe-btn"))==null||m.addEventListener("click",async()=>{try{await ot(),l.innerHTML=be(),f()}catch(x){alert("Gagal unsubscribe: "+x.message)}})};f();const w=document.getElementById("save-actions-container"),U=await G.getStory(s.id),j=b=>{w.innerHTML=b?ft():gt();const m=document.getElementById("report-detail-save"),x=document.getElementById("report-detail-remove");m&&m.addEventListener("click",async()=>{try{console.log("[StoryDetailPage] Attempting to save story offline:",s.photoUrl);const T=await fetch(s.photoUrl);if(!T.ok)throw new Error("Gagal mengambil gambar dari jaringan untuk disimpan offline. Pastikan Anda online.");const Pe=await T.blob();console.log("[StoryDetailPage] Fetched photo as blob:",Pe),await G.saveStory({id:s.id,name:s.name,description:s.description,createdAt:s.createdAt,lat:s.lat,lon:s.lon,photoBlob:Pe,photoUrl:s.photoUrl}),alert("Story berhasil disimpan untuk offline!"),j(!0)}catch(T){console.error("[StoryDetailPage] Gagal menyimpan story offline:",T),alert("Gagal menyimpan story untuk offline: "+T.message)}}),x&&x.addEventListener("click",async()=>{try{await G.deleteStory(s.id),alert("Story offline berhasil dihapus."),j(!1)}catch(T){console.error("[StoryDetailPage] Gagal menghapus story offline:",T),alert("Gagal menghapus story: "+T.message)}})};j(!!U);const F=document.createElement("div");F.style.textAlign="center",F.style.marginTop="12px",F.innerHTML=`
      <button id="clear-offline-btn" style="padding:10px 16px;border:none;background:#e53935;color:#fff;border-radius:8px;cursor:pointer;">
        Hapus Semua Story Offline (Cache Lokal)
      </button>
    `,a.appendChild(F),(p=document.getElementById("clear-offline-btn"))==null||p.addEventListener("click",async()=>{if(confirm("Yakin ingin menghapus semua story offline yang tersimpan? Ini akan menghapus data yang di-cache secara manual."))try{await G.clearAllStories(),alert("Semua story offline berhasil dihapus."),j(!1)}catch(m){console.error("[StoryDetailPage] Gagal menghapus semua story offline:",m),alert("Gagal menghapus semua story offline: "+m.message)}})}}const Yt={async render(){return`
      <div class="content">
        <h2>Offline Stories</h2>
        <div id="offline-stories" class="story-list"></div>
      </div>
    `},async afterRender(){const o=document.getElementById("offline-stories"),e=await G.getAllStories();if(e.length===0){o.innerHTML="<p>Belum ada cerita offline tersimpan.</p>";return}o.innerHTML=e.map(t=>`
      <div class="story-card">
        <h3>${t.name}</h3>
        <p>${t.description}</p>
        <button class="delete-btn" data-id="${t.id}">Hapus</button>
      </div>
    `).join(""),document.querySelectorAll(".delete-btn").forEach(t=>{t.addEventListener("click",async()=>{await G.deleteStory(t.dataset.id),this.afterRender()})})}},Jt={"/login":()=>ve(new qt),"/register":()=>ve(new Ht),"/":()=>K(new $t),"/new-story":()=>K(new zt),"/offline":()=>K(new Yt),"/stories/:id":()=>K(new Kt)};var R,Z,S,ce,y,nt,Te,ue,it,rt,Ie,at;class Qt{constructor({drawerNavigation:e,drawerButton:t,content:i,skipLinkButton:r}){d(this,y);d(this,R,null);d(this,Z,null);d(this,S);d(this,ce);u(this,R,i),u(this,Z,t),u(this,S,e),u(this,ce,r),h(this,y,nt).call(this)}async renderPage(){const e=Fe(),t=Jt[e],i=t();console.log("Rendering page for route:",e);const r=["/add-story","/bookmark"],a=P();if(r.includes(e)&&!a){window.location.hash="/login";return}const s=lt({updateDOM:async()=>{try{n(this,R).innerHTML="";const c=await i.render();c&&(c.nodeType?n(this,R).appendChild(c):typeof c=="string"&&(n(this,R).innerHTML=c)),typeof i.afterRender=="function"&&await i.afterRender(),h(this,y,Ie).call(this)}catch(c){console.error("Error rendering page:",c),n(this,R).innerHTML="<p>Terjadi kesalahan saat memuat halaman</p>"}}});s.ready.catch(console.error),s.updateCallbackDone.then(()=>{scrollTo({top:0,behavior:"instant"}),h(this,y,Te).call(this)})}}R=new WeakMap,Z=new WeakMap,S=new WeakMap,ce=new WeakMap,y=new WeakSet,nt=function(){n(this,ce),n(this,R),h(this,y,at).call(this),h(this,y,Ie).call(this),h(this,y,Te).call(this)},Te=async function(){if(P()&&!(!("serviceWorker"in navigator)||!("PushManager"in window)))try{const e=await navigator.serviceWorker.register("/sw.js",{scope:"/",updateViaCache:"none"});e.active||await navigator.serviceWorker.ready;let t=await e.pushManager.getSubscription();if(!t){if(await Notification.requestPermission()!=="granted")return;t=await e.pushManager.getSubscription()}h(this,y,ue).call(this,!!t)}catch(e){console.error("Push notification error:",e)}},ue=function(e){let t=document.getElementById("push-notification-tools");if(!t){const r=document.querySelector("#navlist");if(!r)return;t=document.createElement("li"),t.id="push-notification-tools",r.prepend(t)}t.innerHTML=e?je():be();const i=e?document.getElementById("unsubscribe-button"):document.getElementById("subscribe-button");i&&(i.onclick=e?h(this,y,rt).bind(this):h(this,y,it).bind(this))},it=async function(){console.log("[DEBUG] Subscribe button clicked");const e=document.getElementById("subscribe-button");e&&(e.disabled=!0);try{const t=await et();if(!t){console.log("[DEBUG] Subscription cancelled or failed");return}console.log("[DEBUG] Sending subscription to server..."),await tt(t)?(console.log("[DEBUG] Subscription successful"),h(this,y,ue).call(this,!0)):(console.error("[ERROR] Failed to save subscription"),alert("Gagal menyimpan preferensi notifikasi. Silakan coba lagi."))}catch(t){console.error("Gagal subscribe:",t),alert("Gagal mengaktifkan notifikasi. Silakan coba lagi.")}finally{e&&(e.disabled=!1)}},rt=async function(){console.log("[DEBUG] Unsubscribe button clicked");const e=document.getElementById("unsubscribe-button");e&&(e.disabled=!0);try{console.log("[DEBUG] Unsubscribing..."),await ot()?(console.log("[DEBUG] Unsubscription successful"),h(this,y,ue).call(this,!1)):(console.error("[ERROR] Failed to remove subscription"),alert("Gagal menonaktifkan notifikasi. Silakan coba lagi."))}catch(t){console.error("Gagal unsubscribe:",t),alert("Gagal menonaktifkan notifikasi. Silakan coba lagi.")}finally{e&&(e.disabled=!1)}},Ie=function(){if(!n(this,S))return;const e=n(this,S).querySelector("#navlist"),t=n(this,S).querySelector("#navlist-main");if(!e||!t)return;const i=!!P();t.innerHTML="";const r=[];if(Array.from(e.children).forEach(l=>{l.id==="push-notification-tools"&&r.push(l)}),e.innerHTML="",r.forEach(l=>e.appendChild(l)),t.innerHTML=ct(),!document.getElementById("push-notification-tools")){const l=document.createElement("li");l.id="push-notification-tools",e.prepend(l)}const a=i?ut():dt(),s=document.createElement("div");s.innerHTML=a,Array.from(s.children).forEach(l=>{const f=document.getElementById(l.id);f&&f.remove(),e.appendChild(l)});const c=document.getElementById("logout-button");if(c){const l=c.cloneNode(!0);c.parentNode.replaceChild(l,c),l.onclick=f=>{f.preventDefault(),confirm("Apakah Anda yakin ingin keluar?")&&(Ge(),window.location.hash="/login")}}},at=function(){if(!n(this,S)){console.error("Navigation drawer element not found");return}n(this,Z).addEventListener("click",()=>{n(this,S).classList.toggle("open")}),document.body.addEventListener("click",e=>{var r,a,s;const t=(r=n(this,S))==null?void 0:r.contains(e.target),i=(a=n(this,Z))==null?void 0:a.contains(e.target);t||i||(s=n(this,S))==null||s.classList.remove("open"),n(this,S).querySelectorAll("a").forEach(c=>{c.contains(e.target)&&n(this,S).classList.remove("open")})})};console.log("Script loaded");document.addEventListener("DOMContentLoaded",async()=>{console.log("DOMFullyLoaded");const o=new Qt({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),drawerNavigation:document.querySelector("#drawer-navigation")});await o.renderPage();const e=document.querySelector(".skip-link"),t=document.querySelector("#main-content");e&&t&&e.addEventListener("click",function(i){i.preventDefault(),e.blur(),t.hasAttribute("tabindex")||t.setAttribute("tabindex","-1"),t.focus(),t.scrollIntoView({behavior:"smooth"})}),window.addEventListener("hashchange",async()=>{await o.renderPage()})});
