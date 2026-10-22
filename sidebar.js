// 1. Récupérer l'emplacement du sidebar
const sidebarContainer = document.querySelector("#sidebar-container");

// 2. Charger le fichier sidebar.html
if (sidebarContainer) {

    fetch("sidebar.html")

        .then(function (response) {

            if (!response.ok) {
                throw new Error("Impossible de charger le sidebar");
            }

            return response.text();

        })

        .then(function (data) {

            // Insérer le sidebar dans la page
            sidebarContainer.innerHTML = data;

            // Activer le lien de la page actuelle
            activerSidebar();

            // Gérer l'ouverture des sous-menus
            gererSousMenus();

        })

        .catch(function (erreur) {

            console.error("Erreur :", erreur);

        });
}


// 3. Activer le lien correspondant à la page actuelle
function activerSidebar() {

    // Récupérer le nom du fichier actuel
    let pageActuelle = window.location.pathname.split("/").pop();

    // Si le nom est vide, considérer index.html comme page actuelle
    if (pageActuelle === "") {
        pageActuelle = "index.html";
    }

    // Récupérer tous les liens du sidebar
    const liens = document.querySelectorAll("#sidebar-container .menu a");

    liens.forEach(function (lien) {

        // Récupérer la destination du lien
        const destination = lien.getAttribute("href");

        // Ignorer les liens qui ne dirigent pas vers une page
        if (!destination || destination === "#") {
            return;
        }

        // Comparer le nom de la page avec la destination
        const nomDestination = destination.split("/").pop().split("?")[0];

        if (nomDestination === pageActuelle) {

            // Activer le lien correspondant
            lien.classList.add("active");

            // Vérifier si le lien appartient à un sous-menu
            const sousMenu = lien.closest(".submenu");

            if (sousMenu) {

                // Récupérer le menu parent
                const menuParent = lien.closest(".menu-item");

                if (menuParent) {

                    // Garder le sous-menu ouvert
                    menuParent.classList.add("open");

                    // Activer la rubrique parent
                    menuParent.classList.add("active-menu");

                    // Activer visuellement le lien du sous-menu
                    lien.classList.add("submenu-active");

                }

            }

        }

    });

}


// 4. Gérer les clics sur les rubriques du menu
function gererSousMenus() {

    const menuItems = document.querySelectorAll(
        "#sidebar-container .menu-item"
    );

    menuItems.forEach(function (item) {

        // Récupérer le lien principal de la rubrique
        const lienParent = item.querySelector(":scope > a");

        // Récupérer le sous-menu
        const sousMenu = item.querySelector(":scope > .submenu");

        // Vérifier que les deux éléments existent
        if (lienParent && sousMenu) {

            lienParent.addEventListener("click", function (event) {

                // Empêcher le lien # de changer de page
                event.preventDefault();

                // Si la rubrique correspond à la page actuelle,
                // garder son sous-menu ouvert
                if (item.classList.contains("active-menu")) {
                    item.classList.add("open");
                } else {

                    // Sinon, ouvrir ou fermer le sous-menu
                    item.classList.toggle("open");

                }

            });

        }

    });

}