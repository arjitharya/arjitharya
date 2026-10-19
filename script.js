(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var loader = document.getElementById("loader");
  var siteContent = document.getElementById("siteContent");

  function revealPage() {
    if (loader) loader.style.display = "none";
    if (siteContent) siteContent.classList.add("is-ready");
  }

  if (loader) {
    if (reduceMotion) {
      revealPage();
    } else {
      window.setTimeout(function () {
        loader.classList.add("is-revealed");
        window.setTimeout(function () {
          loader.classList.add("is-done");
          window.setTimeout(revealPage, 720);
        }, 800);
      }, 450);
    }
  } else {
    revealPage();
  }

  var typewriter = document.getElementById("typewriter");
  if (typewriter) {
    var roles = [
      "Co-founder & CTO @ Tsukuba Tech",
      "Computer Engineering @ HKU",
      "Robotics & Autonomous Systems",
      "Information & Systems Analytics"
    ];
    if (!reduceMotion) {
      var roleIndex = 0;
      var characterIndex = roles[0].length;
      var deleting = false;

      function typeRole() {
        var currentRole = roles[roleIndex];
        if (!deleting) {
          characterIndex += 1;
          typewriter.textContent = currentRole.slice(0, characterIndex);
          if (characterIndex >= currentRole.length) {
            deleting = true;
            window.setTimeout(typeRole, 1700);
            return;
          }
        } else {
          characterIndex -= 1;
          typewriter.textContent = currentRole.slice(0, characterIndex);
          if (characterIndex <= 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
          }
        }
        window.setTimeout(typeRole, deleting ? 38 : 65);
      }

      window.setTimeout(function () {
        deleting = true;
        typeRole();
      }, 1600);
    }
  }

  var navbar = document.getElementById("navbar");
  function updateNavbar() {
    if (navbar) navbar.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();

  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  var navScrollY = 0;

  function lockPageScroll() {
    navScrollY = window.scrollY;
    document.documentElement.classList.add("nav-open");
    document.body.classList.add("nav-open");
  }

  function unlockPageScroll(restoreScroll) {
    document.documentElement.classList.remove("nav-open");
    document.body.classList.remove("nav-open");
    if (restoreScroll !== false) {
      window.requestAnimationFrame(function () {
        window.scrollTo({ top: navScrollY, behavior: "instant" });
      });
    }
  }

  function closeNav(restoreScroll) {
    if (!navToggle || !navLinks) return;
    var wasOpen = navLinks.classList.contains("is-open");
    navToggle.classList.remove("is-open");
    navLinks.classList.remove("is-open");
    if (navbar) navbar.classList.remove("menu-open");
    if (wasOpen) unlockPageScroll(restoreScroll);
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", open);
      if (navbar) navbar.classList.toggle("menu-open", open);
      if (open) lockPageScroll();
      else unlockPageScroll();
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function (event) {
        var href = link.getAttribute("href");
        var target = href && href.charAt(0) === "#" ? document.getElementById(href.slice(1)) : null;
        if (!target) return;
        event.preventDefault();
        closeNav(false);
        window.history.pushState(null, "", href);
        var top = target.getBoundingClientRect().top + window.scrollY;
        var offset = parseFloat(window.getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
        window.scrollTo({ top: top - offset, behavior: "instant" });
      });
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeNav();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });
  }

  var navAnchors = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  if ("IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navAnchors.forEach(function (anchor) {
          anchor.classList.toggle("is-active", anchor.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(function (section) { navObserver.observe(section); });
  }

  document.querySelectorAll(".project-media img").forEach(function (image) {
    image.addEventListener("load", function () {
      image.parentElement.classList.add("has-image");
    });
    image.addEventListener("error", function () {
      image.parentElement.classList.remove("has-image");
    });
    if (image.complete && image.naturalWidth > 0) image.parentElement.classList.add("has-image");
  });
})();