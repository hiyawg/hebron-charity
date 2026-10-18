/* =========================================================
   Hebron Charity — site behavior
   ========================================================= */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// Links to the old one-page site (e.g. /#project-1) go to the new pages
const legacy = {
  "#project-1": "/projects/feminine-hygiene-products",
  "#project-2": "/projects/school-feeding",
  "#project-3": "/projects/vocational-training",
  "#project-4": "/projects/household-support",
  "#project-5": "/projects/community-outreach",
  "#projects": "/#programs",
  "#gallery": "/gallery",
  "#contact": "/partner",
};
if (location.pathname === "/" && legacy[location.hash]) location.replace(legacy[location.hash]);

// Footer year
$("#year").textContent = new Date().getFullYear();

// Header style on scroll
const header = $(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Mobile nav
const toggle = $(".nav-toggle");
const setNav = (open) => {
  header.classList.toggle("nav-open", open);
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.style.overflow = open ? "hidden" : "";
};
toggle.addEventListener("click", () => setNav(!header.classList.contains("nav-open")));
$$(".nav-menu a").forEach((a) => a.addEventListener("click", () => setNav(false)));

// Reveal on scroll
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      io.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
$$(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  io.observe(el);
});

// Gallery filter by project
const filterBtns = $$(".gallery-filters button");
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const f = btn.dataset.filter;
    filterBtns.forEach((b) => {
      b.classList.toggle("active", b === btn);
      b.setAttribute("aria-pressed", b === btn);
    });
    $$(".gallery figure").forEach((fig) => {
      fig.classList.toggle("hidden", f !== "all" && fig.dataset.project !== f);
    });
  });
});

// Lightbox for photos (mouse and keyboard)
const lb = document.createElement("div");
lb.className = "lightbox";
lb.setAttribute("role", "dialog");
lb.setAttribute("aria-modal", "true");
lb.setAttribute("aria-label", "Enlarged photo");
lb.innerHTML = '<button type="button" aria-label="Close">×</button><img alt="">';
document.body.append(lb);
const lbImg = $("img", lb);
const lbClose = $("button", lb);
let lastFocus = null;
const openLb = (img) => {
  lastFocus = img;
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lb.classList.add("open");
  lbClose.focus();
};
const closeLb = () => {
  if (!lb.classList.contains("open")) return;
  lb.classList.remove("open");
  if (lastFocus) lastFocus.focus();
};
$$(".gallery img, .photo-strip img, .article-cover").forEach((img) => {
  img.tabIndex = 0;
  img.setAttribute("role", "button");
  img.setAttribute("aria-label", `Enlarge photo: ${img.alt}`);
  img.addEventListener("click", () => openLb(img));
  img.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(img); }
  });
});
lb.addEventListener("click", (e) => { if (e.target !== lbImg) closeLb(); });
lb.addEventListener("keydown", (e) => { if (e.key === "Tab") { e.preventDefault(); lbClose.focus(); } });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeLb(); setNav(false); }
});

// Inquiry form: validates, then builds a WhatsApp message the visitor sends themselves.
// Nothing is sent or stored by the website.
const form = $("#inquiry-form");
if (form) {
  const WA = "https://wa.me/251924401884";
  const params = new URLSearchParams(location.search);
  const typeSel = form.elements.type;
  const projectSel = form.elements.project;
  const preset = (sel, value) => {
    if (value && [...sel.options].some((o) => o.value === value)) sel.value = value;
  };
  preset(typeSel, params.get("type"));
  preset(projectSel, params.get("project"));

  const needsOrg = ["foundation", "corporate", "ngo"];
  const rules = {
    type: (v) => (v ? "" : "Choose an inquiry type."),
    name: (v) => (v.trim().length >= 2 ? "" : "Enter your name."),
    org: (v, d) => (needsOrg.includes(d.type) && !v.trim() ? "Enter your organisation’s name." : ""),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Enter a valid email address, like name@example.com."),
    country: (v) => (v.trim() ? "" : "Enter your country."),
    message: (v) => (v.trim().length >= 20 ? "" : "Write a message of at least 20 characters."),
  };
  const summary = $("#error-summary");
  const ready = $("#form-ready");
  const copyStatus = $("#copy-status");
  let message = "";

  const check = (name, data) => {
    const msg = rules[name](data[name] || "", data);
    form.elements[name].setAttribute("aria-invalid", msg ? "true" : "false");
    $(`#e-${name}`).textContent = msg;
    return msg;
  };
  // Once a field has been marked invalid, re-check it as the visitor fixes it
  form.addEventListener("input", (e) => {
    const name = e.target.name;
    if (rules[name] && e.target.getAttribute("aria-invalid") === "true") {
      check(name, Object.fromEntries(new FormData(form)));
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    ready.hidden = true;
    const data = Object.fromEntries(new FormData(form));
    const errors = Object.keys(rules).map((name) => [name, check(name, data)]).filter(([, msg]) => msg);
    const list = $("ul", summary);
    list.innerHTML = "";
    if (errors.length) {
      errors.forEach(([name, msg]) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `#f-${name}`;
        a.textContent = msg;
        a.addEventListener("click", (ev) => { ev.preventDefault(); form.elements[name].focus(); });
        li.append(a);
        list.append(li);
      });
      summary.hidden = false;
      summary.focus();
      return;
    }
    summary.hidden = true;
    message = [
      "Inquiry from hebcharty.com",
      `Type: ${typeSel.selectedOptions[0].text}`,
      `Project: ${projectSel.value ? projectSel.selectedOptions[0].text : "Any project"}`,
      `Name: ${data.name.trim()}`,
      data.org.trim() ? `Organisation: ${data.org.trim()}` : null,
      `Email: ${data.email.trim()}`,
      `Country: ${data.country.trim()}`,
      "",
      data.message.trim(),
    ].filter((line) => line !== null).join("\n");
    $("#wa-link").href = `${WA}?text=${encodeURIComponent(message)}`;
    copyStatus.textContent = "";
    ready.hidden = false;
    ready.focus();
  });

  $("#copy-msg").addEventListener("click", () => {
    if (!navigator.clipboard) {
      copyStatus.textContent = "Copying isn’t available in this browser. Please use Open WhatsApp instead.";
      return;
    }
    navigator.clipboard.writeText(message).then(
      () => { copyStatus.textContent = "Message copied. You can paste it into an email or text message to us."; },
      () => { copyStatus.textContent = "Couldn’t copy the message. Please use Open WhatsApp instead."; }
    );
  });
}
