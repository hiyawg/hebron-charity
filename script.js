/* =========================================================
   Hebron Charity — site behavior
   ========================================================= */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

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

// Toast
const toastEl = $(".toast");
let toastTimer;
const toast = (msg) => {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3000);
};

// Copy buttons (account number, phone)
$$(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
    } catch {
      const t = Object.assign(document.createElement("textarea"), { value: btn.dataset.copy });
      document.body.append(t); t.select(); document.execCommand("copy"); t.remove();
    }
    btn.textContent = "Copied ✓";
    btn.classList.add("done");
    toast(`Copied ${btn.dataset.copy}`);
    setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("done"); }, 2000);
  });
});

// Lightbox for project and gallery photos
const lb = document.createElement("div");
lb.className = "lightbox";
lb.setAttribute("role", "dialog");
lb.setAttribute("aria-modal", "true");
lb.innerHTML = '<button type="button" aria-label="Close">×</button><img alt="">';
document.body.append(lb);
const lbImg = $("img", lb);
const closeLb = () => lb.classList.remove("open");
$$(".thumbs img, .gallery img, .project-media .cover").forEach((img) => {
  img.addEventListener("click", () => {
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lb.classList.add("open");
  });
});
lb.addEventListener("click", (e) => { if (e.target !== lbImg) closeLb(); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeLb(); setNav(false); }
});
