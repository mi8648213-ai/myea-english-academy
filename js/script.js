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

const WHATSAPP_NUMBER = "2348062626632"; // MYEA WhatsApp number (no + or spaces)

$("#registrationForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const form = e.target;
  const msg = $("#formMessage");
  const submitBtn = form.querySelector("button[type='submit']");
  const data = new FormData(form);

  const get = name => (data.get(name) || "").toString().trim();
  const waText = [
    "*New Student Registration - MYEA*",
    `Full Name: ${get("fullName")}`,
    `Date of Birth: ${get("dob")}`,
    `Gender: ${get("gender")}`,
    `Class Level: ${get("level")}`,
    `Address: ${get("address")}`,
    `Phone: ${get("phone")}`,
    `WhatsApp: ${get("whatsapp")}`,
    `Email: ${get("email")}`,
    `Guardian Name: ${get("guardianName")}`,
    `Relationship: ${get("relationship")}`,
    `Guardian Phone: ${get("guardianPhone")}`
  ].join("\n");
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

  submitBtn.disabled = true;
  msg.style.color = "#176b3a";
  msg.textContent = "Sending your registration...";

  try {
    await fetch(form.action, {
      method: "POST",
      body: data,
      headers: { "Accept": "application/json" }
    });
    msg.textContent = "Registration sent successfully! Now tap the button below to also confirm via WhatsApp.";
  } catch (err) {
    msg.style.color = "#b3261e";
    msg.textContent = "Could not send by email, but you can still confirm via WhatsApp below.";
  } finally {
    submitBtn.disabled = false;
  }

  let waBtn = $("#waShareBtn");
  if (!waBtn) {
    waBtn = document.createElement("a");
    waBtn.id = "waShareBtn";
    waBtn.className = "btn btn-gold";
    waBtn.target = "_blank";
    waBtn.rel = "noopener";
    waBtn.textContent = "Send via WhatsApp";
    waBtn.style.marginTop = "10px";
    waBtn.style.display = "inline-block";
    msg.insertAdjacentElement("afterend", waBtn);
  }
  waBtn.href = waLink;
  waBtn.style.display = "inline-block";
});
