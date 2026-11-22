(function () {
  "use strict";

  // Set while the head is parsing so reveal targets start hidden without a flash.
  document.documentElement.classList.add("js");

  var REVEAL_SELECTOR = [
    ".hero-copy-inner",
    "main > section > [class*='container']",
    "main > header > .container",
    "main > section[class*='container']"
  ].join(", ");

  function show(els) {
    for (var i = 0; i < els.length; i += 1) els[i].classList.add("is-visible");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var els = document.querySelectorAll(REVEAL_SELECTOR);
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!els.length || reduced || !("IntersectionObserver" in window)) {
      show(els);
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    Array.prototype.forEach.call(els, function (el) { observer.observe(el); });
  });
})();
