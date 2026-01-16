/* ===============================
   WEDDING PLANNER – FINAL BUILD
   Senior-level, offline, stable
================================ */

const DEFAULT_STATE = {
  meta: {
    couple: "",
    date: "",
    venue: "",
    ceremonyTime: "",
    receptionTime: "",
    theme: "",
    notes: ""
  },
  budget: [],
  vendors: [],
  guests: [],
  seating: [],
  timeline: [],
  dayOf: [],
  decor: [],
  attire: [],
  transport: [],
  gifts: [],
  legal: [],
  emergency: [],
  notes: ""
};

let state = loadState();

/* ---------- UTIL ---------- */
function $(id) {
  return document.getElementById(id);
}

function saveState() {
  localStorage.setItem("weddingPlanner", JSON.stringify(state));
  render();
}

function loadState() {
  const saved = localStorage.getItem("weddingPlanner");
  return saved ? JSON.parse(saved) : structuredClone(DEFAULT_STATE);
}

function currency(v) {
  return "R" + Number(v || 0).toLocaleString();
}

/* ---------- NAV ---------- */
const SECTIONS = [
  "Overview","Wedding","Budget","Vendors","Guests","Seating",
  "Timeline","Day Of","Decor","Attire","Transport",
  "Gifts","Legal","Emergency","Notes"
];

const nav = $("nav");
SECTIONS.forEach(name => {
  const btn = document.createElement("button");
  btn.textContent = name;
  btn.onclick = () => openSection(name);
  nav.appendChild(btn);
});

function openSection(name) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById(name).classList.add("active");
  document.querySelectorAll("nav button").forEach(b =>
    b.classList.toggle("active", b.textContent === name)
  );
}

/* ---------- RENDER ---------- */
function render() {
  const app = $("app");
  app.innerHTML = `
    ${overview()}
    ${weddingDetails()}
    ${tableSection("Budget","budget",["Category","Estimated","Actual","Deposit","Paid","Notes"])}
    ${tableSection("Vendors","vendors",["Type","Name","Cost","Paid","Notes"])}
    ${tableSection("Guests","guests",["Name","RSVP","Meal","Dietary","Plus One","Notes"])}
    ${tableSection("Seating","seating",["Table","Capacity","Guests","Notes"])}
    ${tableSection("Timeline","timeline",["Task","Due","Priority","Status","Notes"])}
    ${tableSection("Day Of","dayOf",["Time","Event","Responsible","Location","Notes"])}
    ${tableSection("Decor","decor",["Item","Colour","Vendor","Cost","Notes"])}
    ${tableSection("Attire","attire",["Item","Fitting Date","Status","Notes"])}
    ${tableSection("Transport","transport",["Who","From","To","Time","Notes"])}
    ${tableSection("Gifts","gifts",["From","Gift","Thank You Sent","Notes"])}
    ${tableSection("Legal","legal",["Item","Required","Completed","Notes"])}
    ${tableSection("Emergency","emergency",["Type","Contact","Details"])}
    ${notesSection()}
  `;
}

/* ---------- COMPONENTS ---------- */
function overview() {
  const spent = state.budget.reduce((a,b)=>a+Number(b[2]||0),0);
  const guestsYes = state.guests.filter(g=>g[1]==="Yes").length;
  return `
  <section id="Overview" class="section active">
    <div class="grid">
      <div class="card">
        <small>Wedding Date</small>
        <input type="date" value="${state.meta.date}"
          onchange="state.meta.date=this.value;saveState()">
      </div>
      <div class="card">
        <small>Total Spent</small>
        <strong>${currency(spent)}</strong>
      </div>
      <div class="card">
        <small>Guests Attending</small>
        <strong>${guestsYes}</strong>
      </div>
    </div>
  </section>`;
}

function weddingDetails() {
  return `
  <section id="Wedding" class="section">
    <div class="card">
      <div class="grid">
        <div><small>Couple</small><input value="${state.meta.couple}" onchange="state.meta.couple=this.value;saveState()"></div>
        <div><small>Venue</small><input value="${state.meta.venue}" onchange="state.meta.venue=this.value;saveState()"></div>
        <div><small>Ceremony Time</small><input type="time" value="${state.meta.ceremonyTime}" onchange="state.meta.ceremonyTime=this.value;saveState()"></div>
        <div><small>Reception Time</small><input type="time" value="${state.meta.receptionTime}" onchange="state.meta.receptionTime=this.value;saveState()"></div>
        <div><small>Theme</small><input value="${state.meta.theme}" onchange="state.meta.theme=this.value;saveState()"></div>
      </div>
      <small>Notes</small>
      <textarea onchange="state.meta.notes=this.value;saveState()">${state.meta.notes}</textarea>
    </div>
  </section>`;
}

function tableSection(id,key,cols) {
  state[key] ||= [];
  return `
  <section id="${id}" class="section">
    <div class="card">
      <table>
        <thead>
          <tr>${cols.map(c=>`<th>${c}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${state[key].map((row,i)=>`
            <tr>
              ${cols.map((_,c)=>`
                <td>
                  <input value="${row[c]||""}"
                    onchange="state.${key}[${i}][${c}]=this.value;saveState()">
                </td>`).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
      <button class="add" onclick="state.${key}.push([]);saveState()">Add</button>
    </div>
  </section>`;
}

function notesSection() {
  return `
  <section id="Notes" class="section">
    <div class="card">
      <textarea placeholder="Anything at all…"
        onchange="state.notes=this.value;saveState()">${state.notes}</textarea>
    </div>
  </section>`;
}

/* ---------- INIT ---------- */
render();
openSection("Overview");
