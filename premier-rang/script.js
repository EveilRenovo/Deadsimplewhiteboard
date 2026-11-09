/* =========================================================
   PREMIER RANG — Interactions
   ========================================================= */

// Adresse qui recevra les demandes du formulaire de contact.
// À remplacer par l'adresse e-mail réelle de Premier Rang.
const CONTACT_EMAIL = "contact@votre-domaine.ma";

(function () {
  document.documentElement.classList.remove("no-js");

  /* ---- En-tête : bordure au défilement ---- */
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Menu mobile ---- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("nav");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    nav.classList.toggle("is-open", open);
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* ---- Onglets Collège / Lycée ---- */
  const switcher = document.querySelector(".level-switch");
  const tabs = switcher.querySelectorAll('[role="tab"]');
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
        const panel = document.getElementById(t.getAttribute("aria-controls"));
        panel.hidden = !active;
        if (active) {
          panel.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
          panel.classList.remove("is-entering");
          void panel.offsetWidth;
          panel.classList.add("is-entering");
        }
      });
      switcher.classList.toggle("is-lycee", tab.id === "tab-lycee");
    });
  });

  /* ---- Apparition au défilement ---- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---- Pré-remplissage du formulaire depuis les cartes ---- */
  const formuleSelect = document.getElementById("formule");
  const villeSelect = document.getElementById("ville");
  document.querySelectorAll("[data-formule]").forEach((btn) => {
    btn.addEventListener("click", () => { formuleSelect.value = btn.dataset.formule; });
  });
  document.querySelectorAll("[data-ville]").forEach((btn) => {
    btn.addEventListener("click", () => { villeSelect.value = btn.dataset.ville; });
  });

  /* ---- Formulaire de contact ---- */
  const form = document.getElementById("contact-form");
  const status = form.querySelector(".form-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll("[required]").forEach((input) => {
      const ok = input.checkValidity();
      input.closest(".field").classList.toggle("has-error", !ok);
      if (!ok) valid = false;
    });

    if (!valid) {
      status.textContent = "Merci de compléter les champs indiqués.";
      status.className = "form-status is-error";
      return;
    }

    const d = Object.fromEntries(new FormData(form).entries());
    const subject = `Demande d'information — ${d.classe} — ${d.ville}`;
    const body = [
      `Nom du parent : ${d.parent}`,
      `Téléphone : ${d.tel}`,
      `E-mail : ${d.email}`,
      `Classe : ${d.classe}`,
      `Ville : ${d.ville}`,
      `Formule : ${d.formule || "Souhaite être conseillé(e)"}`,
      `Matière(s) : ${d.matieres || "—"}`,
      "",
      d.message || "",
    ].join("\n");

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = "Merci. Votre messagerie s'ouvre pour finaliser l'envoi de votre demande.";
    status.className = "form-status is-ok";
  });

  form.querySelectorAll("input, select").forEach((input) => {
    input.addEventListener("input", () => input.closest(".field").classList.remove("has-error"));
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
