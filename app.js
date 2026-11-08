/* Pour Lys — a tracker for PhDs, masters, academic-ish jobs and cozy jobs in Berlin.
   Port of Heaven Knows to the web: no server, no accounts; data lives in this browser's localStorage.
   Backup / restore as a .json file. */
(function () {
  "use strict";
  const CFG = window.PL_CONFIG;
  const CATEGORIES = CFG.categories.map((c) => c.id);
  const FAVORITES = "Favorites";
  const STATUSES = ["Not yet sent", "Awaiting response", "Rejected", "No response", "Invited", "Offer"];
  const SHORT = { "Awaiting response": "Awaiting" };
  const STATUS_COLOR = {
    "Not yet sent": "#f0c24b", "Awaiting response": "#6fd69a", "Rejected": "#c8203a",
    "No response": "#e8873a", "Invited": "#9b86ff", "Offer": "#1fae7a",
  };
  const STATUS_COUNTS = [
    ["Not yet sent", "Not yet sent"], ["Awaiting response", "Awaiting response"],
    ["No response after 10 days", "No response"], ["Rejected", "Rejected"],
    ["Invited to next stage", "Invited"], ["Offer made", "Offer"],
  ];
  const STATUS_DATE_LABEL = { "Awaiting response": "Sent", "No response": "Sent", "Rejected": "Rejected", "Invited": "Invited", "Offer": "Offer" };
  const STATUS_ORDER = ["Offer", "Invited", "Not yet sent", "Awaiting response", "No response", "Rejected"];
  const SENT = new Set(["Awaiting response", "No response"]);
  const KEY = "pourlys.v1", SEEN_KEY = "pourlys.gsearchSeen";

  /* ---------- storage ---------- */
  let db = load();
  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(KEY));
      if (d && Array.isArray(d.jobs)) return d;
    } catch (e) {}
    return { seq: 1, jobs: [] };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { toast("Could not save: browser storage is blocked"); } }
  const now = () => new Date().toISOString();
  const byId = (id) => db.jobs.find((j) => j.id === id);

  function expireStale(days = 10) {
    const cutoff = Date.now() - days * 864e5; let changed = false;
    db.jobs.forEach((j) => {
      if (j.status === "Awaiting response") {
        const t = Date.parse(j.sentAt || j.statusChangedAt || j.createdAt);
        if (t && t < cutoff) { j.status = "No response"; j.statusChangedAt = now(); changed = true; }
      }
    });
    if (changed) save();
  }
  function setStatus(job, status) {
    job.status = status; job.statusChangedAt = now();
    if (SENT.has(status) && !job.sentAt) job.sentAt = now();
    save();
  }

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "html") el.innerHTML = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    }
    kids.flat().forEach((c) => c != null && el.append(c.nodeType ? c : document.createTextNode(c)));
    return el;
  }
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function shortDate(iso) { const d = iso && new Date(iso); return d && !isNaN(d) ? `${d.getDate()} ${MONTHS[d.getMonth()]}` : ""; }
  function parseDeadline(text) {
    text = (text || "").trim(); let m;
    if ((m = text.match(/^(\d{4})-(\d{2})-(\d{2})$/))) return new Date(+m[1], +m[2] - 1, +m[3]);
    if ((m = text.match(/^(\d{1,2})[./](\d{1,2})[./](\d{2,4})$/))) return new Date(+m[3] < 100 ? 2000 + +m[3] : +m[3], +m[2] - 1, +m[1]);
    return null;
  }
  function deadlineInfo(job) {
    const raw = (job.deadline || "").trim(); if (!raw) return null;
    const d = parseDeadline(raw);
    if (!d) return { text: raw, past: false };
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return { text: `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`, past: d < t };
  }
  function toISODate(text) { const d = parseDeadline(text); return d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` : ""; }
  function scoreTier(s) { return s == null ? "" : s > 85 ? "top" : s >= 70 ? "good" : s >= 60 ? "mid" : s >= 50 ? "low" : "bad"; }
  function prettyLink(url) { try { const u = new URL(url); return u.hostname.replace(/^www\./, "") + (u.pathname.length > 1 ? "/…" : ""); } catch (e) { return url; } }
  function validUrl(u) { try { const x = new URL(u); return /^https?:$/.test(x.protocol); } catch (e) { return false; } }
  function toast(msg) {
    const t = h("div", { class: "toast" }, msg);
    Object.assign(t.style, { position: "fixed", left: "50%", bottom: "26px", transform: "translateX(-50%)", zIndex: 200, background: "#e6d7a8", color: "#14181f", padding: "9px 18px", fontWeight: 700, fontSize: "12px", boxShadow: "-10px 0 18px -6px #ff5a36, 0 0 30px rgba(255,90,54,.5)" });
    document.body.append(t); setTimeout(() => t.remove(), 2200);
  }
  async function copy(text, btn, label) {
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
      const t = h("textarea"); t.value = text; document.body.append(t); t.select();
      try { ok = document.execCommand("copy"); } catch (e2) {} t.remove();
    }
    if (btn) { const old = label || btn.textContent; btn.textContent = ok ? "COPIED ✓" : "COPY FAILED"; setTimeout(() => (btn.textContent = old), 1800); }
    return ok;
  }
  function inline(text) {
    let s = esc(text);
    s = s.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/(^|[\s(])\*(?!\s)(.+?)\*(?=[\s).,;:!?]|$)/g, "$1<i>$2</i>");
    return s.replace(/(https?:\/\/[^\s<)]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1 ↗</a>');
  }

  /* ---------- popover ---------- */
  let openPop = null;
  function popover(anchor, items, current, onPick) {
    closePop();
    const pop = h("div", { class: "pop" }, items.map((it) => h("button", { class: it === current ? "cur" : "", onclick: () => { closePop(); onPick(it); } }, it)));
    document.body.append(pop);
    const r = anchor.getBoundingClientRect();
    pop.style.left = Math.min(window.scrollX + r.left, window.scrollX + innerWidth - 210) + "px";
    pop.style.top = window.scrollY + r.bottom + 6 + "px";
    openPop = pop;
  }
  function closePop() { if (openPop) { openPop.remove(); openPop = null; } }
  document.addEventListener("click", (e) => { if (openPop && !openPop.contains(e.target) && !e.target.closest("[data-pop]")) closePop(); });

  /* ---------- modal ---------- */
  const modalEl = $("#modal");
  function modal(title, build, wide) {
    modalEl.className = wide ? "wide" : "";
    modalEl.innerHTML = "";
    const body = h("div", { class: "dlg-body" });
    modalEl.append(h("div", { class: "dlg-head" }, h("h2", {}, title), h("button", { class: "x", "aria-label": "Close", onclick: closeModal }, "✕")), body);
    build(body);
    if (!modalEl.open) modalEl.showModal();
  }
  function closeModal() { if (modalEl.open) modalEl.close(); }
  modalEl.addEventListener("click", (e) => { if (e.target === modalEl) closeModal(); });

  /* ---------- UI state ---------- */
  const ui = { tab: "list", section: "All", q: "", sort: null, statsSection: "All" };
  const view = $("#view");

  document.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => setTab(b.dataset.tab)));
  function setTab(tab) {
    ui.tab = tab;
    document.querySelectorAll(".tab").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === tab)));
    render();
  }
  function render() { expireStale(); closePop(); ui.tab === "list" ? renderList() : renderStats(); }

  /* ---------- LIST ---------- */
  function filtered() {
    let jobs = db.jobs.slice();
    if (ui.section === FAVORITES) jobs = jobs.filter((j) => j.favorite);
    else if (ui.section !== "All") jobs = jobs.filter((j) => j.category === ui.section);
    const q = ui.q.trim().toLowerCase();
    if (q) jobs = jobs.filter((j) => [j.title, j.org, j.location, j.funding, j.notes].join(" ").toLowerCase().includes(q));
    const created = (j) => Date.parse(j.createdAt) || 0;
    if (ui.sort === "score") jobs.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
    else if (ui.sort === "added") jobs.sort((a, b) => created(b) - created(a));
    else if (ui.sort === "sent") jobs.sort((a, b) => (Date.parse(b.sentAt) || 0) - (Date.parse(a.sentAt) || 0));
    else jobs.sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) || created(b) - created(a));
    return jobs;
  }

  let cardsEl;
  function renderList() {
    view.innerHTML = "";
    const chips = h("div", { class: "chips" });
    const paintChips = () => {
      chips.innerHTML = "";
      ["All", ...CATEGORIES, FAVORITES].forEach((s) => chips.append(h("button", { class: "chip", "aria-pressed": String(ui.section === s), onclick: () => { ui.section = s; paintChips(); renderCards(); } }, s === FAVORITES ? "♥ Favorites" : s)));
    };
    paintChips();
    cardsEl = h("div", { class: "cards" });
    view.append(h("section", { class: "panel" },
      h("div", { class: "panel-head" },
        h("div", { class: "section-title" }, "LIST"),
        h("div", { class: "actions" },
          h("button", { class: "icon-btn", title: "Search the web", "aria-label": "Search", onclick: searchDialog }, "⌕"),
          h("button", { class: "icon-btn", title: "Backup / restore", "aria-label": "Backup", "data-pop": "1", onclick: (e) => popover(e.currentTarget, ["Download backup", "Restore from backup"], null, (v) => v === "Download backup" ? exportData() : importData()) }, "⇅"),
          h("button", { class: "icon-btn", title: "Add", "aria-label": "Add", onclick: () => addDialog() }, "+"))),
      h("div", { class: "divider" }),
      h("div", { class: "filter-row" }, chips,
        h("input", { class: "search-in", type: "search", placeholder: "Search…", value: ui.q, oninput: (e) => { ui.q = e.target.value; renderCards(); } })),
      h("div", { class: "divider" }),
      cardsEl));
    renderCards();
  }

  function toggleSort(k) { ui.sort = ui.sort === k ? null : k; renderCards(); }

  function renderCards() {
    cardsEl.innerHTML = "";
    const jobs = filtered();
    if (!jobs.length) {
      cardsEl.append(h("div", { class: "empty-note" }, db.jobs.length ? "Nothing matches." : "Nothing on the desk yet.",
        h("small", {}, db.jobs.length ? "Try another section or clear the search." : "Press ⌕ to search Berlin, + to add what you found.")));
      return;
    }
    jobs.forEach((job, i) => cardsEl.append(card(job, i + 1)));
  }

  function card(job, n) {
    const meta = [];
    const row = (label, html) => meta.push(h("div", { html: `<b>${label}:</b> ${html}` }));
    row("Where", esc(job.org || "—"));
    if (job.funding) row("Funding / pay", esc(job.funding));
    row("Location", esc(job.location || "Berlin"));
    if (job.url) row("Link", `<a href="${esc(job.url)}" target="_blank" rel="noopener noreferrer">${esc(prettyLink(job.url))} ↗</a>`);
    const dl = deadlineInfo(job);
    if (dl) row("Deadline", `<span class="${dl.past ? "past" : ""}">${esc(dl.text)}</span>`);

    const dates = h("div", { class: "dates" });
    if (job.createdAt) dates.append(h("button", { class: "date-btn" + (ui.sort === "added" ? " on" : ""), title: "Sort by date added", onclick: () => toggleSort("added") }, "Added " + shortDate(job.createdAt)));
    if (job.sentAt) dates.append(h("button", { class: "date-btn" + (ui.sort === "sent" ? " on" : ""), title: "Sort by date sent", onclick: () => toggleSort("sent") }, "Sent " + shortDate(job.sentAt)));
    const lab = STATUS_DATE_LABEL[job.status];
    if (lab && lab !== "Sent" && job.statusChangedAt) dates.append(h("span", { class: "date-txt" }, `${lab} ${shortDate(job.statusChangedAt)}`));

    const el = h("article", { class: "card", id: "job-" + job.id, style: `--bar:${STATUS_COLOR[job.status] || STATUS_COLOR["Not yet sent"]}` },
      job.score != null ? h("span", { class: `score ${scoreTier(job.score)}${ui.sort === "score" ? " on" : ""}`, title: job.notes || "Sort by rating", onclick: () => toggleSort("score") }, String(job.score)) : null,
      h("div", { class: "card-head" }, h("span", { class: "card-num" }, String(n).padStart(2, "0")), h("h3", { class: "card-title" }, job.title)),
      h("div", { class: "meta" }, meta), dates,
      h("div", { class: "tools" },
        h("button", { class: "tool" + (job.prep ? " done" : ""), title: "Interview prep", onclick: () => prepDialog(job.id) }, "🎤"),
        h("button", { class: "tool" + (job.letter ? " done" : ""), title: "Cover / motivation letter", onclick: () => letterDialog(job.id) }, "✉"),
        h("button", { class: "tool fav" + (job.favorite ? " on" : ""), title: job.favorite ? "Remove from favorites" : "Add to favorites", onclick: () => { job.favorite = !job.favorite; save(); renderCards(); } }, "♥"),
        h("span", { class: "sp" }),
        h("button", { class: "tool", "data-pop": "1", title: "Change category", onclick: (e) => popover(e.currentTarget, CATEGORIES, job.category, (c) => { job.category = c; save(); renderCards(); }) }, job.category),
        h("button", { class: "tool status", "data-pop": "1", title: "Change status", onclick: (e) => popover(e.currentTarget, STATUSES, job.status, (s) => { setStatus(job, s); renderCards(); }) }, SHORT[job.status] || job.status),
        h("button", { class: "tool", title: "Edit", onclick: () => addDialog(job.id) }, "✎"),
        h("button", { class: "tool del", title: "Remove", onclick: () => { if (confirm(`Remove “${job.title}”?`)) { db.jobs = db.jobs.filter((j) => j.id !== job.id); save(); renderCards(); } } }, "✕")));
    return el;
  }

  /* ---------- add / edit ---------- */
  const PREP_TEMPLATE = `🎯 Суть:
- <одной фразой: что это и почему подходит мне>

📮 Адрес и контакт:
- <адрес в Берлине> — https://www.google.com/maps/search/?api=1&query=<адрес+через+плюсы>
- Контакт: <имя, e-mail или телефон из объявления>

🏛️ Об организации:
- <чем занимается, размер, чем известна; без названия в начале: оно уже указано в карточке>

📚 Программа / роль:
- <ключевые задачи или структура программы>
- <что требуют: портфолио, язык, степень, проект>

🕰️ Условия и сроки:
- <срок подачи, этапы отбора, длительность, формат>

💸 Финансирование / ставка:
- <стипендия, зарплата, ставка в час; если нет данных — «нет данных»>
- <как спросить об этом вежливо>

🧑🏻‍🎨 Почему я:
- > <сильная сторона>: <короткий аргумент, с опорой на мой опыт>
- > <сильная сторона>: <короткий аргумент>
- > <сильная сторона>: <короткий аргумент>

🤔 Вероятные вопросы:
- > <тема вопроса>: <короткий ответ, с опорой на мой опыт>
- > <тема вопроса>: <короткий ответ>
- > <тема вопроса>: <короткий ответ>

🙈 Слабые места:
- > <слабое место>: <как честно и уверенно ответить>
- > <слабое место>: <как честно и уверенно ответить>

🙋🏻 Мои вопросы:
- > <тема>: <вопрос организации>
- > <тема>: <вопрос организации>

🩼 Фразы-костыли:
- > Повторить: <реплика>
- > Не понял: <реплика>
- > Медленнее: <реплика>
- > Подумать: <реплика>
- > Письмом: <реплика>

📝 Заметки:
- <что важно не забыть>`;

  function promptRules() {
    return "Правила:\n" +
      "- Всё происходит в Берлине. Сохрани строки-разделы с эмодзи и двоеточием, пункты пиши через «- ».\n" +
      "- Варианты на выбор (если собеседник ответит по-разному) пиши через «- > Подпись: фраза», минимум два подряд. Обычные шаги и факты — просто через «- ».\n" +
      "- Пояснения пиши по-русски, а реплики, которые я скажу вслух, — на языке программы или работы (немецкий или английский, как в объявлении), вежливо. Подпись кнопки до двоеточия — по-русски, а фраза в кнопке — целиком, 2–4 связных предложения.\n" +
      "- Можно **жирный** и *курсив*. Другой разметки не используй.\n" +
      "- Я мужчина: пиши обо мне в мужском роде и в немецких фразах используй мужские формы. Названия должностей с gender-формами пиши в мужской форме.\n" +
      "- Не добавляй пункты про новости и отзывы об организации.\n" +
      "- Ничего не выдумывай. Если данных нет, пиши «нет данных» или «уточнить». Если можешь открыть ссылку, возьми факты оттуда.\n" +
      "- Если сайт защищён от ботов и открыть страницу не получается, не гадай и не заполняй шаблон по названию. Вместо шаблона коротко попроси меня вручную вставить сюда содержимое страницы и дождись его.\n";
  }
  function prepPrompt(job) {
    const facts = [["Название", job.title], ["Организация", job.org], ["Место", job.location], ["Финансирование", job.funding], ["Категория", job.category], ["Ссылка", job.url], ["Заметки", job.notes]]
      .filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n");
    return "Помоги мне подготовиться к заявке, звонку и собеседованию по варианту ниже. Заполни шаблон под ЭТОТ вариант и верни его в точно таком же формате, одним блоком, без вступления и пояснений.\n\n" +
      promptRules() + `\nВариант:\n${facts}\n\nШаблон:\n${PREP_TEMPLATE}`;
  }
  function addPrompt(source) {
    const cats = CATEGORIES.map((c) => `«${c}»`).join(", ");
    return "Помоги мне добавить новую запись в мой трекер (PhD, мастер, работа и стипендии в Берлине в сфере искусства, кино, письма и фотографии) и подготовиться к заявке. Ссылка или текст — в конце сообщения. " +
      "Ответь одним блоком: сначала поля, потом строка из трёх знаков равно (===), потом заполненный шаблон подготовки.\n\n" +
      "Поля (каждое одной строкой, как в образце):\n" +
      "Название: <как в объявлении>\nОрганизация: <университет, студия, кафе, фонд>\nСсылка: <ссылка>\nМесто: <район или адрес в Берлине, либо Remote>\n" +
      `Категория: <одна из: ${cats}; выбери, к чему относится: PhD; практический мастер; работа, на которую можно податься с неоконченным PhD; простая приятная работа>\n` +
      "Финансирование: <стипендия, зарплата или ставка; если нет — пусто>\nДедлайн: <срок подачи в формате ДД.ММ.ГГГГ; если нет — пусто>\nОценка: <число 0–100, насколько это подходит мне; если не знаешь — пусто>\n\n" +
      promptRules() + "\nОбразец ответа:\n<поля>\n===\n" + PREP_TEMPLATE + "\n\nСсылка или текст:\n" + (source || "");
  }
  function pickChoice(value, options) {
    const v = (value || "").toLowerCase().replace(/[«»"']/g, "").trim();
    return options.find((o) => o.toLowerCase() === v) || options.find((o) => v && (v.includes(o.toLowerCase()) || o.toLowerCase().includes(v))) || null;
  }
  function parseAnswer(text) {
    const parts = text.split(/^\s*={3,}\s*$/m);
    const fields = {}, head = parts.length > 1 ? parts[0] : "";
    head.split("\n").forEach((line) => { const m = line.match(/^\s*([^:]{2,24}):\s*(.*)$/); if (m) fields[m[1].trim().toLowerCase()] = m[2].trim(); });
    const prep = (parts.length > 1 ? parts.slice(1).join("\n===\n") : text).trim();
    const f = (...k) => k.map((x) => fields[x]).find(Boolean) || "";
    const score = parseInt(f("оценка", "score"), 10);
    return {
      title: f("название", "title"), org: f("организация", "компания", "org"), url: f("ссылка", "url", "link"),
      location: f("место", "location"), funding: f("финансирование", "зарплата", "funding"),
      category: pickChoice(f("категория", "category"), CATEGORIES), deadline: toISODate(f("дедлайн", "deadline")),
      score: isNaN(score) ? null : Math.max(0, Math.min(100, score)), prep: /(^|\n)\s*-\s/.test(prep) ? prep : "",
    };
  }

  function addDialog(editId) {
    const editing = editId ? byId(editId) : null;
    const draft = editing ? { ...editing } : { title: "", org: "", url: "", location: "Berlin", funding: "", category: ui.section !== "All" && CATEGORIES.includes(ui.section) ? ui.section : CATEGORIES[0], deadline: "", score: null, status: "Not yet sent", prep: "", notes: "" };
    modal(editing ? "Edit" : "Add", (body) => {
      const showMagic = () => {
        body.innerHTML = "";
        const src = h("textarea", { class: "in", placeholder: "Paste the link or the full text of the listing…" });
        const ans = h("textarea", { class: "in", placeholder: "Paste the chatbot's answer here…" });
        const msg = h("div", { class: "msg" });
        const copyBtn = h("button", { class: "btn primary", onclick: () => copy(addPrompt(src.value.trim()), copyBtn, "COPY INSTRUCTIONS") }, "COPY INSTRUCTIONS");
        body.append(
          h("p", { class: "hint" }, "1 · Paste the listing. 2 · Copy the instructions into any chatbot. 3 · Paste its answer back — the fields and the prep notes fill themselves."),
          h("label", { class: "f" }, "Link or text"), src,
          h("div", { class: "btn-row" }, copyBtn),
          h("label", { class: "f" }, "Chatbot answer"), ans,
          h("div", { class: "btn-row" },
            h("button", { class: "btn primary", onclick: () => {
              if (!ans.value.trim()) { msg.textContent = "Paste the answer first."; return; }
              const p = parseAnswer(ans.value);
              Object.entries(p).forEach(([k, v]) => { if (v != null && v !== "") draft[k] = v; });
              if (!draft.url && validUrl(src.value.trim())) draft.url = src.value.trim();
              showForm();
            } }, "APPLY"),
            h("button", { class: "btn ghost", onclick: showForm }, "FILL FIELDS MYSELF")), msg);
      };
      const showForm = () => {
        body.innerHTML = "";
        const f = {};
        const field = (key, label, el) => { f[key] = el; return h("div", {}, h("label", { class: "f" }, label), el); };
        const txt = (key, ph) => h("input", { class: "in", value: draft[key] ?? "", placeholder: ph || "" });
        const sel = (items, cur) => { const s = h("select", { class: "in" }, items.map((x) => h("option", { value: x, selected: x === cur }, x))); return s; };
        const msg = h("div", { class: "msg" });
        body.append(
          field("title", "Title", txt("title", "e.g. Doctoral position, Film Studies")),
          field("org", "Where (university, studio, café…)", txt("org")),
          h("div", { class: "grid2" }, field("category", "Category", sel(CATEGORIES, draft.category)), field("status", "Status", sel(STATUSES, draft.status))),
          field("url", "Link", txt("url", "https://…")),
          h("div", { class: "grid2" }, field("location", "Location", txt("location")), field("funding", "Funding / pay", txt("funding", "e.g. 1,400 €/month"))),
          h("div", { class: "grid2" }, field("deadline", "Deadline", h("input", { class: "in", type: "date", value: draft.deadline || "" })), field("score", "Fit score (0–100, optional)", h("input", { class: "in", type: "number", min: 0, max: 100, value: draft.score ?? "" }))),
          field("notes", "Notes", h("textarea", { class: "in", style: "min-height:80px" }, draft.notes || "")),
          h("div", { class: "btn-row" },
            h("button", { class: "btn primary", onclick: () => {
              const v = Object.fromEntries(Object.entries(f).map(([k, el]) => [k, el.value.trim()]));
              if (!v.title) { msg.textContent = "A title is needed."; return; }
              if (v.url && !validUrl(v.url)) { msg.textContent = "The link should start with https://"; return; }
              if (v.url && db.jobs.some((j) => j.url === v.url && j.id !== editId)) { msg.textContent = "This link is already on the list."; return; }
              const rec = editing || { id: db.seq++, createdAt: now(), favorite: false, letter: "" };
              Object.assign(rec, { title: v.title, org: v.org, category: v.category, url: v.url, location: v.location, funding: v.funding, deadline: v.deadline, notes: v.notes, score: v.score === "" ? null : Math.max(0, Math.min(100, +v.score)), prep: draft.prep || rec.prep || "" });
              if (!editing) { db.jobs.push(rec); rec.status = "Not yet sent"; }
              if (rec.status !== v.status) setStatus(rec, v.status);
              save(); closeModal(); renderCards();
              toast(editing ? "Saved" : "Added ♥");
            } }, "SAVE"),
            !editing ? h("button", { class: "btn ghost", onclick: showMagic }, "← BACK") : null), msg);
      };
      editing ? showForm() : showMagic();
    });
  }

  /* ---------- prep notes ---------- */
  function renderPrep(text) {
    const root = h("div", { class: "prep" });
    let ul = null, opts = null, phraseBox = null;
    const flush = () => { ul = null; opts = null; phraseBox = null; };
    text.split("\n").forEach((raw) => {
      const line = raw.trimEnd(); if (!line.trim()) { flush(); return; }
      let m;
      if ((m = line.match(/^\s*-\s*>\s*([^:]+):\s*(.+)$/))) {
        if (!opts) { opts = h("div", { class: "opts" }); phraseBox = h("div"); root.append(opts, phraseBox); ul = null; }
        const box = phraseBox, row = opts, label = m[1].trim(), phrase = m[2].trim();
        const btn = h("button", { class: "opt", onclick: () => {
          const same = btn.classList.contains("on");
          row.querySelectorAll(".opt").forEach((o) => o.classList.remove("on")); box.innerHTML = "";
          if (!same) { btn.classList.add("on"); box.append(h("div", { class: "phrase", html: inline(phrase) })); }
        } }, label);
        opts.append(btn);
      } else if ((m = line.match(/^\s*-\s+(.*)$/))) {
        if (!ul) { ul = h("ul"); root.append(ul); } opts = null; ul.append(h("li", { html: inline(m[1]) }));
      } else if (/:\s*$/.test(line) || /^\p{Extended_Pictographic}/u.test(line)) {
        flush(); root.append(h("h4", {}, line.replace(/:\s*$/, "")));
      } else { flush(); root.append(h("p", { html: inline(line) })); }
    });
    return root;
  }

  function prepDialog(id) {
    const job = byId(id);
    modal("Prep · " + job.title, (body) => {
      let mode = job.prep ? "view" : "edit";
      const draw = () => {
        body.innerHTML = "";
        if (mode === "view") {
          body.append(renderPrep(job.prep), h("div", { class: "btn-row" },
            h("button", { class: "btn", onclick: () => { mode = "edit"; draw(); } }, "EDIT"),
            h("button", { class: "btn ghost", onclick: () => { mode = "magic"; draw(); } }, "✦ REGENERATE WITH A CHATBOT")));
        } else if (mode === "edit") {
          const ta = h("textarea", { class: "in big" }); ta.value = job.prep || PREP_TEMPLATE;
          body.append(ta, h("div", { class: "btn-row" },
            h("button", { class: "btn primary", onclick: () => { job.prep = ta.value.trim() === PREP_TEMPLATE.trim() ? "" : ta.value.trim(); save(); renderCards(); mode = job.prep ? "view" : "edit"; if (job.prep) draw(); else toast("Saved"); } }, "SAVE"),
            h("button", { class: "btn ghost", onclick: () => { mode = "magic"; draw(); } }, "✦ FILL WITH A CHATBOT"),
            job.prep ? h("button", { class: "btn ghost", onclick: () => { mode = "view"; draw(); } }, "CANCEL") : null));
        } else {
          const ans = h("textarea", { class: "in big", placeholder: "Paste the chatbot's answer here…" });
          const cb = h("button", { class: "btn primary", onclick: () => copy(prepPrompt(job), cb, "COPY INSTRUCTIONS") }, "COPY INSTRUCTIONS");
          body.append(h("p", { class: "hint" }, "Copy the instructions into any chatbot, then paste the filled template back."), h("div", { class: "btn-row" }, cb), h("label", { class: "f" }, "Answer"), ans,
            h("div", { class: "btn-row" },
              h("button", { class: "btn primary", onclick: () => { if (!ans.value.trim()) return; job.prep = ans.value.split(/^\s*={3,}\s*$/m).pop().trim(); save(); renderCards(); mode = "view"; draw(); } }, "SAVE"),
              h("button", { class: "btn ghost", onclick: () => { mode = job.prep ? "view" : "edit"; draw(); } }, "CANCEL")));
        }
      };
      draw();
    }, true);
  }

  function letterDialog(id) {
    const job = byId(id);
    modal("Letter · " + job.title, (body) => {
      const ta = h("textarea", { class: "in big", placeholder: "Paste or write the cover / motivation letter here…" }); ta.value = job.letter || "";
      body.append(ta, h("div", { class: "btn-row" },
        h("button", { class: "btn primary", onclick: () => { job.letter = ta.value.trim(); save(); renderCards(); closeModal(); toast("Saved"); } }, "SAVE"),
        h("button", { class: "btn ghost", onclick: () => {
          const w = window.open("", "_blank"); if (!w) return;
          w.document.write(`<!doctype html><meta charset="utf-8"><title>${esc(job.title)}</title><body style="font:15px/1.6 Georgia,serif;max-width:680px;margin:50px auto;white-space:pre-wrap">${esc(ta.value)}</body>`);
          w.document.close(); w.focus(); w.print();
        } }, "PRINT / PDF")));
    }, true);
  }

  /* ---------- backup ---------- */
  function exportData() {
    const a = h("a", { href: URL.createObjectURL(new Blob([JSON.stringify(db, null, 2)], { type: "application/json" })), download: `pour-lys-${new Date().toISOString().slice(0, 10)}.json` });
    document.body.append(a); a.click(); a.remove();
  }
  function importData() {
    const inp = h("input", { type: "file", accept: "application/json,.json", onchange: async () => {
      try {
        const d = JSON.parse(await inp.files[0].text());
        if (!d || !Array.isArray(d.jobs)) throw 0;
        if (!confirm(`Replace the current list with ${d.jobs.length} saved item(s)?`)) return;
        db = { seq: d.seq || d.jobs.reduce((m, j) => Math.max(m, j.id), 0) + 1, jobs: d.jobs }; save(); render(); toast("Restored");
      } catch (e) { toast("That file is not a Pour Lys backup"); }
    } });
    inp.click();
  }

  /* ---------- STATS ---------- */
  function statsJobs() { return ui.statsSection === "All" ? db.jobs : db.jobs.filter((j) => j.category === ui.statsSection); }
  function renderStats() {
    view.innerHTML = "";
    const jobs = statsJobs();
    const counts = STATUS_COUNTS.map(([label, status]) => [label, status, jobs.filter((j) => j.status === status).length]);
    const total = counts.reduce((s, c) => s + c[2], 0);
    let acc = 0;
    const segs = total ? counts.filter((c) => c[2]).map(([, st, n]) => { const a = (acc / total) * 100; acc += n; return `${STATUS_COLOR[st]} ${a}% ${(acc / total) * 100}%`; }).join(", ") : "rgba(230,215,168,.18) 0 100%";
    const chips = h("div", { class: "chips" }, ["All", ...CATEGORIES].map((s) => h("button", { class: "chip", "aria-pressed": String(ui.statsSection === s), onclick: () => { ui.statsSection = s; renderStats(); } }, s)));
    const legend = h("div", { class: "legend" }, counts.map(([label, status, n]) =>
      h("button", { style: `--c:${STATUS_COLOR[status]}`, onclick: () => statusDialog(label, status) }, h("span", {}, label), h("span", {}, String(n)))));
    view.append(h("section", { class: "panel" },
      h("div", { class: "section-title" }, "STATS"), h("div", { class: "divider" }), chips, h("div", { class: "divider" }),
      h("div", { class: "stats-grid" },
        h("div", { class: "donut", style: `background: conic-gradient(${segs})` }, h("div", { class: "donut-c" }, h("div", {}, String(total), h("small", {}, total === 1 ? "ITEM" : "ITEMS")))),
        legend)));
  }
  function statusDialog(label, status) {
    const jobs = statsJobs().filter((j) => j.status === status);
    modal(label, (body) => {
      if (!jobs.length) { body.append(h("div", { class: "empty-note" }, "Nothing here.")); return; }
      jobs.forEach((j) => body.append(h("button", { class: "job-pick", style: `--c:${STATUS_COLOR[status]}`, onclick: () => jumpTo(j.id) },
        h("div", { style: "font-weight:700" }, j.title), h("div", { style: "font-size:12px;opacity:.75" }, [j.org, j.category].filter(Boolean).join(" · ")))));
    });
  }
  function jumpTo(id) {
    closeModal(); ui.section = "All"; ui.q = ""; setTab("list");
    setTimeout(() => { const el = $("#job-" + id); if (el) { el.scrollIntoView({ block: "center", behavior: "smooth" }); el.classList.add("flash"); setTimeout(() => el.classList.remove("flash"), 2600); } }, 80);
  }

  /* ---------- web search (Google links, no scraping) ---------- */
  const PERIODS = { "Сутки": "qdr:d", "Неделя": "qdr:w", "Месяц": "qdr:m", "Год": "qdr:y", "Любой": "" };
  const sState = { employment: CFG.employment[0].label, period: "Месяц", area: CFG.areas[0].label, sites: [], open: new Set([CFG.groups[0].title]) };
  const seen = () => { try { return JSON.parse(localStorage.getItem(SEEN_KEY) || "{}"); } catch (e) { return {}; } };

  function googleUrl(query, period, clauses, exclude, budget) {
    let full = query.trim(), words = full.split(/\s+/).length;
    clauses.forEach((c) => { c = (c || "").trim(); const n = c ? c.split(/\s+/).length : 0; if (c && words + n <= budget) { full += " " + c; words += n; } });
    exclude.forEach((w) => { if (!full.toLowerCase().includes("-" + w.toLowerCase()) && words + 1 <= budget) { full += " -" + w; words += 1; } });
    const p = PERIODS[period];
    return "https://www.google.com/search?q=" + encodeURIComponent(full) + (p ? "&tbs=" + p : "");
  }

  function searchDialog() {
    modal("Search in Google", (body) => {
      const select = (label, items, cur, key) => h("div", {}, h("label", { class: "f" }, label),
        h("select", { class: "in", onchange: (e) => { sState[key] = e.target.value; drawGroups(); } }, items.map((x) => h("option", { selected: x === cur }, x))));
      const sitesSummary = () => (sState.sites.length ? sState.sites.join(", ") : "Все сайты");
      const sum = h("summary", {}, sitesSummary());
      const siteBox = h("div", { class: "box" }, CFG.sites.map((s) => h("label", {}, h("input", { type: "checkbox", checked: sState.sites.includes(s.label), onchange: (e) => {
        sState.sites = e.target.checked ? [...sState.sites, s.label] : sState.sites.filter((x) => x !== s.label); sum.textContent = sitesSummary(); drawGroups();
      } }), s.label)));
      const groupsEl = h("div");
      body.append(h("div", { class: "sf" },
        select("Формат", CFG.employment.map((e) => e.label), sState.employment, "employment"),
        select("Период", Object.keys(PERIODS), sState.period, "period"),
        select("Район", CFG.areas.map((a) => a.label), sState.area, "area"),
        h("div", {}, h("label", { class: "f" }, "Сайт"), h("details", { class: "multi" }, sum, siteBox))),
        h("div", { class: "divider" }), groupsEl,
        h("p", { class: "hint" }, "Chips open a Google search in a new tab. Chips you opened today turn green."));

      function drawGroups() {
        groupsEl.innerHTML = "";
        const emp = CFG.employment.find((e) => e.label === sState.employment) || {};
        const area = (CFG.areas.find((a) => a.label === sState.area) || {}).clause || "";
        const picked = CFG.sites.filter((s) => sState.sites.includes(s.label)).map((s) => s.clause);
        const siteClause = picked.length === 1 ? picked[0] : picked.length ? "(" + picked.join(" OR ") + ")" : "";
        const today = new Date().toDateString(), sn = seen();
        let groups = CFG.groups;
        if (emp.onlyGroups) groups = groups.filter((g) => emp.onlyGroups.includes(g.title));
        groups.forEach((g) => {
          const chips = g.items.map((it) => {
            const clauses = it.plain ? [] : g.jobs ? [emp.clause || "", siteClause, area] : [siteClause];
            const href = googleUrl(it.query, sState.period, clauses, g.jobs && !it.plain ? CFG.exclude : [], CFG.wordBudget);
            const t = sn[href], fresh = t && new Date(t).toDateString() === today;
            return h("a", { class: "gchip" + (fresh ? " seen" : ""), href, target: "_blank", rel: "noopener noreferrer",
              title: fresh ? "Opened today at " + new Date(t).toTimeString().slice(0, 5) : null,
              onclick: (e) => { const m = seen(); m[e.currentTarget.href] = Date.now(); try { localStorage.setItem(SEEN_KEY, JSON.stringify(m)); } catch (x) {} e.currentTarget.classList.add("seen"); } }, it.label);
          });
          const d = h("details", { class: "grp" }, h("summary", {}, `${g.emoji} ${g.title}`), h("div", { class: "gchips" }, chips));
          if (sState.open.has(g.title)) d.open = true;
          d.addEventListener("toggle", () => (d.open ? sState.open.add(g.title) : sState.open.delete(g.title)));
          groupsEl.append(d);
        });
      }
      drawGroups();
    }, true);
  }

  /* ---------- ambient embers ---------- */
  (function sparkles() {
    const box = $("#sparkles"); if (!box || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (let i = 0; i < 16; i++) {
      const s = h("i", {}, Math.random() > 0.55 ? "♥" : "✦");
      s.style.left = Math.random() * 100 + "%"; s.style.fontSize = 8 + Math.random() * 12 + "px";
      s.style.animationDuration = 14 + Math.random() * 18 + "s"; s.style.animationDelay = -Math.random() * 30 + "s";
      box.append(s);
    }
  })();

  render();
})();
