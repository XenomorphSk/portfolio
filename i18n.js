/* ============================================================
   i18n.js — motor compartilhado de idioma (PT ⇄ EN)
   Detecta região naturalmente (navigator.language), lembra a
   escolha do visitante (localStorage) e anima a troca de texto
   com o mesmo efeito de "scramble" glagolítico usado nas
   transições de página do site.

   Elementos SEM tags filhas (texto puro) ganham a animação de
   scramble. Elementos COM tags filhas (<strong>, <em>, <code>...)
   trocam via innerHTML com um fade rápido, pra não destruir nem
   embaralhar a formatação interna.
   ============================================================ */
(function(){
  const STORAGE_KEY = 'xsk_lang';
  const GLYPHS = '01#%&*_-+=<>/\\[]{}?ⰀⰁⰂⰃⰄⰅⰆⰇⰉⰊⰋⰌⰍⰎⰏⰐⰑⰒⰓⰔⰕ';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function randChar(){ return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]; }

  function detectLang(){
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'pt' || stored === 'en') return stored;
    } catch (e) { /* localStorage indisponível */ }
    const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    return nav.indexOf('pt') === 0 ? 'pt' : 'en';
  }

  function saveLang(lang){
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignora */ }
  }

  const nodes = Array.from(document.querySelectorAll('[data-i18n]'));
  const ptCache = {};
  nodes.forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if (!(key in ptCache)) ptCache[key] = el.innerHTML;
  });

  const EN = window.I18N_EN || {};

  function htmlFor(key, lang){
    if (lang === 'en') return (key in EN) ? EN[key] : ptCache[key];
    return ptCache[key];
  }

  function isLeaf(el){
    return el.children.length === 0;
  }

  function scrambleLeaf(el, targetText, duration){
    return new Promise(resolve=>{
      if (reduced || !targetText){ el.textContent = targetText; resolve(); return; }
      const len = targetText.length;
      const totalFrames = Math.max(5, Math.round(duration / 28));
      let frame = 0;
      (function tick(){
        let out = '';
        for (let i = 0; i < len; i++){
          const revealFrame = (i / len) * totalFrames;
          out += (frame >= revealFrame || targetText[i] === ' ') ? targetText[i] : randChar();
        }
        el.textContent = out;
        frame++;
        if (frame <= totalFrames){ setTimeout(tick, 28); }
        else { el.textContent = targetText; resolve(); }
      })();
    });
  }

  function fadeSwapRich(el, targetHTML, duration){
    return new Promise(resolve=>{
      if (reduced){ el.innerHTML = targetHTML; resolve(); return; }
      el.style.transition = 'opacity ' + Math.round(duration/2) + 'ms ease';
      el.style.opacity = '0';
      setTimeout(()=>{
        el.innerHTML = targetHTML;
        el.style.opacity = '1';
        setTimeout(resolve, duration/2);
      }, duration/2);
    });
  }

  function applyLang(lang, animate){
    document.documentElement.lang = (lang === 'pt') ? 'pt-BR' : 'en';
    const btn = document.getElementById('langBtn');
    if (btn){ btn.textContent = (lang === 'pt') ? 'PT ⇄ EN' : 'EN ⇄ PT'; }

    nodes.forEach((el, i)=>{
      const key = el.getAttribute('data-i18n');
      const target = htmlFor(key, lang);
      if (target == null) return;
      const delay = animate ? Math.min(i * 10, 260) : 0;

      if (isLeaf(el)){
        if (animate){ setTimeout(()=> scrambleLeaf(el, target, 420), delay); }
        else { el.textContent = target; }
      } else {
        if (animate){ setTimeout(()=> fadeSwapRich(el, target, 340), delay); }
        else { el.innerHTML = target; }
      }
    });
  }

  let currentLang = detectLang();
  applyLang(currentLang, false);

  const btn = document.getElementById('langBtn');
  if (btn){
    btn.addEventListener('click', ()=>{
      currentLang = (currentLang === 'pt') ? 'en' : 'pt';
      saveLang(currentLang);
      applyLang(currentLang, true);
    });
  }

  window.XSKLang = {
    get: ()=> currentLang,
    set: (lang)=>{ currentLang = lang; saveLang(lang); applyLang(lang, true); }
  };
})();