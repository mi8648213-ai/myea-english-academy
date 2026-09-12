const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const menuBtn = $(".menu-btn"), navLinks = $(".nav-links");
menuBtn?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
$$(".nav-links a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

const grid = $("#lessonGrid"), search = $("#lessonSearch"), level = $("#levelFilter"), skill = $("#skillFilter");

function renderLessons(){
  const q = (search.value || "").toLowerCase().trim();
  const lf = level.value, sf = skill.value;
  const filtered = LESSONS.filter(x =>
    (lf === "all" || x.level === lf) &&
    (sf === "all" || x.skill === sf) &&
    (!q || `${x.title} ${x.level} ${x.skill} ${x.desc}`.toLowerCase().includes(q))
  );
  grid.innerHTML = filtered.length ? filtered.map(x => `
    <article class="lesson-card">
      <span class="pill">${x.level}</span><span class="pill">${x.skill}</span>
      <h3>${x.title}</h3><p>${x.desc}</p>
      <a class="text-link" href="#contact">Open lesson →</a>
    </article>`).join("") : "<p>No lesson found. Try another search.</p>";
}
[search, level, skill].forEach(el => el?.addEventListener(el.tagName === "INPUT" ? "input" : "change", renderLessons));
$$("[data-filter]").forEach(a => a.addEventListener("click", () => {
  setTimeout(() => { level.value = a.dataset.filter; renderLessons(); }, 50);
}));
renderLessons();

$("#registrationForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const msg = $("#formMessage");
  msg.textContent = "Registration request prepared successfully. To receive submissions online, connect this form to your preferred email or backend service.";
  msg.style.color = "#176b3a";
});
