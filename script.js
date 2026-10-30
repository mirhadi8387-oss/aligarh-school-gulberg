
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* =========================================
       1. HERO CAROUSEL
    ========================================= */
    const heroCarousel = document.querySelector("#heroCarousel");

    if (heroCarousel && typeof bootstrap !== "undefined") {
        const existingCarousel =
            bootstrap.Carousel.getInstance(heroCarousel);

        if (!existingCarousel) {
            new bootstrap.Carousel(heroCarousel, {
                interval: 5000,
                ride: "carousel",
                pause: false,
                touch: true,
                wrap: true
            });
        }
    }


    /* =========================================
       2. NEWS & EVENTS SWIPER
    ========================================= */
    if (
        typeof Swiper !== "undefined" &&
        document.querySelector(".newsSwiper")
    ) {
        const newsSwiperElement =
            document.querySelector(".newsSwiper");

        if (!newsSwiperElement.swiper) {
            new Swiper(".newsSwiper", {
                slidesPerView: 1,
                spaceBetween: 20,
                speed: 700,
                loop: false,
                grabCursor: true,

                navigation: {
                    nextEl: ".swiper-button-next-custom",
                    prevEl: ".swiper-button-prev-custom"
                },

                breakpoints: {
                    576: {
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 24
                    },
                    992: {
                        slidesPerView: 3,
                        spaceBetween: 24
                    },
                    1200: {
                        slidesPerView: 3,
                        spaceBetween: 28
                    }
                }
            });
        }
    }


    /* =========================================
       3. GALLERY SWIPER
    ========================================= */
    if (
        typeof Swiper !== "undefined" &&
        document.querySelector(".gallerySwiper")
    ) {
        const gallerySwiperElement =
            document.querySelector(".gallerySwiper");

        if (!gallerySwiperElement.swiper) {
            new Swiper(".gallerySwiper", {
                slidesPerView: 1,
                spaceBetween: 20,
                speed: 700,
                loop: false,
                grabCursor: true,

                navigation: {
                    nextEl: ".swiper-button-next-gallery",
                    prevEl: ".swiper-button-prev-gallery"
                },

                breakpoints: {
                    576: {
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 24
                    },
                    992: {
                        slidesPerView: 2,
                        spaceBetween: 28
                    },
                    1200: {
                        slidesPerView: 3,
                        spaceBetween: 28
                    }
                }
            });
        }
    }


    /* =========================================
   HOME STATISTICS COUNTER
========================================= */
const counters = document.querySelectorAll(
    "#school-statistics .counter"
);

function animateCounter(counter) {
    if (counter.dataset.animated === "true") return;

    counter.dataset.animated = "true";

    const target = parseInt(counter.dataset.target, 10);
    const prefix = counter.dataset.prefix || "";
    const suffix = counter.dataset.suffix || "";

    if (Number.isNaN(target)) return;

    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const progress = Math.min(
            (currentTime - startTime) / duration,
            1
        );

        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(target * easedProgress);

        counter.textContent =
            prefix + currentValue.toLocaleString() + suffix;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent =
                prefix + target.toLocaleString() + suffix;
        }
    }

    requestAnimationFrame(updateCounter);
}

if ("IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver(
        function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.3 }
    );

    counters.forEach(function (counter) {
        statsObserver.observe(counter);
    });
} else {
    counters.forEach(animateCounter);
}


    /* =========================================
       5. SCROLL REVEAL ANIMATION
    ========================================= */
    const revealElements = document.querySelectorAll(
        ".reveal, .reveal-up, .reveal-left, .reveal-right"
    );

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach(function (element) {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(function (element) {
            element.classList.add("is-visible");
        });
    }


    /* =========================================
       6. ANNOUNCEMENT / NOTICE MODAL
    ========================================= */
    const noticeModalElement =
        document.getElementById("updateNoticeModal");

    const dontShowAgainCheckbox =
        document.getElementById("dontShowAgain");

    const NOTICE_STORAGE_KEY = "hideNoticePopup";

    if (
        noticeModalElement &&
        typeof bootstrap !== "undefined"
    ) {
        let shouldShowNotice = true;

        try {
            shouldShowNotice =
                localStorage.getItem(NOTICE_STORAGE_KEY) !== "true";
        } catch (error) {
            // Continue without localStorage if browser blocks it.
        }

        if (shouldShowNotice) {
            window.setTimeout(function () {
                const modal =
                    bootstrap.Modal.getOrCreateInstance(
                        noticeModalElement
                    );

                modal.show();
            }, 1500);
        }

        noticeModalElement.addEventListener(
            "hidden.bs.modal",
            function () {
                if (
                    dontShowAgainCheckbox &&
                    dontShowAgainCheckbox.checked
                ) {
                    try {
                        localStorage.setItem(
                            NOTICE_STORAGE_KEY,
                            "true"
                        );
                    } catch (error) {
                        // Modal will still work if storage is unavailable.
                    }
                }
            }
        );
    }


    /* =========================================
       7. IMAGE LIGHTBOX
    ========================================= */
    const lightbox = document.getElementById("imageLightbox");
    const lightboxImage = document.getElementById("lightboxImage");

    if (lightbox && lightboxImage) {
        const closeButton = lightbox.querySelector(
            ".lightbox-close, .btn-close, [data-lightbox-close]"
        );

        function openLightbox(imageSource, imageAlt) {
            lightboxImage.src = imageSource;
            lightboxImage.alt = imageAlt || "Gallery image";

            lightbox.classList.add("active");
            lightbox.classList.add("show");
            lightbox.setAttribute("aria-hidden", "false");

            document.body.classList.add("lightbox-open");
        }

        function closeLightbox() {
            lightbox.classList.remove("active");
            lightbox.classList.remove("show");
            lightbox.setAttribute("aria-hidden", "true");

            document.body.classList.remove("lightbox-open");
        }

        document.querySelectorAll(
            ".gallerySwiper img, .gallery-image, [data-lightbox]"
        ).forEach(function (image) {
            image.style.cursor = "zoom-in";

            image.addEventListener("click", function (event) {
                event.preventDefault();

                const imageSource =
                    image.getAttribute("data-lightbox") ||
                    image.getAttribute("data-full") ||
                    image.currentSrc ||
                    image.src;

                openLightbox(imageSource, image.alt);
            });
        });

        if (closeButton) {
            closeButton.addEventListener(
                "click",
                closeLightbox
            );
        }

        lightbox.addEventListener("click", function (event) {
            if (
                event.target === lightbox ||
                event.target.hasAttribute("data-lightbox-close")
            ) {
                closeLightbox();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (
                event.key === "Escape" &&
                (
                    lightbox.classList.contains("active") ||
                    lightbox.classList.contains("show")
                )
            ) {
                closeLightbox();
            }
        });
    }


    /* =========================================
       8. BACK TO TOP BUTTON
    ========================================= */
    const backToTopButton =
        document.getElementById("backToTop");

    if (backToTopButton) {
        function updateBackToTop() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add("show");
                backToTopButton.classList.add("visible");
            } else {
                backToTopButton.classList.remove("show");
                backToTopButton.classList.remove("visible");
            }
        }

        window.addEventListener(
            "scroll",
            updateBackToTop,
            { passive: true }
        );

        updateBackToTop();

        backToTopButton.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }


    /* =========================================
       9. OPTIONAL: SMOOTH SCROLL FOR PAGE LINKS
    ========================================= */
    document.querySelectorAll('a[href^="#"]').forEach(
        function (link) {
            link.addEventListener("click", function (event) {
                const targetId = link.getAttribute("href");

                if (!targetId || targetId === "#") {
                    return;
                }

                const targetElement =
                    document.querySelector(targetId);

                if (!targetElement) {
                    return;
                }

                event.preventDefault();

                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });
        }
    );

});

document.addEventListener('DOMContentLoaded', function() {
    console.log("Aligarh Public School Scripts Initialized.");

   
    // Check karein ke kya aaj ke din ke liye modal hide karna hai
    const hideModalDate = localStorage.getItem("hideUpdateModalDate");
    const today = new Date().toDateString();

    // Agar date match nahi karti (yani naya din hai ya pehli baar hai), toh modal dikhayein
    if (hideModalDate !== today) {
        var updateModal = new bootstrap.Modal(document.getElementById('updateNoticeModal'));
        updateModal.show();
    }

// Jab user Close ya dismiss kare, toh check karein ke checkbox ticked hai ya nahi
document.getElementById('updateNoticeModal').addEventListener('hidden.bs.modal', function () {
    const dontShowCheckbox = document.getElementById('dontShowAgain');
    
    if (dontShowCheckbox.checked) {
        // Aaj ki date ko localStorage mein save kar lein taake aaj ke din dobara na aaye
        const today = new Date().toDateString();
        localStorage.setItem("hideUpdateModalDate", today);
    }
});
    // Form submission feedback for Formspree
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Submitting...';
                btn.disabled = true;
            }
        });
    });
});


   document.addEventListener("DOMContentLoaded", function() {
    // 1. Lightbox ka HTML khud bana do
    const lightboxHTML = `
        <div id="imageLightbox" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); backdrop-filter:blur(8px); z-index:9999; justify-content:center; align-items:center; cursor:pointer;">
            <img id="lightboxImg" src="" style="max-width:90%; max-height:90vh; border-radius:8px; box-shadow:0 5px 25px rgba(0,0,0,0.5); object-fit:contain;">
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);

    const lightbox = document.getElementById("imageLightbox");
    const lightboxImg = document.getElementById("lightboxImg");

    // 2. Page ki sabhi images par click event laga do
    const images = document.querySelectorAll("img");
    images.forEach(img => {
        // Chote icons ya logos ko chor kar baqi sab par apply karega
        if(img.classList.contains('navbar-toggler-icon') || img.width < 50) return;

        img.style.cursor = "pointer";
        img.addEventListener("click", function(e) {
            e.stopPropagation();
            lightboxImg.src = this.src;
            lightbox.style.display = "flex";
        });
    });

    // 3. Screen par kahin bhi click karne par close hojaye
    lightbox.addEventListener("click", function() {
        lightbox.style.display = "none";
    });

    // 4. Keyboard ka ESC button dabane par close hojaye
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape" || e.keyCode === 27) {
            if (lightbox.style.display === "flex") {
                lightbox.style.display = "none";
            }
        }
    });
});
// Jab poora page, images aur scripts load ho jayein
window.addEventListener("load", function() {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        // Smooth transition ke sath hide kar do
        preloader.classList.add("preloader-hidden");
    }
});
const swiper = new Swiper('.newsSwiper', {
    slidesPerView: 3,
    spaceBetween: 24,
    loop: true,
    autoplay: {
      delay: 3500, // Har 3.5 seconds baad agla card aayega
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: '.swiper-button-next-custom',
      prevEl: '.swiper-button-prev-custom',
    },
    breakpoints: {
      320: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      992: { slidesPerView: 3 }
    }
  });

 var gallerySwiper = new Swiper('.gallerySwiper', {
    
    navigation: {
        nextEl: '.swiper-button-next-gallery',
        prevEl: '.swiper-button-prev-gallery',
    },
});

//   Alumni Tab JS
 function toggleSection(itemClassName, btnId) {
            const items = document.querySelectorAll('.' + itemClassName);
            const btn = document.getElementById(btnId);
            
            let isHidden = false;
            items.forEach(item => {
                if (item.classList.contains('hidden-items')) {
                    isHidden = true;
                }
            });

            items.forEach(item => {
                if (isHidden) {
                    item.classList.remove('hidden-items');
                    btn.innerText = 'Show Less';
                } else {
                    // Check if it's past the first 3 items to re-hide them
                    // We keep first 3 visible and hide rest
                }
            });

            // Alternative toggle check for cleaner state handling
            if (!isHidden) {
                // If they were already showing, hide items from index 3 onwards
                items.forEach((item, index) => {
                    if (index >= 3) {
                        item.classList.add('hidden-items');
                    }
                });
                btn.innerText = 'Show More';
            }
        }

// feedback JS
function changeFeaturedLocalVideo(videoSrc, title, cardElement) {
    // 1. Main player aur title update karein
    const mainPlayer = document.getElementById('mainVideoPlayer');
    const mainTitle = document.getElementById('mainVideoTitle');
    
    if (mainPlayer) {
        mainPlayer.src = videoSrc;
        mainPlayer.load();
        mainPlayer.play();
    }
    
    if (mainTitle) {
        mainTitle.textContent = title;
    }

    // 2. Sab thumbnails se orange border aur scale remove karein
    document.querySelectorAll('.video-thumb-card').forEach(card => {
        card.style.border = 'none';
        card.style.transform = 'scale(1)';
    });

    // 3. Sirf click kiye gaye card par solid orange border apply karein
    if (cardElement) {
        cardElement.style.border = '3px solid orange';
        cardElement.style.transform = 'scale(1.02)';
        cardElement.style.transition = 'all 0.2s ease';
    }

    // 4. Main video player par smooth scroll karein
    const featuredCard = document.getElementById('mainVideoPlayer').closest('.card');
    if (featuredCard) {
        featuredCard.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}
 /* ---------------------------------------
               BACK TO TOP BUTTON
            --------------------------------------- */
            const backToTop = document.getElementById("backToTop");

            window.addEventListener("scroll", () => {
                backToTop.classList.toggle("visible", window.scrollY > 400);
            }, { passive: true });

            backToTop.addEventListener("click", () => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            });


/* =========================================
   JUNIOR COMPUTER LAB INTERACTIONS
========================================= */
(function () {
    "use strict";

    function initJuniorComputerLab() {
        const section = document.getElementById("jr-computer-lab");

        if (!section || section.dataset.jrInitialized === "true") {
            return;
        }

        section.dataset.jrInitialized = "true";

        /* Scroll reveal animation */
        const animatedElements = section.querySelectorAll(".jr-animate");
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (!reduceMotion && "IntersectionObserver" in window) {
            section.classList.add("jr-reveal-ready");

            const revealObserver = new IntersectionObserver(
                function (entries, observer) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("jr-visible");
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.08,
                    rootMargin: "0px 0px -25px 0px"
                }
            );

            animatedElements.forEach(function (element, index) {
                element.style.transitionDelay = (index % 4) * 80 + "ms";
                revealObserver.observe(element);
            });
        }

        /* Image lightbox */
        const lightbox = section.querySelector("#jr-lightbox");
        const lightboxImage = section.querySelector(".jr-lightbox-image");
        const lightboxCaption = section.querySelector(".jr-lightbox-caption");
        const closeButton = section.querySelector(".jr-lightbox-close");
        const previousButton = section.querySelector(".jr-lightbox-prev");
        const nextButton = section.querySelector(".jr-lightbox-next");
        const galleryButtons = Array.from(
            section.querySelectorAll(".jr-gallery-item")
        );

        if (!lightbox || !lightboxImage || !galleryButtons.length) {
            return;
        }

        let currentIndex = 0;
        let previousFocus = null;

        function showImage(index) {
            currentIndex = (index + galleryButtons.length) % galleryButtons.length;

            const selected = galleryButtons[currentIndex];
            const imagePath = selected.dataset.full;
            const caption = selected.dataset.caption || "";

            lightboxImage.src = imagePath;
            lightboxImage.alt = caption;
            lightboxCaption.textContent = caption;

            lightbox.classList.add("active");
            lightbox.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
        }

        function openImage(index) {
            previousFocus = document.activeElement;
            showImage(index);
            closeButton.focus();
        }

        function closeImage() {
            lightbox.classList.remove("active");
            lightbox.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";

            if (previousFocus && typeof previousFocus.focus === "function") {
                previousFocus.focus();
            }
        }

        galleryButtons.forEach(function (button, index) {
            button.addEventListener("click", function () {
                openImage(index);
            });
        });

        previousButton.addEventListener("click", function () {
            showImage(currentIndex - 1);
        });

        nextButton.addEventListener("click", function () {
            showImage(currentIndex + 1);
        });

        closeButton.addEventListener("click", closeImage);

        lightbox.addEventListener("click", function (event) {
            if (event.target === lightbox) {
                closeImage();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (!lightbox.classList.contains("active")) {
                return;
            }

            if (event.key === "Escape") {
                closeImage();
            } else if (event.key === "ArrowRight") {
                showImage(currentIndex + 1);
            } else if (event.key === "ArrowLeft") {
                showImage(currentIndex - 1);
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initJuniorComputerLab
        );
    } else {
        initJuniorComputerLab();
    }
})();

// Our Objectives: Scroll Reveal Animation
(function () {
    const section = document.querySelector("#objectives");

    if (!section || section.dataset.animationInitialized === "true") {
        return;
    }

    section.dataset.animationInitialized = "true";

    const items = section.querySelectorAll(".objective-reveal");

    // Keep everything visible if animation is not supported or reduced motion is preferred
    if (
        !("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        return;
    }

    section.classList.add("objectives-animate-ready");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px"
    });

    items.forEach((item, index) => {
        item.style.transitionDelay = `${(index % 3) * 100}ms`;
        observer.observe(item);
    });
})();

// Background Page: Scroll Reveal Animation
(function () {
    const section = document.querySelector("#history");

    if (!section || section.dataset.backgroundAnimationInitialized === "true") {
        return;
    }

    section.dataset.backgroundAnimationInitialized = "true";

    const items = section.querySelectorAll(".background-reveal");

    if (
        !("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        return;
    }

    section.classList.add("background-animate-ready");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -25px 0px"
    });

    items.forEach((item, index) => {
        item.style.transitionDelay = `${(index % 3) * 100}ms`;
        observer.observe(item);
    });
})();

// About TAT: Scroll Reveal Animation
(function () {
    const section = document.querySelector("#about-tat");

    if (!section || section.dataset.tatAnimationInitialized === "true") {
        return;
    }

    section.dataset.tatAnimationInitialized = "true";

    const items = section.querySelectorAll(".tat-reveal");

    if (
        !("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        return;
    }

    section.classList.add("tat-animate-ready");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -25px 0px"
    });

    items.forEach((item, index) => {
        item.style.transitionDelay = `${(index % 3) * 100}ms`;
        observer.observe(item);
    });
})();

/* =========================================
   SCHOOL HISTORY SCROLL ANIMATION
========================================= */

(function () {
    const section = document.querySelector("#school-history");

    if (
        !section ||
        section.dataset.historyAnimationInitialized === "true"
    ) {
        return;
    }

    section.dataset.historyAnimationInitialized = "true";

    const items = section.querySelectorAll(".history-reveal");

    if (
        !("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        return;
    }

    section.classList.add("history-animate-ready");

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -25px 0px"
        }
    );

    items.forEach(function (item, index) {
        item.style.transitionDelay = `${(index % 3) * 100}ms`;
        observer.observe(item);
    });
})();

/* =========================================
   PRESIDENT'S MESSAGE SCROLL ANIMATION
========================================= */

(function () {
    const section = document.querySelector("#president-message");

    if (
        !section ||
        section.dataset.presidentAnimationInitialized === "true"
    ) {
        return;
    }

    section.dataset.presidentAnimationInitialized = "true";

    const items = section.querySelectorAll(".president-reveal");

    if (
        !("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        return;
    }

    section.classList.add("president-animate-ready");

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -25px 0px"
        }
    );

    items.forEach(function (item, index) {
        item.style.transitionDelay = `${index * 120}ms`;
        observer.observe(item);
    });
})();

/* =========================================
   PRINCIPAL MESSAGE SCROLL ANIMATION
========================================= */

(function () {
    const section = document.querySelector("#principal-message");

    if (
        !section ||
        section.dataset.principalAnimationInitialized === "true"
    ) {
        return;
    }

    section.dataset.principalAnimationInitialized = "true";

    const items = section.querySelectorAll(".principal-reveal");

    if (
        !("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        return;
    }

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -25px 0px"
        }
    );

    section.classList.add("principal-animate-ready");

    items.forEach(function (item, index) {
        item.style.transitionDelay = `${index * 100}ms`;
        observer.observe(item);
    });
})();

/* ==========================================
   OUR MISSION SECTION - SCROLL ANIMATIONS
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
    const missionSection = document.querySelector(
        ".home-mission-section"
    );

    if (!missionSection) return;

    const missionElements = missionSection.querySelectorAll(
        ".home-section-heading, .home-mission-intro, .home-mission-grid .col-md-6, .home-mission-footer"
    );

    // Initial animation setup
    missionElements.forEach(function (element, index) {
        element.style.opacity = "0";
        element.style.transform = "translateY(22px)";
        element.style.transition =
            "opacity 0.6s ease, transform 0.6s ease";
        element.style.transitionDelay =
            Math.min(index * 0.08, 0.4) + "s";
    });

    // Reveal elements when they enter the viewport
    if ("IntersectionObserver" in window) {
        const missionObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -30px 0px"
            }
        );

        missionElements.forEach(function (element) {
            missionObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        missionElements.forEach(function (element) {
            element.style.opacity = "1";
            element.style.transform = "translateY(0)";
        });
    }
});

/* ==========================================
   SENIOR BOYS COMPUTER LAB ANIMATIONS
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const seniorLab = document.querySelector("#boys-lab");

    if (!seniorLab) return;

    const revealElements = seniorLab.querySelectorAll(".sb-reveal");

    // Scroll Reveal Animation
    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("sb-visible");

                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach(function (element) {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(function (element) {
            element.classList.add("sb-visible");
        });

    }

});


/* Senior Boys Branch Smooth Navigation */

document.addEventListener("DOMContentLoaded", function () {

    const seniorLinks = document.querySelectorAll(
        '.senior-navigation a, .senior-btn'
    );

    seniorLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (!targetId || !targetId.startsWith("#")) return;

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        });

    });

});

/* Chemistry Lab Smooth Navigation */

document.addEventListener("DOMContentLoaded", function () {

    const chemistryLinks = document.querySelectorAll(
        '.chemistry-navigation a, .chemistry-btn'
    );

    chemistryLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (!targetId || !targetId.startsWith("#")) return;

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        });

    });

});

/* Physics Lab Smooth Navigation */

document.addEventListener("DOMContentLoaded", function () {

    const physicsLinks = document.querySelectorAll(
        '.physics-navigation a, .physics-btn'
    );

    physicsLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (!targetId || !targetId.startsWith("#")) return;

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        });

    });

});

/* Biology Lab Smooth Navigation */

document.addEventListener("DOMContentLoaded", function () {

    const biologyLinks = document.querySelectorAll(
        '.biology-navigation a, .biology-btn'
    );

    biologyLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (!targetId || !targetId.startsWith("#")) return;

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        });

    });

});

/* =========================================
   CONTACT FORM - FORMSPREE AJAX
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const contactForm = document.getElementById("schoolContactForm");

    if (!contactForm) return;

    const statusBox = document.getElementById("contactFormStatus");
    const submitButton = contactForm.querySelector(".contact-submit-btn");

    contactForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        statusBox.className = "contact-form-status";
        statusBox.textContent = "";

        const originalButton = submitButton.innerHTML;

        submitButton.disabled = true;
        submitButton.innerHTML =
            '<span>Sending Message...</span> <i class="fas fa-spinner fa-spin"></i>';

        try {

            const response = await fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: {
                    "Accept": "application/json"
                }
            });

            if (response.ok) {

                statusBox.textContent =
                    "Thank you! Your message has been sent successfully. We will get back to you soon.";

                statusBox.classList.add("success");

                contactForm.reset();

            } else {

                const result = await response.json();

                statusBox.textContent =
                    result.errors
                        ? result.errors.map(error => error.message).join(", ")
                        : "Unable to send your message. Please try again.";

                statusBox.classList.add("error");
            }

        } catch (error) {

            statusBox.textContent =
                "Something went wrong. Please check your internet connection and try again.";

            statusBox.classList.add("error");

        } finally {

            submitButton.disabled = false;
            submitButton.innerHTML = originalButton;

        }

    });

});

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("onlineAdmissionForm");

    if (!form) return;

    // Capture submit event before other handlers
    form.addEventListener("submit", async function (event) {

        event.preventDefault();
        event.stopImmediatePropagation();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const submitBtn = document.getElementById("admissionSubmitBtn");
        const statusBox = document.getElementById("admissionFormStatus");

        submitBtn.disabled = true;
        submitBtn.innerHTML = "Submitting...";

        try {

            const response = await fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: {
                    "Accept": "application/json"
                },
                redirect: "manual"
            });

            if (response.type === "opaqueredirect") {
                throw new Error("Unexpected redirect received.");
            }

            if (response.ok) {

                form.reset();

                statusBox.style.display = "block";
                statusBox.style.color = "green";
                statusBox.innerHTML =
                    "<strong>✓ Application Submitted Successfully!</strong><br>" +
                    "Thank you for choosing Aligarh Public School.";

                alert("Application Submitted Successfully!");

            } else {

                throw new Error("Form submission failed. Status: " + response.status);

            }

        } catch (error) {

            console.error(error);

            statusBox.style.display = "block";
            statusBox.style.color = "red";
            statusBox.textContent =
                "Unable to submit application. Please try again.";

        } finally {

            submitBtn.disabled = false;
            submitBtn.innerHTML =
                '<span>Submit Online Application</span><i class="fas fa-paper-plane"></i>';

        }

    }, true);

});
