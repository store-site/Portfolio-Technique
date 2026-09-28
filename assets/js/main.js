// assets/js/main.js
const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const fmtDate = (d) => {
  if (!d) return "";
  const date = d.toDate ? d.toDate() : new Date(d);
  if (isNaN(date)) return "";
  return date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
};

function cardHTML(w, inTravaux) {
  const href = (inTravaux ? "" : "travaux/") + "article.html?id=" + encodeURIComponent(w.id);
  return `
    <a class="card" href="${href}" data-cat="${esc(w.category)}">
      <div class="meta"><b>${esc(w.category)}</b><span>${esc(fmtDate(w.date))}</span></div>
      <h3>${esc(w.title)}</h3>
      <p>${esc(w.excerpt)}</p>
      <span class="more">Lire l'article →</span>
    </a>`;
}

// Aucune publication : on masque la section sur l'accueil, on affiche un message sur la page Travaux
function showEmpty() {
  const sec = document.getElementById("latest-section");
  if (sec) sec.style.display = "none";
  const empty = document.getElementById("empty");
  if (empty && document.getElementById("works")) {
    empty.textContent = "Les premières publications arrivent bientôt.";
    empty.style.display = "block";
  }
}

async function loadWorks() {
  const latest = document.getElementById("latest");
  const works = document.getElementById("works");
  const target = works || latest;
  if (!target) return; // page sans liste : rien à charger

  try {
    const { db } = await import("./firebase-config.js");
    const { collection, query, where, getDocs } =
      await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");

    // Pas d'orderBy côté serveur : évite de créer un index composite
    const snap = await getDocs(query(collection(db, "travaux"), where("published", "==", true)));
    let items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (!items.length) return showEmpty();

    items.sort((a, b) => {
      const da = a.date?.toDate ? a.date.toDate() : new Date(a.date || 0);
      const dbb = b.date?.toDate ? b.date.toDate() : new Date(b.date || 0);
      return dbb - da;
    });

    if (!works) items = items.slice(0, 3); // accueil : 3 derniers
    target.innerHTML = items.map(w => cardHTML(w, !!works)).join("");
  } catch (err) {
    console.warn("Chargement des travaux impossible :", err);
    showEmpty();
  }
}

loadWorks();

// ============ RETOUR EN HAUT ============
(function toTop() {
  const btn = document.createElement("button");
  btn.className = "to-top";
  btn.setAttribute("aria-label", "Retour en haut");
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(btn);

  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 500);
  });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();
