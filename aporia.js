const quotes = [
  {
    text: "“What is the value of words? / When the whistle of bombs becomes more familiar / Than of birds”",
    author: "— Garvey Hall-Maw, Aporia Vol. 01"
  },
  {
    text: "“The air which I breathe is not mine. / My preaching, unfamiliar.”",
    author: "— Jenny Cai, Aporia Vol. 01"
  },
  {
    text: "“L'enchevêtrement de mes langues / Is like the in between of seasons.”",
    author: "— Sarah-Jeanne Leclerc, Aporia Vol. 01"
  },
  
];

const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const quoteDots = document.getElementById("quoteDots");

let currentIndex = 0;
let intervalId;

function renderDots() {
  if (!quoteDots) return;

  quoteDots.innerHTML = "";

  quotes.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = index === currentIndex ? "quote-dot active" : "quote-dot";
    dot.setAttribute("aria-label", `Show quote ${index + 1}`);

    dot.addEventListener("click", () => {
      currentIndex = index;
      updateQuote();
      restartAutoRotate();
    });

    quoteDots.appendChild(dot);
  });
}

function updateQuote() {
  if (!quoteText || !quoteAuthor) return;

  quoteText.classList.add("fade-out");
  quoteAuthor.classList.add("fade-out");

  setTimeout(() => {
    quoteText.textContent = quotes[currentIndex].text;
    quoteAuthor.textContent = quotes[currentIndex].author;

    quoteText.classList.remove("fade-out");
    quoteAuthor.classList.remove("fade-out");

    renderDots();
  }, 700);
}

function nextQuote() {
  currentIndex = (currentIndex + 1) % quotes.length;
  updateQuote();
}

function startAutoRotate() {
  if (!quoteText || !quoteAuthor || !quoteDots) return;

  intervalId = setInterval(nextQuote, 5000);
}

function restartAutoRotate() {
  clearInterval(intervalId);
  startAutoRotate();
}

renderDots();
startAutoRotate();

const heroSlides = document.querySelectorAll(".hero-slide");
const heroSection = document.querySelector(".hero");
const heroSlidePrev = document.querySelector(".hero-slideshow-prev");
const heroSlideNext = document.querySelector(".hero-slideshow-next");
let activeHeroSlide = 0;
let heroSlideIntervalId;
let heroTouchStartX = 0;

function showHeroSlide(index) {
  if (heroSlides.length < 2) return;

  heroSlides[activeHeroSlide].classList.remove("is-active");
  activeHeroSlide = (index + heroSlides.length) % heroSlides.length;
  heroSlides[activeHeroSlide].classList.add("is-active");
}

function showPreviousHeroSlide() {
  showHeroSlide(activeHeroSlide - 1);
}

function showNextHeroSlide() {
  showHeroSlide(activeHeroSlide + 1);
}

function startHeroSlideshow() {
  if (heroSlides.length < 2) return;

  heroSlideIntervalId = setInterval(showNextHeroSlide, 3000);
}

function restartHeroSlideshow() {
  clearInterval(heroSlideIntervalId);
  startHeroSlideshow();
}

heroSlidePrev?.addEventListener("click", () => {
  showPreviousHeroSlide();
  restartHeroSlideshow();
});

heroSlideNext?.addEventListener("click", () => {
  showNextHeroSlide();
  restartHeroSlideshow();
});

heroSection?.addEventListener("touchstart", (event) => {
  heroTouchStartX = event.changedTouches[0].clientX;
});

heroSection?.addEventListener("touchend", (event) => {
  const touchDistance = event.changedTouches[0].clientX - heroTouchStartX;

  if (Math.abs(touchDistance) < 45) return;

  if (touchDistance > 0) {
    showPreviousHeroSlide();
  } else {
    showNextHeroSlide();
  }

  restartHeroSlideshow();
});

startHeroSlideshow();

const fadeSections = document.querySelectorAll(".fade-section");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.15
  }
);

fadeSections.forEach((section) => observer.observe(section));

const galleryItems = document.querySelectorAll(".gallery-item");
const galleryLightbox = document.getElementById("galleryLightbox");
const galleryLightboxImage = document.getElementById("galleryLightboxImage");
const galleryLightboxClose = document.querySelector(".gallery-lightbox-close");
const galleryLightboxPrev = document.querySelector(".gallery-lightbox-prev");
const galleryLightboxNext = document.querySelector(".gallery-lightbox-next");

let activeGalleryIndex = 0;
let galleryTouchStartX = 0;

function getGalleryPhotos() {
  return Array.from(document.querySelectorAll(".gallery-item.has-image img:not(.is-missing)")).map((image) => ({
    image,
    src: image.src,
    alt: image.alt
  }));
}

function showGalleryPhoto(index) {
  const galleryPhotos = getGalleryPhotos();

  if (!galleryLightboxImage || !galleryPhotos.length) return;

  activeGalleryIndex = (index + galleryPhotos.length) % galleryPhotos.length;
  const photo = galleryPhotos[activeGalleryIndex];

  galleryLightboxImage.src = photo.src;
  galleryLightboxImage.alt = photo.alt;
}

function openGalleryLightbox(index) {
  if (!galleryLightbox || !galleryLightboxImage || !getGalleryPhotos().length) return;

  showGalleryPhoto(index);
  galleryLightbox.classList.add("is-open");
  galleryLightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("gallery-lightbox-open");
  galleryLightboxClose?.focus();
}

function closeGalleryLightbox() {
  if (!galleryLightbox || !galleryLightboxImage) return;

  galleryLightbox.classList.remove("is-open");
  galleryLightbox.setAttribute("aria-hidden", "true");
  galleryLightboxImage.src = "";
  galleryLightboxImage.alt = "";
  document.body.classList.remove("gallery-lightbox-open");
}

function showPreviousGalleryPhoto() {
  showGalleryPhoto(activeGalleryIndex - 1);
}

function showNextGalleryPhoto() {
  showGalleryPhoto(activeGalleryIndex + 1);
}

galleryItems.forEach((item) => {
  const image = item.querySelector("img");

  if (!image) return;

  image.addEventListener("error", () => {
    image.classList.add("is-missing");
    item.classList.remove("has-image");
  });

  image.addEventListener("load", () => {
    image.classList.remove("is-missing");
    item.classList.add("has-image");
  });

  if (image.complete && !image.naturalWidth) {
    image.classList.add("is-missing");
    item.classList.remove("has-image");
  } else if (image.complete && image.naturalWidth) {
    item.classList.add("has-image");
  }

  item.addEventListener("click", () => {
    if (!galleryLightbox || !galleryLightboxImage || image.classList.contains("is-missing") || !image.naturalWidth) return;

    const galleryPhotos = getGalleryPhotos();
    const photoIndex = galleryPhotos.findIndex((photo) => photo.image === image);

    openGalleryLightbox(photoIndex >= 0 ? photoIndex : 0);
  });
});

galleryLightboxClose?.addEventListener("click", closeGalleryLightbox);
galleryLightboxPrev?.addEventListener("click", showPreviousGalleryPhoto);
galleryLightboxNext?.addEventListener("click", showNextGalleryPhoto);

galleryLightbox?.addEventListener("click", (event) => {
  if (event.target === galleryLightbox) {
    closeGalleryLightbox();
  }
});

galleryLightbox?.addEventListener("touchstart", (event) => {
  galleryTouchStartX = event.changedTouches[0].clientX;
});

galleryLightbox?.addEventListener("touchend", (event) => {
  const touchDistance = event.changedTouches[0].clientX - galleryTouchStartX;

  if (Math.abs(touchDistance) < 45) return;

  if (touchDistance > 0) {
    showPreviousGalleryPhoto();
  } else {
    showNextGalleryPhoto();
  }
});

document.addEventListener("keydown", (event) => {
  if (!galleryLightbox?.classList.contains("is-open")) return;

  if (event.key === "Escape") {
    closeGalleryLightbox();
  } else if (event.key === "ArrowLeft") {
    showPreviousGalleryPhoto();
  } else if (event.key === "ArrowRight") {
    showNextGalleryPhoto();
  }
});
