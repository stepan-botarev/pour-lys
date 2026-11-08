/* Pour Lys — config.
   Everything you may want to tweak without touching app.js lives here.
   Same idea as Heaven Knows' config/google_searches.yaml. */

window.PL_CONFIG = {
  // The four things Pour Lys tracks (replaces Quick Wins / Targets / Wild Cards).
  categories: [
    { id: "PhD",           hint: "PhD in art, film, writing, photography" },
    { id: "Master",        hint: "Practice-oriented master: film, screenwriting, photography, creative writing" },
    { id: "Academic Jobs", hint: "Jobs you can take with an unfinished PhD" },
    { id: "Cozy Jobs",     hint: "Simple, pleasant jobs: barista, café, cinema, theatre" },
  ],

  // Google ignores words past ~32, so parts are added only while they fit.
  wordBudget: 30,
  // -word added to every query of a group with jobs:true.
  exclude: ["Vertrieb", "Promoter", "Telefonakquise", "Vollzeit", "Praktikum"],

  // "Формат": adds a clause and/or limits which groups are shown.
  employment: [
    { label: "Всё" },
    { label: "Только учёба", onlyGroups: ["PhD", "Мастер"] },
    { label: "Werkstudent / Teilzeit", clause: '(Werkstudent OR Teilzeit OR "Working Student")', onlyGroups: ["Работа с неоконченным PhD", "Простая и приятная работа"] },
    { label: "Minijob", clause: "(Minijob OR geringfügig OR Aushilfe)", onlyGroups: ["Работа с неоконченным PhD", "Простая и приятная работа"] },
    { label: "Только стипендии", onlyGroups: ["Стипендии"] },
  ],

  // "Сайт": site: limits the chips (not the ones marked plain) to a board or institution.
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

  // "Район": added to chips of groups with jobs:true.
  areas: [
    { label: "Весь Берлин" },
    { label: "Mitte / Prenzlauer Berg", clause: "(Mitte OR Prenzlauer OR Wedding OR Moabit)" },
    { label: "Kreuzberg / Neukölln",    clause: "(Kreuzberg OR Neukölln OR Tempelhof)" },
    { label: "Friedrichshain / Lichtenberg", clause: "(Friedrichshain OR Lichtenberg OR Karlshorst)" },
    { label: "Charlottenburg / Schöneberg",  clause: "(Charlottenburg OR Wilmersdorf OR Schöneberg)" },
    { label: "Treptow / Köpenick",      clause: "(Treptow OR Köpenick OR Adlershof OR Schöneweide)" },
  ],

  // Each group: a heading with chips; a chip opens a Google search in a new tab.
  // jobs:true  → Формат / Район / exclusions apply.  plain:true (chip) → only the query, no filters.
  groups: [
    {
      title: "PhD", emoji: "🎓", jobs: false,
      items: [
        { label: "Искусство", query: '("Promotion" OR PhD OR Doktorat) ("Bildende Kunst" OR "Künstlerische Forschung" OR "Artistic Research" OR Kunstwissenschaft) Berlin' },
        { label: "Кино и медиа", query: '(PhD OR Promotion OR Doktorand) (Film OR Filmwissenschaft OR Medienwissenschaft OR "Film Studies") Berlin' },
        { label: "Письмо", query: '(PhD OR Promotion OR Doktorand) ("Creative Writing" OR "Literarisches Schreiben" OR Literaturwissenschaft OR Komparatistik) Berlin' },
        { label: "Фотография", query: '(PhD OR Promotion OR Doktorand) (Fotografie OR Photography OR "Visual Culture" OR Bildwissenschaft) Berlin' },
        { label: "Позиции Doktorand", query: '(Doktorand OR "Promotionsstelle" OR "PhD position" OR "Wissenschaftliche Mitarbeit") (Kunst OR Film OR Literatur OR Fotografie) Berlin -Informatik' },
        { label: "Graduiertenkollegs", query: '(Graduiertenkolleg OR "Graduate School" OR Promotionskolleg) (Kunst OR Film OR Kultur OR Medien) Berlin' },
        { label: "Artistic Research", query: '("Artistic Research" OR "Practice-based PhD" OR "künstlerische Promotion") Berlin', },
        { label: "На сайтах вузов", plain: true, query: '(site:udk-berlin.de OR site:hu-berlin.de OR site:fu-berlin.de OR site:kh-berlin.de) (Promotion OR PhD OR Doctoral) (Kunst OR Film OR Medien)' },
      ],
    },
    {
      title: "Мастер", emoji: "🎬", jobs: false,
      items: [
        { label: "Кино / режиссура", query: '(Master OR MFA OR "M.A.") (Film OR Regie OR Filmregie OR "Film Directing") Berlin Bewerbung' },
        { label: "Сценаристика", query: '(Master OR MFA OR Studiengang) (Drehbuch OR Screenwriting OR Dramaturgie OR Stoffentwicklung) Berlin' },
        { label: "Фотография", query: '(Master OR MFA OR "M.A.") (Fotografie OR Photography OR "Fotografie und Medien") Berlin Bewerbung' },
        { label: "Креативное письмо", query: '(Master OR MFA OR Studiengang) ("Creative Writing" OR "Literarisches Schreiben" OR "Kreatives Schreiben") Berlin' },
        { label: "Мастер-классы и курсы", query: '(Masterclass OR Workshop OR Kurs OR Weiterbildung) (Drehbuch OR Fotografie OR "Kreatives Schreiben" OR Filmregie) Berlin' },
        { label: "Фотошколы", query: '(Fotoschule OR Fotografie) (Ausbildung OR Studium OR Lehrgang) Berlin Ostkreuzschule' },
        { label: "Сроки подачи", query: '(Bewerbungsfrist OR "application deadline") (Master OR MFA) (Film OR Fotografie OR Drehbuch OR "Creative Writing") Berlin' },
        { label: "На сайтах вузов", plain: true, query: '(site:udk-berlin.de OR site:kh-berlin.de OR site:dffb.de OR site:ostkreuzschule.de) (Bewerbung OR Application) (Master OR Studium)' },
      ],
    },
    {
      title: "Работа с неоконченным PhD", emoji: "💼", jobs: true,
      items: [
        { label: "Hilfskraft и Mitarbeit", query: '("Wissenschaftliche Hilfskraft" OR "Studentische Hilfskraft" OR "wissenschaftliche Mitarbeit") (Kunst OR Film OR Literatur OR Medien OR Fotografie) Berlin' },
        { label: "Преподавание", query: '(Lehrbeauftragte OR Dozent OR Tutor OR Lehrkraft) (Film OR Fotografie OR "Kreatives Schreiben" OR Drehbuch OR Medien) Berlin' },
        { label: "Архив и коллекции", query: '(Archiv OR Sammlung OR Bibliothek OR Dokumentation) (Film OR Fotografie OR Literatur OR Kunst) (Assistenz OR Mitarbeit) Berlin' },
        { label: "Кураторство", query: '(Kuratorische Assistenz OR Ausstellung OR Galerie OR Museum) (Assistenz OR Mitarbeit OR Projektkoordination) Berlin' },
        { label: "Редактура и тексты", query: '(Redakteur OR Lektor OR Lektorat OR Textredaktion OR Korrektorat) (Kultur OR Literatur OR Film OR Kunst) Berlin' },
        { label: "Кино-индустрия", query: '(Produktionsassistenz OR "Development Assistant" OR "Script Reader" OR Dramaturgieassistenz) (Film OR Serie OR Produktion) Berlin' },
        { label: "Фестивали", query: '(Festival OR Filmfestival) (Assistenz OR Mitarbeit OR Programm OR Koordination) Berlin' },
        { label: "Фото-редакция", query: '(Fotoassistenz OR Bildredaktion OR Bildarchiv OR "Photo Editor" OR Postproduktion) Berlin' },
        { label: "Культурные проекты", query: '(Projektmitarbeit OR Projektassistenz OR Kulturmanagement) (Kunst OR Film OR Literatur) Berlin' },
        { label: "Research assistant", query: '(Forschungsassistenz OR "Research Assistant") (Medien OR Kultur OR Film OR Kunst) Berlin' },
      ],
    },
    {
      title: "Простая и приятная работа", emoji: "☕", jobs: true,
      items: [
        { label: "Бариста", query: '(Barista OR Kaffeebar OR Café) (Aushilfe OR Servicekraft OR Mitarbeiter) Berlin' },
        { label: "Кафе и книжные", query: '(Café OR Buchhandlung OR Bücherladen OR Antiquariat) (Aushilfe OR Verkauf OR Mitarbeit) Berlin -Supermarkt' },
        { label: "Кинотеатр", query: '(Kino OR Programmkino OR Filmtheater) (Aushilfe OR Kasse OR Einlass OR Service) Berlin' },
        { label: "Театр", query: '(Theater OR Oper OR Bühne) (Einlass OR Abenddienst OR Kasse OR Garderobe OR Aushilfe OR Service) Berlin' },
        { label: "Музей и галерея", query: '(Museum OR Ausstellung OR Galerie) (Aufsicht OR Besucherservice OR Kasse OR Aushilfe) Berlin' },
        { label: "Библиотека", query: '(Bibliothek OR Bücherei OR Mediathek) (Aushilfe OR Hilfskraft OR Mitarbeit) Berlin' },
        { label: "Тихий офис", query: '(Bürohilfe OR Datenerfassung OR Assistenz) (Kultur OR Verlag OR Galerie OR Kino) Berlin' },
        { label: "Разовые смены", query: '(Festival OR Event) (Helfer OR Aushilfe OR Einlass OR Betreuung) Berlin Kultur' },
      ],
    },
    {
      title: "Стипендии", emoji: "💶", jobs: false,
      items: [
        { label: "Для PhD", query: '(Promotionsstipendium OR "PhD scholarship" OR Doktorandenstipendium) (Kunst OR Film OR Kultur OR Geisteswissenschaften) Berlin' },
        { label: "NaFöG Berlin", query: 'NaFöG Stipendium "Land Berlin" Nachwuchsförderung Promotion' },
        { label: "DAAD", plain: true, query: 'site:daad.de (Stipendium OR scholarship) (Kunst OR Film OR Fotografie OR Writing OR "Fine Arts")' },
        { label: "Фонды-стипендиаты", query: '(Studienstiftung OR Cusanuswerk OR "Heinrich-Böll-Stiftung" OR "Rosa-Luxemburg-Stiftung" OR "Friedrich-Ebert-Stiftung") Promotionsstipendium Kunst' },
        { label: "Для мастера", query: '(Stipendium OR scholarship) (Masterstudium OR "Master\'s degree") (Film OR Fotografie OR "Creative Writing" OR Kunst) Berlin' },
        { label: "Гранты художникам", query: '(Arbeitsstipendium OR Atelierstipendium OR Künstlerstipendium OR "artist grant") Berlin (Film OR Fotografie OR Literatur OR Kunst)' },
        { label: "Литература", query: '(Literaturstipendium OR Autorenstipendium OR "writing fellowship" OR Debütstipendium) Berlin' },
        { label: "Сценарий и кино", query: '(Drehbuchstipendium OR Stoffentwicklung OR Drehbuchförderung OR "screenwriting grant") Berlin Brandenburg' },
        { label: "Фотография", query: '(Fotostipendium OR "Förderung Fotografie" OR "photography grant") Berlin' },
        { label: "Для иностранцев", query: '(Stipendium OR scholarship) ("international students" OR Ausländische OR Internationale) (Kunst OR Geisteswissenschaften) Berlin' },
        { label: "Stipendienlotse", plain: true, query: 'site:stipendienlotse.de (Film OR Fotografie OR Kunst OR Literatur)' },
        { label: "Medienboard", plain: true, query: 'site:medienboard.de (Förderung OR Stipendium OR Drehbuch)' },
      ],
    },
  ],
};
