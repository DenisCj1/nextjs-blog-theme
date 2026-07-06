/*
 * Builds a print-ready Amazon KDP paperback interior for the Senior Dog Health
 * Tracker. Trim 8.5x11", generous binding margins, page numbers, and the core
 * log pages repeated so the finished book is a usable ~110-page journal.
 */
const fs = require('fs');

const CSS = `
:root{--ink:#2f3a3a;--muted:#6b7d7d;--teal:#3f7d78;--teal-soft:#e7f1ef;--sand:#f7f3ea;--line:#c7d3d1;--accent:#d98b5f;}
*{box-sizing:border-box}html,body{margin:0;padding:0}
body{font-family:Georgia,"Times New Roman",serif;color:var(--ink);-webkit-print-color-adjust:exact;print-color-adjust:exact}
@page{size:8.5in 11in;margin:0}
.page{width:8.5in;height:11in;padding:0.75in 0.7in 0.7in 0.9in;page-break-after:always;position:relative;overflow:hidden;background:#fff}
.page:last-child{page-break-after:auto}
.sans{font-family:"Helvetica Neue",Arial,sans-serif}
.head{display:flex;align-items:baseline;justify-content:space-between;border-bottom:2px solid var(--teal);padding-bottom:8px;margin-bottom:18px}
.head h2{font-size:22px;margin:0;color:var(--teal)}
.head .paw{font-size:16px;color:var(--accent)}
.pno{position:absolute;bottom:0.4in;left:0;right:0;text-align:center;font-family:"Helvetica Neue",Arial,sans-serif;font-size:9px;color:var(--muted)}
table{width:100%;border-collapse:collapse}
th,td{border:1px solid var(--line);padding:8px;font-family:"Helvetica Neue",Arial,sans-serif;font-size:11px;text-align:left;vertical-align:top}
th{background:var(--teal-soft);color:var(--teal);font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:.5px}
tbody tr:nth-child(even) td{background:#fbfaf6}
.tall td{height:30px}.taller td{height:40px}
.field{font-family:"Helvetica Neue",Arial,sans-serif;font-size:11px;margin:0 0 14px}
.field .lbl{display:inline-block;min-width:130px;color:var(--muted);font-weight:600}
.line{border-bottom:1px solid var(--line);display:inline-block;min-width:200px}
.two-col{display:flex;gap:22px}.two-col>div{flex:1}
.note-lines div{border-bottom:1px solid var(--line);height:26px}
.box{background:var(--sand);border:1px solid var(--line);border-radius:8px;padding:14px 16px;font-family:"Helvetica Neue",Arial,sans-serif;font-size:11px;line-height:1.55}
.box h3{margin:0 0 8px;color:var(--teal);font-size:13px}
ul.tips{margin:0;padding-left:18px}ul.tips li{margin-bottom:6px}
.weekgrid td{height:58px}
.plot{border:1px solid var(--line);background:repeating-linear-gradient(to right,transparent 0,transparent .49in,#eef3f2 .49in,#eef3f2 .5in),repeating-linear-gradient(to bottom,transparent 0,transparent .29in,#eef3f2 .29in,#eef3f2 .3in);height:3.2in;border-radius:4px}
.title{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;height:100%}
.title h1{font-size:40px;color:var(--teal);margin:0 0 14px;line-height:1.12}
.title .rule{width:70px;height:3px;background:var(--accent);margin:6px auto 22px;border-radius:2px}
.title .sub{font-family:"Helvetica Neue",Arial,sans-serif;font-size:13px;letter-spacing:3px;text-transform:uppercase;color:var(--muted)}
`;

const head = (t) => `<div class="head"><h2>${t}</h2><span class="paw">🐾</span></div>`;
const notelines = (n) => `<div class="note-lines">${'<div></div>'.repeat(n)}</div>`;

// --- page templates ---
const P = {};
P.title = () => `<section class="page"><div class="title">
  <div style="font-size:34px;margin-bottom:18px">🐾</div>
  <h1>Senior Dog<br/>Health Tracker</h1><div class="rule"></div>
  <div class="sub">Daily Care · Weight · Meds · Vet Visits</div>
  <div style="margin-top:70px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;letter-spacing:1px;color:var(--muted)">THIS JOURNAL IS FOR</div>
  <div style="border-bottom:1.5px solid var(--line);width:240px;margin-top:12px"></div>
</div></section>`;

P.howto = () => `<section class="page">${head('How to Use This Tracker')}
  <p class="field" style="line-height:1.6">Caring for an older dog means noticing small changes before they become big problems. This journal keeps your dog's daily wellbeing, weight, medications, meals, symptoms, and vet visits in one place — so nothing slips, and your vet gets a clear picture at every visit.</p>
  <div class="box" style="margin-bottom:16px"><h3>What's inside</h3><ul class="tips">
   <li><b>Dog Profile &amp; Emergency Contacts</b></li><li><b>Medication &amp; Supplement Schedule</b></li>
   <li><b>Weekly &amp; Daily Health Logs</b></li><li><b>Weight &amp; Body Condition Tracker</b></li>
   <li><b>Vet Visit Records &amp; Symptom Diary</b></li><li><b>Feeding &amp; Diet Log</b></li></ul></div>
  <div class="box"><h3>Tips</h3><ul class="tips"><li>Keep it visible — by the bowl or the door.</li>
   <li>Bring it to every vet visit; the trends are gold.</li><li>Photograph filled pages as a backup.</li></ul></div>
</section>`;

P.profile = () => `<section class="page">${head('Dog Profile')}
 <div class="two-col"><div>
  ${['Name','Breed','Date of birth / age','Sex & neutered?','Colour / markings','Microchip no.'].map(l=>`<p class="field"><span class="lbl">${l}</span><span class="line"></span></p>`).join('')}
 </div><div>
  ${['Current weight','Ideal weight','Insurance / policy no.','Allergies','Chronic conditions','Daily medications'].map(l=>`<p class="field"><span class="lbl">${l}</span><span class="line"></span></p>`).join('')}
 </div></div>
 <h3 class="sans" style="color:var(--teal);margin:14px 0 8px;font-size:13px">Known conditions &amp; history</h3>${notelines(5)}</section>`;

P.contacts = () => `<section class="page">${head('Vet & Emergency Contacts')}
 <table><tr><th style="width:38%">Contact</th><th>Name</th><th>Phone</th></tr>
 ${['Primary vet clinic','Emergency / out-of-hours vet','Poison control','Preferred pharmacy','Pet sitter / walker','Backup caregiver','Insurance helpline'].map(c=>`<tr class="taller"><td>${c}</td><td></td><td></td></tr>`).join('')}</table>
 <div class="box" style="margin-top:20px"><h3>Emergency warning signs — call the vet now</h3>
 <ul class="tips" style="columns:2;column-gap:26px"><li>Difficulty breathing</li><li>Collapse or fainting</li><li>Repeated vomiting / diarrhoea</li><li>Bloated, hard abdomen</li><li>Seizures</li><li>Won't eat or drink 24h+</li><li>Pale or blue gums</li><li>Sudden inability to stand</li></ul></div></section>`;

P.medMaster = () => `<section class="page">${head('Medication & Supplement Schedule')}
 <table><tr><th>Medication / supplement</th><th style="width:14%">Dose</th><th style="width:16%">Time(s)</th><th style="width:16%">With food?</th><th style="width:16%">Refill by</th></tr>
 ${'<tr class="taller"><td></td><td></td><td></td><td></td><td></td></tr>'.repeat(8)}</table></section>`;

P.weekly = () => `<section class="page">${head('Weekly Health Log')}
 <p class="field" style="margin-bottom:12px"><span class="lbl">Week of</span><span class="line"></span></p>
 <table class="weekgrid"><tr><th style="width:13%">Day</th><th>Appetite</th><th>Water</th><th>Energy</th><th>Mobility</th><th>Toilet</th><th>Mood / notes</th></tr>
 ${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>`<tr><td><b>${d}</b></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`).join('')}</table>
 <p class="field sans" style="margin-top:14px;font-size:10px;color:var(--muted)">Rate each 1–5 (or ✓ / ✗). Watch for changes from your dog's normal.</p></section>`;

P.daily = () => `<section class="page">${head('Daily Health Log')}
 <div class="two-col" style="margin-bottom:6px"><p class="field"><span class="lbl">Date</span><span class="line"></span></p><p class="field"><span class="lbl">Overall day</span> ☐ Great ☐ Okay ☐ Off</p></div>
 <table><tr><th style="width:32%">Check</th><th>Morning</th><th>Afternoon</th><th>Evening</th></tr>
 ${['Ate well','Drank water','Medication given','Toilet (pee / poo)','Walk / exercise','Energy level (1–5)','Mobility / stiffness'].map(r=>`<tr class="tall"><td>${r}</td><td></td><td></td><td></td></tr>`).join('')}</table>
 <h3 class="sans" style="color:var(--teal);margin:16px 0 8px;font-size:13px">Anything unusual today?</h3>${notelines(4)}</section>`;

P.weight = () => `<section class="page">${head('Weight & Body Condition')}
 <table style="margin-bottom:18px"><tr><th>Date</th><th>Weight</th><th>Body condition (1–9)</th><th>Notes</th></tr>
 ${'<tr class="tall"><td></td><td></td><td></td><td></td></tr>'.repeat(7)}</table>
 <h3 class="sans" style="color:var(--teal);margin:0 0 8px;font-size:13px">Plot the trend</h3><div class="plot"></div></section>`;

P.vet = () => `<section class="page">${head('Vet Visit Record')}
 <div class="two-col"><p class="field"><span class="lbl">Date</span><span class="line"></span></p><p class="field"><span class="lbl">Reason for visit</span><span class="line"></span></p></div>
 <div class="two-col"><p class="field"><span class="lbl">Weight today</span><span class="line"></span></p><p class="field"><span class="lbl">Temperature</span><span class="line"></span></p></div>
 <h3 class="sans" style="color:var(--teal);margin:8px 0 6px;font-size:13px">Questions I want to ask</h3>${notelines(3)}
 <h3 class="sans" style="color:var(--teal);margin:14px 0 6px;font-size:13px">Diagnosis &amp; vet's notes</h3>${notelines(3)}
 <h3 class="sans" style="color:var(--teal);margin:14px 0 6px;font-size:13px">Treatment / meds prescribed</h3>${notelines(2)}
 <div class="two-col" style="margin-top:14px"><p class="field"><span class="lbl">Next visit</span><span class="line"></span></p><p class="field"><span class="lbl">Cost</span><span class="line"></span></p></div></section>`;

P.symptom = () => `<section class="page">${head('Symptom Diary')}
 <table><tr><th style="width:16%">Date</th><th style="width:26%">Symptom</th><th style="width:14%">Severity</th><th>What helped / notes</th></tr>
 ${'<tr class="taller"><td></td><td></td><td></td><td></td></tr>'.repeat(8)}</table>
 <p class="field sans" style="margin-top:12px;font-size:10px;color:var(--muted)">Severity 1–5. Patterns over time help your vet diagnose faster.</p></section>`;

P.feeding = () => `<section class="page">${head('Feeding & Diet Log')}
 <div class="two-col" style="margin-bottom:6px"><p class="field"><span class="lbl">Current food</span><span class="line"></span></p><p class="field"><span class="lbl">Daily amount</span><span class="line"></span></p></div>
 <table><tr><th style="width:16%">Date</th><th>Breakfast</th><th>Dinner</th><th>Treats / extras</th><th style="width:18%">Appetite</th></tr>
 ${'<tr class="taller"><td></td><td></td><td></td><td></td><td></td></tr>'.repeat(7)}</table></section>`;

// --- assemble the book ---
const pages = [];
pages.push(P.title(), P.howto(), P.profile(), P.contacts(), P.medMaster());
// repeated log section — enough to cover many months
for (let i = 0; i < 26; i++) pages.push(P.weekly());        // ~6 months of weeks
for (let i = 0; i < 20; i++) pages.push(P.daily());
for (let i = 0; i < 8; i++) pages.push(P.weight());
for (let i = 0; i < 14; i++) pages.push(P.vet());
for (let i = 0; i < 16; i++) pages.push(P.symptom());
for (let i = 0; i < 16; i++) pages.push(P.feeding());

// inject page numbers (skip the title page)
const numbered = pages.map((html, idx) => {
  if (idx === 0) return html;
  return html.replace('</section>', `<div class="pno">${idx + 1}</div></section>`);
});

const doc = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Senior Dog Health Tracker — KDP Interior</title><style>${CSS}</style></head><body>${numbered.join('\n')}</body></html>`;
fs.writeFileSync(__dirname + '/kdp-interior.html', doc);
console.log('Wrote kdp-interior.html with', pages.length, 'pages');
