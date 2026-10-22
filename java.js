document.addEventListener("click", function (event) {

    const bouton = event.target.closest("#btnDeconnexion");

    if (bouton) {

        event.preventDefault();

        const confirmer = confirm(
            "Voulez-vous vraiment vous déconnecter ?"
        );

        if (confirmer) {

            localStorage.removeItem("sessionUtilisateur");

            window.location.href = "connexion.html";

        }

    }

});


// ==================================================
// 1. RÉCUPÉRATION DES ÉLÉMENTS HTML
// ==================================================

const equipementsCount = document.querySelector("#equipementsCount");
const stockCount = document.querySelector("#stockCount");
const interventionsCount = document.querySelector("#interventionsCount");
const tasksCount = document.querySelector("#tasksCount");


// ==================================================
// 2. RÉCUPÉRATION DES DONNÉES DEPUIS localStorage
// ==================================================

function recupererDonnees(cle) {
    return JSON.parse(localStorage.getItem(cle)) || [];
}


// ==================================================
// 3. MISE À JOUR DE LA CARTE ÉQUIPEMENTS
// ==================================================

function afficherNombreEquipements() {

    const equipements = recupererDonnees("equipements");

    if (equipementsCount) {
        equipementsCount.textContent = equipements.length;
    }

}


// ==================================================
// 4. MISE À JOUR DE LA CARTE STOCK
// ==================================================

function afficherNombreArticles() {

    const articles = recupererDonnees("articles");

    if (stockCount) {
        const totalStock = articles.reduce(function (total, article) {
          return total + article.quantite;
        }, 0);

        stockCount.textContent = totalStock;
    }

}


// ==================================================
// 5. MISE À JOUR DE LA CARTE INTERVENTIONS
// ==================================================

function afficherNombreInterventions() {

    const interventions = recupererDonnees("interventions");

    if (interventionsCount) {
        interventionsCount.textContent = interventions.length;
    }

}


// ==================================================
// 6. MISE À JOUR DE LA CARTE TÂCHES
// ==================================================

function afficherNombreTaches() {

    const taches = recupererDonnees("taches");

    if (tasksCount) {
        tasksCount.textContent = taches.length;
    }

}


// ==================================================
// 7. INITIALISATION DU TABLEAU DE BORD
// ==================================================

function actualiserTableauDeBord() {

    afficherNombreEquipements();

    afficherNombreArticles();

    afficherNombreInterventions();

    afficherNombreTaches();

}


// Exécuter les fonctions au chargement de la page
actualiserTableauDeBord();


// Gestion de l'ouverture et de la fermeture du menu
const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach(function (item) {
  const lienParent = item.querySelector(":scope > a");
  const submenu = item.querySelector(":scope > .submenu");

  if (lienParent && submenu) {
    // Vérifier si la page actuelle appartient à ce sous-menu
    const liensSousMenu = submenu.querySelectorAll("a");

    liensSousMenu.forEach(function (lien) {
      if (lien.href === window.location.href) {
        item.classList.add("open");
        lien.classList.add("submenu-active");
        item.classList.add("active-menu");
      }
    });

    // Ouvrir ou fermer le sous-menu au clic
    lienParent.addEventListener("click", function (event) {
      event.preventDefault();
      item.classList.toggle("open");
    });
  }
});





