const header = document.getElementById("site-header");
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
const backTop = document.getElementById("backTop");

function closeMenu() {
  navLinks?.classList.remove("open");
  menuBtn?.setAttribute("aria-expanded", "false");
  if (menuBtn) {
    menuBtn.setAttribute("aria-label", "Ouvrir le menu");
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }
  document.querySelectorAll(".has-dropdown.open").forEach(item => item.classList.remove("open"));
}

menuBtn?.addEventListener("click", () => {
  const opened = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(opened));
  menuBtn.setAttribute("aria-label", opened ? "Fermer le menu" : "Ouvrir le menu");
  menuBtn.innerHTML = opened ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});

document.querySelectorAll(".has-dropdown > a").forEach(link => {
  link.addEventListener("click", event => {
    if (window.matchMedia("(max-width: 800px)").matches) {
      event.preventDefault();
      link.parentElement.classList.toggle("open");
    }
  });
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    if (!link.parentElement.classList.contains("has-dropdown")) closeMenu();
  });
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 15);
  backTop?.classList.toggle("visible", window.scrollY > 450);
});
backTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const counter = entry.target;
    const target = Number(counter.dataset.target);
    const start = performance.now();
    const duration = 1300;
    const update = now => {
      const progress = Math.min((now - start) / duration, 1);
      counter.textContent = Math.floor((1 - Math.pow(1 - progress, 3)) * target).toLocaleString("fr-FR");
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
    observer.unobserve(counter);
  });
}, { threshold: 0.8 });
document.querySelectorAll(".counter").forEach(counter => counterObserver.observe(counter));

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const galleryItems = [...document.querySelectorAll(".gallery-item")];
let currentImage = 0;

function showImage(index) {
  if (!galleryItems.length || !lightboxImg) return;
  currentImage = (index + galleryItems.length) % galleryItems.length;
  const image = galleryItems[currentImage].querySelector("img");
  lightboxImg.src = image.src;
  lightboxImg.alt = image.alt;
}
function openGallery(index) {
  showImage(index);
  lightbox?.classList.add("open");
  lightbox?.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}
function closeGallery() {
  lightbox?.classList.remove("open");
  lightbox?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}
galleryItems.forEach((item, index) => item.addEventListener("click", () => openGallery(index)));
document.querySelector(".lightbox-close")?.addEventListener("click", closeGallery);
document.querySelector(".lightbox-prev")?.addEventListener("click", () => showImage(currentImage - 1));
document.querySelector(".lightbox-next")?.addEventListener("click", () => showImage(currentImage + 1));
lightbox?.addEventListener("click", event => { if (event.target === lightbox) closeGallery(); });
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeGallery();
  if (lightbox?.classList.contains("open") && event.key === "ArrowLeft") showImage(currentImage - 1);
  if (lightbox?.classList.contains("open") && event.key === "ArrowRight") showImage(currentImage + 1);
});

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
console.log("Lycée ANDAINGO — interface professionnelle initialisée.");
