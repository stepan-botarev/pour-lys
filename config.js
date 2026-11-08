/* Pour Lys — config.
   Everything you may want to tweak without touching app.js lives here.
   Same idea as Heaven Knows' config/google_searches.yaml. */

window.PL_CONFIG = {
  // The five things Pour Lys tracks (replaces Quick Wins / Targets / Wild Cards).
  categories: [
    { id: "PhD",           hint: "PhD in art, film, writing, photography" },
    { id: "Master",        hint: "Practice-oriented master: film, screenwriting, photography, creative writing" },
    { id: "Academic Jobs", hint: "Jobs you can take with an unfinished PhD" },
    { id: "Cozy Jobs",     hint: "Cozy Jobs: barista, café, cinema, theatre" },
    { id: "Residency",     hint: "Artist, writer, film and photography residencies in Berlin" },
  ],

  // Starter entries, added once to every browser (checked 8 Nov 2026 on the official pages linked).
  defaults: [
    {
      title: "PhD in literary studies (structured programme, start Oct 2027)",
      org: "Friedrich Schlegel Graduate School of Literary Studies, Freie Universität Berlin",
      url: "https://www.geisteswissenschaften.fu-berlin.de/en/friedrichschlegel/foerderung",
      location: "Dahlem, Berlin",
      funding: "Up to 5 nine-month scholarships of €1,103/month for admitted applicants without funding; otherwise external funding",
      category: "PhD", deadline: "2026-11-15", score: 72, favorite: true,
      notes: "Deadline 15 Nov 2026, 23:59 CET. Full-time, 3–4 years, German and English. Needs a Master's, research exposé, references, language certificate. Literature in a cultural-historical or intermedial frame: autofiction, fiction and images could make a literary-studies thesis. Check first: does Lys's Master's count (literature, comparative literature, philosophy)?",
    },
    {
      title: "Graduate School fellowship for artists (24 months)",
      org: "Berlin University of the Arts (UdK Berlin)",
      url: "https://www.udk-berlin.de/en/research/graduate-school/application/faq/",
      location: "Berlin",
      funding: "€1,365/month + €103 materials, plus up to ~€4,000 project money per year",
      category: "Residency", deadline: "", score: 82,
      notes: "Not a PhD: a funded two-year fellowship for an artistic project; English working language, no age limit. Needs a Master's (or outstanding artistic aptitude), 3+ years of professional artistic practice and a project doable in two years. No call open right now: watch for the next one.",
    },
    {
      title: "MA Spatial Strategies",
      org: "weißensee kunsthochschule berlin",
      url: "https://kh-berlin.de/en/studies/applying-for-studies/ma-spatial-stategies",
      location: "Weißensee, Berlin",
      funding: "Fee-based: €1,250 per semester + about €377 semester fee",
      category: "Master", deadline: "", score: 85,
      notes: "Two years, art about how spaces are lived in and made vulnerable: close to rented flats, temporary systems and rooms in transit. Needs portfolio, 3–4-page exposé with a project, 1 year of work experience after the first degree, language B1/B2 (C1 for admission). One round a year for the winter semester; in 2026 it ran 1 Mar–31 May, so expect spring 2027 (check the dates).",
    },
    {
      title: "MA Photography",
      org: "SRH University Berlin",
      url: "https://www.srh-university.de/en/master/photography/v/",
      location: "Berlin",
      funding: "Private: €5,950 per semester (non-EU) or €830/month (EU), + one-off enrolment fee",
      category: "Master", deadline: "", score: 66,
      notes: "Taught in English, 3–4 semesters, starts 1 April or 1 October 2027. Personal photographic practice, history of photography, photography and space. Rolling applications: Bachelor's, motivation letter, CV, English. Expensive, so worth it only with a scholarship.",
    },
  ],

  // Google ignores words past ~32, so parts are added only while they fit.
  wordBudget: 30,
  // -word added to every query of a group with jobs:true.
  exclude: ["Vertrieb", "Promoter", "Telefonakquise", "Vollzeit", "Praktikum"],

  // "Format": adds a clause and/or limits which groups are shown.
  employment: [
    { label: "All" },
    { label: "Study only", onlyGroups: ["PhD", "Master"] },
    { label: "Werkstudent / Teilzeit", clause: '(Werkstudent OR Teilzeit OR "Working Student")', onlyGroups: ["Academic Jobs", "Cozy Jobs"] },
    { label: "Minijob", clause: "(Minijob OR geringfügig OR Aushilfe)", onlyGroups: ["Academic Jobs", "Cozy Jobs"] },
    { label: "Scholarships only", onlyGroups: ["Scholarships"] },
    { label: "Residencies only", onlyGroups: ["Residencies"] },
  ],

  // "Site": site: limits the chips (not the ones marked plain) to a board or institution.
  sites: [
    { label: "Berlin.de",      clause: "site:karriereportal-stellen.berlin.de" },
    { label: "StepStone",      clause: "site:stepstone.de" },
    { label: "Indeed",         clause: "site:de.indeed.com" },
    { label: "LinkedIn",       clause: "site:linkedin.com/jobs" },
    { label: "XING",           clause: "site:xing.com/jobs" },
    { label: "Arbeitsagentur", clause: "site:arbeitsagentur.de" },
    { label: "academics.de",   clause: "site:academics.de" },
    { label: "Kulturmanagement.net", clause: "site:kulturmanagement.net" },
    { label: "Kultweet",       clause: "site:kultweet.de" },
    { label: "DAAD",           clause: "site:daad.de" },
    { label: "Stipendienlotse", clause: "site:stipendienlotse.de" },
    { label: "UdK",            clause: "site:udk-berlin.de" },
    { label: "HU Berlin",      clause: "site:hu-berlin.de" },
    { label: "FU Berlin",      clause: "site:fu-berlin.de" },
    { label: "Weißensee",      clause: "site:kh-berlin.de" },
    { label: "dffb",           clause: "site:dffb.de" },
  ],

  // "District": added to chips of groups with jobs:true.
  areas: [
    { label: "All Berlin" },
    { label: "Mitte / Prenzlauer Berg", clause: "(Mitte OR Prenzlauer OR Wedding OR Moabit)" },
    { label: "Kreuzberg / Neukölln",    clause: "(Kreuzberg OR Neukölln OR Tempelhof)" },
    { label: "Friedrichshain / Lichtenberg", clause: "(Friedrichshain OR Lichtenberg OR Karlshorst)" },
    { label: "Charlottenburg / Schöneberg",  clause: "(Charlottenburg OR Wilmersdorf OR Schöneberg)" },
    { label: "Treptow / Köpenick",      clause: "(Treptow OR Köpenick OR Adlershof OR Schöneweide)" },
  ],

  // Each group: a heading with chips; a chip opens a Google search in a new tab.
  // jobs:true  → Format / District / exclusions apply.  plain:true (chip) → only the query, no filters.
  groups: [
    {
      title: "PhD", emoji: "🎓", jobs: false,
      items: [
        { label: "Art", query: '("Promotion" OR PhD OR Doktorat) ("Bildende Kunst" OR "Künstlerische Forschung" OR "Artistic Research" OR Kunstwissenschaft) Berlin' },
        { label: "Film and media", query: '(PhD OR Promotion OR Doktorand) (Film OR Filmwissenschaft OR Medienwissenschaft OR "Film Studies") Berlin' },
        { label: "Writing", query: '(PhD OR Promotion OR Doktorand) ("Creative Writing" OR "Literarisches Schreiben" OR Literaturwissenschaft OR Komparatistik) Berlin' },
        { label: "Photography", query: '(PhD OR Promotion OR Doktorand) (Fotografie OR Photography OR "Visual Culture" OR Bildwissenschaft) Berlin' },
        { label: "Doktorand positions", query: '(Doktorand OR "Promotionsstelle" OR "PhD position" OR "Wissenschaftliche Mitarbeit") (Kunst OR Film OR Literatur OR Fotografie) Berlin -Informatik' },
        { label: "Structured PhD programmes", query: '(Graduiertenkolleg OR "Graduate School" OR Promotionskolleg) (Kunst OR Film OR Kultur OR Medien) Berlin' },
        { label: "Artistic Research", query: '("Artistic Research" OR "Practice-based PhD" OR "künstlerische Promotion") Berlin', },
        { label: "On university sites", plain: true, query: '(site:udk-berlin.de OR site:hu-berlin.de OR site:fu-berlin.de OR site:kh-berlin.de) (Promotion OR PhD OR Doctoral) (Kunst OR Film OR Medien)' },
      ],
    },
    {
      title: "Master", emoji: "🎬", jobs: false,
      items: [
        { label: "Film / directing", query: '(Master OR MFA OR "M.A.") (Film OR Regie OR Filmregie OR "Film Directing") Berlin Bewerbung' },
        { label: "Screenwriting", query: '(Master OR MFA OR Studiengang) (Drehbuch OR Screenwriting OR Dramaturgie OR Stoffentwicklung) Berlin' },
        { label: "Photography", query: '(Master OR MFA OR "M.A.") (Fotografie OR Photography OR "Fotografie und Medien") Berlin Bewerbung' },
        { label: "Creative writing", query: '(Master OR MFA OR Studiengang) ("Creative Writing" OR "Literarisches Schreiben" OR "Kreatives Schreiben") Berlin' },
        { label: "Masterclasses and courses", query: '(Masterclass OR Workshop OR Kurs OR Weiterbildung) (Drehbuch OR Fotografie OR "Kreatives Schreiben" OR Filmregie) Berlin' },
        { label: "Photo schools", query: '(Fotoschule OR Fotografie) (Ausbildung OR Studium OR Lehrgang) Berlin Ostkreuzschule' },
        { label: "Application deadlines", query: '(Bewerbungsfrist OR "application deadline") (Master OR MFA) (Film OR Fotografie OR Drehbuch OR "Creative Writing") Berlin' },
        { label: "On university sites", plain: true, query: '(site:udk-berlin.de OR site:kh-berlin.de OR site:dffb.de OR site:ostkreuzschule.de) (Bewerbung OR Application) (Master OR Studium)' },
      ],
    },
    {
      title: "Academic Jobs", emoji: "💼", jobs: true,
      items: [
        { label: "Hilfskraft and Mitarbeit", query: '("Wissenschaftliche Hilfskraft" OR "Studentische Hilfskraft" OR "wissenschaftliche Mitarbeit") (Kunst OR Film OR Literatur OR Medien OR Fotografie) Berlin' },
        { label: "Teaching", query: '(Lehrbeauftragte OR Dozent OR Tutor OR Lehrkraft) (Film OR Fotografie OR "Kreatives Schreiben" OR Drehbuch OR Medien) Berlin' },
        { label: "Archives and collections", query: '(Archiv OR Sammlung OR Bibliothek OR Dokumentation) (Film OR Fotografie OR Literatur OR Kunst) (Assistenz OR Mitarbeit) Berlin' },
        { label: "Curating", query: '(Kuratorische Assistenz OR Ausstellung OR Galerie OR Museum) (Assistenz OR Mitarbeit OR Projektkoordination) Berlin' },
        { label: "Editing and texts", query: '(Redakteur OR Lektor OR Lektorat OR Textredaktion OR Korrektorat) (Kultur OR Literatur OR Film OR Kunst) Berlin' },
        { label: "Film industry", query: '(Produktionsassistenz OR "Development Assistant" OR "Script Reader" OR Dramaturgieassistenz) (Film OR Serie OR Produktion) Berlin' },
        { label: "Festivals", query: '(Festival OR Filmfestival) (Assistenz OR Mitarbeit OR Programm OR Koordination) Berlin' },
        { label: "Photo editing", query: '(Fotoassistenz OR Bildredaktion OR Bildarchiv OR "Photo Editor" OR Postproduktion) Berlin' },
        { label: "Cultural projects", query: '(Projektmitarbeit OR Projektassistenz OR Kulturmanagement) (Kunst OR Film OR Literatur) Berlin' },
        { label: "Research assistant", query: '(Forschungsassistenz OR "Research Assistant") (Medien OR Kultur OR Film OR Kunst) Berlin' },
      ],
    },
    {
      title: "Cozy Jobs", emoji: "☕", jobs: true,
      items: [
        { label: "Barista", query: '(Barista OR Kaffeebar OR Café) (Aushilfe OR Servicekraft OR Mitarbeiter) Berlin' },
        { label: "Cafés and bookshops", query: '(Café OR Buchhandlung OR Bücherladen OR Antiquariat) (Aushilfe OR Verkauf OR Mitarbeit) Berlin -Supermarkt' },
        { label: "Cinema", query: '(Kino OR Programmkino OR Filmtheater) (Aushilfe OR Kasse OR Einlass OR Service) Berlin' },
        { label: "Theatre", query: '(Theater OR Oper OR Bühne) (Einlass OR Abenddienst OR Kasse OR Garderobe OR Aushilfe OR Service) Berlin' },
        { label: "Museums and galleries", query: '(Museum OR Ausstellung OR Galerie) (Aufsicht OR Besucherservice OR Kasse OR Aushilfe) Berlin' },
        { label: "Library", query: '(Bibliothek OR Bücherei OR Mediathek) (Aushilfe OR Hilfskraft OR Mitarbeit) Berlin' },
        { label: "One-off shifts", query: '(Festival OR Event) (Helfer OR Aushilfe OR Einlass OR Betreuung) Berlin Kultur' },
        { label: "Freelance photography", query: '(Fotograf OR Fotografin OR Photographer) (freiberuflich OR Freelance OR Auftrag OR Honorar) Berlin' },
        { label: "Event photography", query: '(Eventfotograf OR "Event Photographer" OR Veranstaltungsfotografie OR Hochzeitsfotograf) (freiberuflich OR Freelance OR Aushilfe) Berlin' },
        { label: "Photo assistant", query: '(Fotoassistenz OR "Photo Assistant" OR Fotografenassistent OR Studioassistenz) (Berlin) (freiberuflich OR Freelance OR Aushilfe OR Teilzeit)' },
        { label: "Product and food shoots", query: '(Produktfotograf OR Produktfotografie OR Foodfotograf OR "Product Photographer") (freiberuflich OR Freelance OR Auftrag) Berlin' },
        { label: "Photo editing remote", query: '(Bildbearbeitung OR Retusche OR "Photo Retoucher" OR Bildbearbeiter) (freiberuflich OR Freelance OR Remote) Berlin' },
      ],
    },
    {
      title: "Scholarships", emoji: "💸", jobs: false,
      items: [
        { label: "For a PhD", query: '(Promotionsstipendium OR "PhD scholarship" OR Doktorandenstipendium) (Kunst OR Film OR Kultur OR Geisteswissenschaften) Berlin' },
        { label: "NaFöG Berlin", query: 'NaFöG Stipendium "Land Berlin" Nachwuchsförderung Promotion' },
        { label: "DAAD", plain: true, query: 'site:daad.de (Stipendium OR scholarship) (Kunst OR Film OR Fotografie OR Writing OR "Fine Arts")' },
        { label: "Foundations", query: '(Studienstiftung OR Cusanuswerk OR "Heinrich-Böll-Stiftung" OR "Rosa-Luxemburg-Stiftung" OR "Friedrich-Ebert-Stiftung") Promotionsstipendium Kunst' },
        { label: "For a master", query: '(Stipendium OR scholarship) (Masterstudium OR "Master\'s degree") (Film OR Fotografie OR "Creative Writing" OR Kunst) Berlin' },
        { label: "Artist grants", query: '(Arbeitsstipendium OR Atelierstipendium OR Künstlerstipendium OR "artist grant") Berlin (Film OR Fotografie OR Literatur OR Kunst)' },
        { label: "Literature", query: '(Literaturstipendium OR Autorenstipendium OR "writing fellowship" OR Debütstipendium) Berlin' },
        { label: "Screenplay and film", query: '(Drehbuchstipendium OR Stoffentwicklung OR Drehbuchförderung OR "screenwriting grant") Berlin Brandenburg' },
        { label: "Photography", query: '(Fotostipendium OR "Förderung Fotografie" OR "photography grant") Berlin' },
        { label: "For international students", query: '(Stipendium OR scholarship) ("international students" OR Ausländische OR Internationale) (Kunst OR Geisteswissenschaften) Berlin' },
        { label: "Stipendienlotse", plain: true, query: 'site:stipendienlotse.de (Film OR Fotografie OR Kunst OR Literatur)' },
        { label: "Medienboard", plain: true, query: 'site:medienboard.de (Förderung OR Stipendium OR Drehbuch)' },
      ],
    },
    {
      title: "Residencies", emoji: "🏡", jobs: false,
      items: [
        { label: "Art", query: '(Residency OR Residenz OR "Artist in Residence" OR Atelierstipendium) (Bildende Kunst OR "visual art" OR Kunst) Berlin "open call"' },
        { label: "Film", query: '(Residency OR Residenz OR "Artist in Residence") (Film OR Regie OR Drehbuch OR Filmemacher) Berlin "open call"' },
        { label: "Writing", query: '(Residency OR Aufenthaltsstipendium OR "Writer in Residence" OR Schreibresidenz) (Literatur OR "Creative Writing" OR Autoren) Berlin' },
        { label: "Photography", query: '(Residency OR Residenz OR "Artist in Residence") (Fotografie OR Photography) Berlin "open call"' },
        { label: "Open calls", query: '("open call" OR Ausschreibung OR Bewerbung) (Residency OR Residenz OR Aufenthaltsstipendium) Berlin (Kunst OR Film OR Literatur OR Fotografie)' },
        { label: "Funded", query: '(Residency OR Residenz) (Stipendium OR funded OR "with stipend" OR Honorar OR Unterkunft) Berlin (Kunst OR Film OR Literatur)' },
        { label: "Künstlerhaus Bethanien", plain: true, query: 'site:bethanien.de (Residency OR Stipendium OR "open call")' },
        { label: "Akademie der Künste", plain: true, query: 'site:adk.de (Stipendium OR Residency OR Ausschreibung)' },
        { label: "LCB", plain: true, query: 'site:lcb.de (Stipendium OR Residenz OR Ausschreibung OR Aufenthalt)' },
        { label: "Berlin Senate programs", plain: true, query: 'site:berlin.de (Arbeitsstipendium OR Atelierprogramm OR Residency OR Ausschreibung) Kultur' },
        { label: "Residency directories", plain: true, query: '(site:transartists.org OR site:resartis.org OR site:artconnect.com) Berlin residency "open call"' },
      ],
    },
  ],
};
