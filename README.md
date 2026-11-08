# pour Lys

A web version of Heaven Knows, for Berlin: PhDs, practice-oriented masters, jobs you can take with an unfinished PhD, cozy jobs (barista, café, cinema, theatre), and scholarships to fund it all. Art, film, writing, photography.

No server, no accounts. The list lives in the browser's `localStorage`; "Download backup" / "Restore from backup" (⇅) moves it between devices.

## What it does

- **FINDS**: cards with status, category, deadline, funding, favorite ♥, interview prep 🎤, letter ✉. Filter by category, search, sort by date added / sent / fit score. "Awaiting response" turns into "No response" after 10 days.
- **Categories** (instead of Quick Wins / Targets / Wild Cards): `PhD`, `Master`, `Academic Job`, `Cozy Job`.
- **PROGRESS**: donut by status per category. No rounds.
- **+ Add**: paste a listing, copy the generated instructions into any chatbot, paste its answer back; fields and prep notes fill themselves. Or fill by hand.
- **Find (globe icon)**: Google searches for Berlin in five groups: PhDs · Masters · Academic Jobs · Cozy Jobs · Scholarships · Residencies. Filters: format, period, district, site. Chips opened today turn green.

Search chips, sites, districts and categories are in `config.js`.

## Run

```bash
python3 -m http.server 8000
```

Open http://localhost:8000. It also works on GitHub Pages as is.
