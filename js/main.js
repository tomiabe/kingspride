(function () {
  "use strict";

  document.documentElement.classList.add("js");

  if (window.lucide) {
    lucide.createIcons();
  }

  var header = document.getElementById("site-header");
  var navToggle = document.getElementById("nav-toggle");
  var siteNav = document.getElementById("site-nav");
  var navOpen = false;

  function setNavOpen(open) {
    navOpen = open;
    navToggle.setAttribute("aria-expanded", String(open));
    siteNav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      setNavOpen(!navOpen);
      if (!navOpen) {
        navToggle.focus();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navOpen) {
        setNavOpen(false);
        navToggle.focus();
      }
    });

    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (navOpen) {
          setNavOpen(false);
        }
      });
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 768 && navOpen) {
        setNavOpen(false);
      }
    });
  }

  var toTop = document.getElementById("to-top");

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 20);
    if (toTop) {
      toTop.classList.toggle("is-visible", y > 600);
    }
  }

  if (header) {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toTop) {
    toTop.addEventListener("click", function () {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  var revealGroup = document.querySelectorAll("[data-reveal-group]");
  revealGroup.forEach(function (group) {
    var children = Array.prototype.slice.call(group.children);
    children.forEach(function (child, index) {
      child.style.setProperty("--reveal-delay", index * 90 + "ms");
    });
  });

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  var revealTargets = document.querySelectorAll("[data-reveal], [data-reveal-group] > *");
  revealTargets.forEach(function (el) {
    revealObserver.observe(el);
  });

  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          siteNav.querySelectorAll("a").forEach(function (link) {
            var href = link.getAttribute("href");
            link.classList.toggle("is-active", href === "#" + id);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );

  document.querySelectorAll("main section[id]").forEach(function (section) {
    sectionObserver.observe(section);
  });

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form-status";
      status.textContent = "";

      var name = document.getElementById("name");
      var organization = document.getElementById("organization");
      var email = document.getElementById("email");
      var message = document.getElementById("message");
      var valid = true;

      [name, organization, email, message].forEach(function (field) {
        var ok = field.value.trim().length > 0;
        if (field.type === "email") {
          ok = ok && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        }
        if (!ok) {
          valid = false;
          field.focus();
        }
      });

      if (!valid) {
        status.classList.add("error");
        status.textContent = "Please complete the required fields with valid information.";
        return;
      }

      form.reset();
      status.classList.add("success");
      status.textContent = "Thank you. Your inquiry has been received. We will respond to schedule a confidential conversation.";
    });
  }
})();
