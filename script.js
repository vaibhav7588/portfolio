(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const themeToggle = document.getElementById("themeToggle");
  const backTop = document.getElementById("backTop");
  const typedEl = document.getElementById("typedRole");
  const form = document.getElementById("contactForm");
  const navLinks = [...document.querySelectorAll(".nav-menu a")];
  const sections = [...document.querySelectorAll("main section[id]")];

  const roles = ["Java Developer", "Web Developer", "AI/ML Enthusiast"];
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    if (!typedEl) return;
    const current = roles[roleIndex];
    typedEl.textContent = current.slice(0, charIndex);

    if (!deleting && charIndex < current.length) {
      charIndex += 1;
      setTimeout(typeLoop, 80);
      return;
    }
    if (!deleting && charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
    if (deleting && charIndex > 0) {
      charIndex -= 1;
      setTimeout(typeLoop, 40);
      return;
    }
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(typeLoop, 250);
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    themeToggle.setAttribute("aria-label", "Switch to dark theme");
  }

  themeToggle.addEventListener("click", function () {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    if (isLight) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "dark");
      themeToggle.setAttribute("aria-label", "Switch to light theme");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      themeToggle.setAttribute("aria-label", "Switch to dark theme");
    }
  });

  function closeMenu() {
    navMenu.classList.remove("open");
    navToggle.classList.remove("open");
    document.body.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  navToggle.addEventListener("click", function () {
    const open = navMenu.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 12);
    backTop.classList.toggle("show", y > 480);

    let current = "home";
    sections.forEach(function (section) {
      if (y >= section.offsetTop - 140) current = section.id;
    });
    navLinks.forEach(function (link) {
      const href = link.getAttribute("href").slice(1);
      link.classList.toggle("active", href === current);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );
  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  const skillSection = document.getElementById("skills");
  let skillsAnimated = false;

  function animateBars() {
    document.querySelectorAll(".bar").forEach(function (bar) {
      bar.querySelector("i").style.width = bar.dataset.level + "%";
    });
  }

  const skillObserver = new IntersectionObserver(
    function (entries) {
      if (entries[0].isIntersecting && !skillsAnimated) {
        skillsAnimated = true;
        animateBars();
      }
    },
    { threshold: 0.25 }
  );
  if (skillSection) skillObserver.observe(skillSection);

  function animateCounter(el) {
    const target = Number(el.dataset.counter);
    const decimals = Number(el.dataset.decimals || 0);
    const suffix = el.dataset.suffix || "";
    const duration = 1100;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const stats = document.querySelectorAll("[data-counter]");
  const statObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  stats.forEach(function (stat) {
    statObserver.observe(stat);
  });

  function setError(id, message) {
    const node = document.getElementById(id);
    if (node) node.textContent = message;
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();
    let ok = true;

    setError("nameError", "");
    setError("emailError", "");
    setError("subjectError", "");
    setError("messageError", "");
    document.getElementById("formStatus").textContent = "";

    if (name.length < 2) {
      setError("nameError", "Please enter your name.");
      ok = false;
    }
    if (!validEmail(email)) {
      setError("emailError", "Please enter a valid email address.");
      ok = false;
    }
    if (subject.length < 3) {
      setError("subjectError", "Please add a short subject.");
      ok = false;
    }
    if (message.length < 10) {
      setError("messageError", "Message should be at least 10 characters.");
      ok = false;
    }

    if (!ok) return;

    form.reset();
    document.getElementById("formStatus").textContent =
      "Thank you. Your message is ready to send — this site has no backend, so please email bandevaibhav11@gmail.com directly if needed. Validation succeeded.";
  });

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    typeLoop();
  } else if (typedEl) {
    typedEl.textContent = roles.join(" · ");
  }
})();
