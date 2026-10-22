// ==================================================
// 1. RÉCUPÉRATION DES ÉLÉMENTS HTML
// ==================================================

// Éléments du formulaire d'ajout d'article
const stockForm = document.querySelector("#stockForm");

const designationInput = document.querySelector("#designation");
const categorieInput = document.querySelector("#categorie");
const marqueInput = document.querySelector("#marque");
const quantiteInput = document.querySelector("#quantite");
const seuilInput = document.querySelector("#seuil");
const uniteInput = document.querySelector("#unite");
const emplacementInput = document.querySelector("#emplacement");
const fournisseurInput = document.querySelector("#fournisseur");
const descriptionInput = document.querySelector("#description");

// Éléments de la page de liste des articles
const articlesTable = document.querySelector("#articlesTable");
const emptyArticles = document.querySelector("#emptyArticles");
const searchArticle = document.querySelector("#searchArticle");
const filterCategorie = document.querySelector("#filterCategorie");


// ==================================================
// 2. RÉCUPÉRATION DES ARTICLES ENREGISTRÉS
// ==================================================

function recupererArticles() {
    return JSON.parse(localStorage.getItem("articles")) || [];
}


// ==================================================
// 3. ENREGISTREMENT D'UN NOUVEL ARTICLE
// ==================================================

if (stockForm) {

    stockForm.addEventListener("submit", function(event) {

        // Empêcher le rechargement de la page
        event.preventDefault();

        // Récupération des valeurs saisies
        const designation = designationInput.value.trim();
        const categorie = categorieInput.value;
        const marque = marqueInput.value.trim();
        const quantite = Number(quantiteInput.value);
        const seuil = Number(seuilInput.value);
        const unite = uniteInput.value;
        const emplacement = emplacementInput.value.trim();
        const fournisseur = fournisseurInput.value.trim();
        const description = descriptionInput.value.trim();

        // Vérification des champs obligatoires
        if (
            designation === "" ||
            quantiteInput.value === "" ||
            seuilInput.value === ""
        ) {
            alert("Veuillez remplir la désignation, la quantité et le seuil d'alerte.");
            return;
        }

        // Vérification des valeurs numériques
        if (quantite < 0 || seuil < 0) {
            alert("La quantité et le seuil doivent être positifs ou égaux à zéro.");
            return;
        }

        // Création de l'objet article
        const article = {
            id: Date.now(),
            designation: designation,
            categorie: categorie,
            marque: marque,
            quantite: quantite,
            seuil: seuil,
            unite: unite,
            emplacement: emplacement,
            fournisseur: fournisseur,
            description: description
        };

        // Récupération des articles déjà enregistrés
        const articles = recupererArticles();

        // Ajout du nouvel article dans le tableau
        articles.push(article);

        // Enregistrement du tableau dans localStorage
        localStorage.setItem("articles", JSON.stringify(articles));

        // Message de confirmation
        alert("Article ajouté avec succès !");

        // Réinitialisation du formulaire
        stockForm.reset();

    });

}


// ==================================================
// 4. AFFICHAGE DES ARTICLES
// ==================================================

function afficherArticles(listeArticles) {

    // Vérifier si le tableau existe sur la page actuelle
    if (!articlesTable) {
        return;
    }

    // Vider le tableau avant d'afficher les articles
    articlesTable.innerHTML = "";

    // Afficher un message si aucun article n'existe
    if (listeArticles.length === 0) {

        if (emptyArticles) {
            emptyArticles.style.display = "block";
        }

        return;
    }

    // Masquer le message lorsque des articles existent
    if (emptyArticles) {
        emptyArticles.style.display = "none";
    }

    // Parcourir la liste des articles
    listeArticles.forEach(function(article) {

        // Créer une ligne du tableau
        const ligne = document.createElement("tr");

        // Ajouter les informations de l'article dans la ligne
        ligne.innerHTML = `
            <td>${article.designation}</td>
            <td>${article.categorie}</td>
            <td>${article.marque || "-"}</td>
            <td>${article.quantite}</td>
            <td>${article.seuil}</td>
            <td>${article.unite}</td>
            <td>${article.emplacement || "-"}</td>
            <td>${article.fournisseur || "-"}</td>
            <td>
                <button type="button"
                        class="edit"
                        data-id="${article.id}">
                    Modifier
                </button>

                <button type="button"
                        class="delete"
                        data-id="${article.id}">
                    Supprimer
                </button>
            </td>
        `;

        // Ajouter la ligne au tableau HTML
        articlesTable.appendChild(ligne);

    });

}


// ==================================================
// 5. RECHERCHE ET FILTRAGE DES ARTICLES
// ==================================================

function rechercherEtFiltrerArticles() {

    // Récupérer tous les articles enregistrés
    const articles = recupererArticles();

    // Récupérer le texte saisi dans la recherche
    const recherche = searchArticle
        ? searchArticle.value.trim().toLowerCase()
        : "";

    // Récupérer la catégorie sélectionnée
    const categorieSelectionnee = filterCategorie
        ? filterCategorie.value
        : "";

    // Filtrer les articles selon la recherche et la catégorie
    const articlesFiltres = articles.filter(function(article) {

        const correspondRecherche =
            article.designation.toLowerCase().includes(recherche) ||
            (article.marque || "").toLowerCase().includes(recherche) ||
            (article.fournisseur || "").toLowerCase().includes(recherche);

        const correspondCategorie =
            categorieSelectionnee === "" ||
            article.categorie === categorieSelectionnee;

        return correspondRecherche && correspondCategorie;

    });

    // Afficher uniquement les articles correspondants
    afficherArticles(articlesFiltres);

}


// ==================================================
// 6. SUPPRESSION D'UN ARTICLE
// ==================================================

if (articlesTable) {

    articlesTable.addEventListener("click", function(event) {

        // Vérifier si le bouton Supprimer a été cliqué
        if (event.target.classList.contains("btn-supprimer")) {

            // Récupérer l'identifiant de l'article
            const id = Number(event.target.dataset.id);

            // Demander confirmation avant la suppression
            const confirmation = confirm(
                "Voulez-vous vraiment supprimer cet article ?"
            );

            if (confirmation) {

                // Récupérer tous les articles
                const articles = recupererArticles();

                // Garder les articles dont l'identifiant est différent
                const nouveauxArticles = articles.filter(function(article) {
                    return article.id !== id;
                });

                // Enregistrer la nouvelle liste
                localStorage.setItem(
                    "articles",
                    JSON.stringify(nouveauxArticles)
                );

                // Actualiser l'affichage
                rechercherEtFiltrerArticles();

            }

        }

    });

}


// ==================================================
// 7. MODIFICATION D'UN ARTICLE
// ==================================================

if (articlesTable) {

    articlesTable.addEventListener("click", function(event) {

        // Vérifier si le bouton Modifier a été cliqué
        if (event.target.classList.contains("btn-modifier")) {

            // Récupérer l'identifiant de l'article
            const id = Number(event.target.dataset.id);

            // Récupérer tous les articles
            const articles = recupererArticles();

            // Chercher l'article correspondant à cet identifiant
            const article = articles.find(function(element) {
                return element.id === id;
            });

            if (article) {

                // Enregistrer temporairement l'article à modifier
                localStorage.setItem(
                    "articleAModifier",
                    JSON.stringify(article)
                );

                // Ouvrir le formulaire
                window.location.href = "stock.html";

            }

        }

    });

}


// ==================================================
// 8. REMPLISSAGE DU FORMULAIRE EN MODE MODIFICATION
// ==================================================

if (stockForm) {

    const articleAModifier = JSON.parse(
        localStorage.getItem("articleAModifier")
    );

    if (articleAModifier) {

        // Remplir le formulaire avec les anciennes informations
        designationInput.value = articleAModifier.designation;
        categorieInput.value = articleAModifier.categorie;
        marqueInput.value = articleAModifier.marque;
        quantiteInput.value = articleAModifier.quantite;
        seuilInput.value = articleAModifier.seuil;
        uniteInput.value = articleAModifier.unite;
        emplacementInput.value = articleAModifier.emplacement;
        fournisseurInput.value = articleAModifier.fournisseur;
        descriptionInput.value = articleAModifier.description;

        // Modifier le texte du bouton Enregistrer
        const boutonEnregistrer = stockForm.querySelector(
            'button[type="submit"]'
        );

        if (boutonEnregistrer) {
            boutonEnregistrer.textContent = "Enregistrer les modifications";
        }

    }

}


// ==================================================
// 9. ENREGISTREMENT DES MODIFICATIONS
// ==================================================

if (stockForm) {

    stockForm.addEventListener("submit", function(event) {

        // Vérifier si un article est en cours de modification
        const articleAModifier = JSON.parse(
            localStorage.getItem("articleAModifier")
        );

        // Si aucun article n'est en modification, ne rien faire ici
        if (!articleAModifier) {
            return;
        }

        // Empêcher le rechargement de la page
        event.preventDefault();

        // Récupérer les articles enregistrés
        const articles = recupererArticles();

        // Chercher l'article à modifier
        const index = articles.findIndex(function(article) {
            return article.id === articleAModifier.id;
        });

        if (index !== -1) {

            // Remplacer les anciennes informations par les nouvelles
            articles[index] = {
                id: articleAModifier.id,
                designation: designationInput.value.trim(),
                categorie: categorieInput.value,
                marque: marqueInput.value.trim(),
                quantite: Number(quantiteInput.value),
                seuil: Number(seuilInput.value),
                unite: uniteInput.value,
                emplacement: emplacementInput.value.trim(),
                fournisseur: fournisseurInput.value.trim(),
                description: descriptionInput.value.trim()
            };

            // Enregistrer les modifications
            localStorage.setItem("articles", JSON.stringify(articles));

            // Supprimer l'article temporaire
            localStorage.removeItem("articleAModifier");

            alert("Article modifié avec succès !");

            // Retourner à la liste des articles
            window.location.href = "listeart.html";

        }

    });

}


// ==================================================
// 10. INITIALISATION DE LA PAGE LISTE
// ==================================================

if (articlesTable) {

    // Afficher les articles dès l'ouverture de la page
    rechercherEtFiltrerArticles();

    // Recherche pendant la saisie
    if (searchArticle) {
        searchArticle.addEventListener(
            "input",
            rechercherEtFiltrerArticles
        );
    }

    // Filtrage lorsque la catégorie change
    if (filterCategorie) {
        filterCategorie.addEventListener(
            "change",
            rechercherEtFiltrerArticles
        );
    }

}

