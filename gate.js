/* Soft password gate. Keeps casual visitors out; it is not real security (the code is public).
   Set the password with ./set-password.sh — only a hash is stored here. */
(function () {
  const HASH = "";
  const KEY = "pourlys.gate";
  if (!HASH) return;
  try { if (localStorage.getItem(KEY) === HASH) return; } catch (e) {}
  document.documentElement.classList.add("locked");

  const sha = async (text) => {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("pourlys:" + text));
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
          '<input type="password" autocomplete="current-password" aria-label="Password" tabindex="-1">' +
        '</div>' +
      '</div>' +
      '<p class="gate-hint">touch the light</p>' +
      '<button type="submit" hidden></button>';
    document.body.append(gate);
    const orb = gate.querySelector(".orb"), input = gate.querySelector("input"), hint = gate.querySelector(".gate-hint");
    const open = () => {
      if (gate.classList.contains("open")) return;
      gate.classList.add("open"); input.tabIndex = 0; hint.textContent = "whisper the word, then press Enter";
      setTimeout(() => input.focus(), 350);
    };
    orb.addEventListener("click", open);
    orb.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    gate.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!gate.classList.contains("open")) return open();
      if ((await sha(input.value)) === HASH) {
        try { localStorage.setItem(KEY, HASH); } catch (err) {}
        hint.textContent = "";
        gate.classList.add("bloom");
        setTimeout(() => { document.documentElement.classList.remove("locked"); }, 500);
        setTimeout(() => gate.remove(), 1700);
      } else {
        hint.textContent = "not quite";
        orb.classList.remove("wrong"); void orb.offsetWidth; orb.classList.add("wrong");
        input.value = ""; input.focus();
      }
    });
  });
})();
