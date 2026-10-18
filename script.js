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
