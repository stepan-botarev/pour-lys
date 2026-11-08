/* Soft password gate. Keeps casual visitors out; it is not real security (the code is public).
   Set the password with ./set-password.sh — only a hash is stored here. */
(function () {
  const HASH = "47487c35e280bc66312e33a9373d4c23c7ec8c8e5e1e36ea0a112eed67812d27";
  const KEY = "pourlys.gate";
  const QUESTION = "what is your cat's name?";
  // Ask the browser not to evict our storage (the list and the unlock live there).
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {}
  if (!HASH) return;
  const COOKIE = "pourlys_gate=" + HASH.slice(0, 24);
  const unlocked = () => {
    try { if (localStorage.getItem(KEY) === HASH) return true; } catch (e) {}
    return document.cookie.split("; ").includes(COOKIE);
  };
  const remember = () => {
    try { localStorage.setItem(KEY, HASH); } catch (e) {}
    document.cookie = COOKIE + "; max-age=31536000; path=/; SameSite=Lax";
  };
  if (unlocked()) { remember(); return; }
  document.documentElement.classList.add("locked");

  const sha = async (text) => {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("pourlys:" + text.trim().toLowerCase()));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  document.addEventListener("DOMContentLoaded", () => {
    const gate = document.createElement("form");
    gate.className = "gate";
    let stars = "";
    for (let i = 0; i < 70; i++) {
      const s = Math.random() * 2.2 + 0.6;
      stars += `<i style="left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${s}px;height:${s}px;animation-delay:${-Math.random() * 6}s;animation-duration:${3 + Math.random() * 5}s"></i>`;
    }
    gate.innerHTML =
      `<div class="gate-stars" aria-hidden="true">${stars}</div>` +
      '<div class="orb-wrap">' +
        '<div class="orb-halo" aria-hidden="true"></div>' +
        '<div class="orb" role="button" tabindex="0" aria-label="Open">' +
          '<div class="whisper" aria-hidden="true"></div>' +
          '<input type="text" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" aria-label="Password" tabindex="-1">' +
        '</div>' +
      '</div>' +
      '<p class="gate-hint">touch the light</p>' +
      '<button type="submit" hidden></button>';
    document.body.append(gate);
    const whisper = gate.querySelector(".whisper"), orb = gate.querySelector(".orb"), input = gate.querySelector("input"), hint = gate.querySelector(".gate-hint");
    const open = () => {
      if (gate.classList.contains("open")) return;
      gate.classList.add("open"); input.tabIndex = 0; hint.textContent = QUESTION;
      setTimeout(() => input.focus(), 350);
    };
    let done = false, timer = null;
    const paint = () => { whisper.innerHTML = [...input.value].map((ch) => `<i>${ch === " " ? "&nbsp;" : ch.replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]))}</i>`).join(""); };
    const unlock = () => {
      done = true; remember(); hint.textContent = "";
      gate.classList.add("bloom");
      setTimeout(() => { document.documentElement.classList.remove("locked"); }, 500);
      setTimeout(() => gate.remove(), 1700);
    };
    const wrong = () => {
      hint.textContent = "Are you sure you are Lys?";
      orb.classList.remove("wrong"); void orb.offsetWidth; orb.classList.add("wrong");
      input.value = ""; whisper.innerHTML = ""; input.focus();
    };
    // No Enter needed: the moment the right answer is typed, the light opens.
    // A wrong answer is judged a moment after you stop typing (or on Enter).
    const check = async (final) => {
      if (done || !input.value.trim()) return;
      if ((await sha(input.value)) === HASH) unlock(); else if (final) wrong();
    };
    input.addEventListener("input", () => {
      if (hint.textContent !== QUESTION) hint.textContent = QUESTION;
      paint(); clearTimeout(timer); check(false); timer = setTimeout(() => check(true), 1600);
    });
    orb.addEventListener("click", open);
    orb.addEventListener("keydown", (e) => { if (e.target === input) return; if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    gate.addEventListener("submit", (e) => { e.preventDefault(); if (!gate.classList.contains("open")) return open(); clearTimeout(timer); check(true); });
  });
})();
