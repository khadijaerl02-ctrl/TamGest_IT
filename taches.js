// 1. Récupération des éléments HTML du formulaire

const formulaireTache = document.querySelector("#taskForm");

const titreInput = document.querySelector("#titre");
const categorieInput = document.querySelector("#categorie");
const responsableInput = document.querySelector("#responsable");
const prioriteInput = document.querySelector("#priorite");
const dateDebutInput = document.querySelector("#dateDebut");
const dateFinInput = document.querySelector("#dateFin");
const heureInput = document.querySelector("#heure");
const statutInput = document.querySelector("#statut");
const departementInput = document.querySelector("#departement");
const equipementInput = document.querySelector("#equipement");
const descriptionInput = document.querySelector("#description");


// 2. Récupération des tâches enregistrées

function recupererTaches() {
    return JSON.parse(localStorage.getItem("taches")) || [];
}


// 3. Enregistrer une nouvelle tâche ou modifier une tâche existante

if (formulaireTache) {

    formulaireTache.addEventListener("submit", function (event) {

        event.preventDefault();

        // Récupération des données

        const titre = titreInput.value.trim();
        const categorie = categorieInput.value;
        const responsable = responsableInput.value.trim();
        const priorite = prioriteInput.value;
        const dateDebut = dateDebutInput.value;
        const dateFin = dateFinInput.value;
        const heure = heureInput.value;
        const statut = statutInput.value;
        const departement = departementInput.value;
        const equipement = equipementInput.value.trim();
        const description = descriptionInput.value.trim();


        // Validation des données

        if (titre === "" || responsable === "") {
            alert("Veuillez remplir le titre et le responsable.");
            return;
        }

        if (dateDebut !== "" && dateFin !== "" && dateFin < dateDebut) {
            alert("La date d'échéance doit être après la date de début.");
            return;
        }


        // Création de l'objet tâche

        const tache = {
            id: Date.now(),
            titre: titre,
            categorie: categorie,
            responsable: responsable,
            priorite: priorite,
            dateDebut: dateDebut,
            dateFin: dateFin,
            heure: heure,
            statut: statut,
            departement: departement,
            equipement: equipement,
            description: description
        };


        // Récupération des tâches enregistrées

        let taches = recupererTaches();


        // Vérifier si nous sommes en mode modification

        const idTacheAModifier = localStorage.getItem("tacheAModifier");

        if (idTacheAModifier) {

            // Chercher la tâche à modifier

            const index = taches.findIndex(function (element) {
                return element.id === Number(idTacheAModifier);
            });


            // Vérifier si la tâche existe

            if (index !== -1) {

                // Garder le même identifiant

                tache.id = taches[index].id;

                // Remplacer l'ancienne tâche

                taches[index] = tache;

                alert("Tâche modifiée avec succès !");

            } else {

                alert("Tâche introuvable !");
                return;

            }

            // Supprimer le mode modification

            localStorage.removeItem("tacheAModifier");

        } else {

            // Mode ajout : ajouter la nouvelle tâche

            taches.push(tache);

            alert("Tâche ajoutée avec succès !");

        }


        // Enregistrer les tâches dans localStorage

        localStorage.setItem("taches", JSON.stringify(taches));


        // Réinitialiser le formulaire

        formulaireTache.reset();

        // Retourner à la liste des tâches

        window.location.href = "tacheliste.html";

    });

}


// 4. Récupération des éléments HTML de la liste

const tasksTable = document.querySelector("#tasksTable");

const emptyMessage = document.querySelector("#emptyMessage");

const searchTask = document.querySelector("#searchTask");

const filterPriorite = document.querySelector("#filterPriorite");

const filterStatut = document.querySelector("#filterStatut");


// 5. Afficher les tâches dans le tableau

function afficherTaches(liste) {

    if (!tasksTable) {
        return;
    }

    tasksTable.innerHTML = "";

    liste.forEach(function (tache, index) {

        // Calculer le statut affiché

        let statutAffiche = tache.statut;

        if (
            tache.statut !== "Terminée" &&
            tache.statut !== "Annulée" &&
            tache.dateFin !== "" &&
            tache.dateFin < new Date().toISOString().split("T")[0]
        ) {
            statutAffiche = "En retard";
        }


        // Créer une ligne du tableau

        const ligne = document.createElement("tr");

        ligne.innerHTML = `
            <td>${index + 1}</td>

            <td>${tache.titre}</td>

            <td>${tache.responsable}</td>

            <td>${tache.priorite}</td>

            <td>${tache.dateDebut || "-"}</td>

            <td>${tache.dateFin || "-"}</td>

            <td>${statutAffiche}</td>

            <td>
                <button  class="edit" data-id="${tache.id}">
                    Modifier
                </button>

                <button  class="delete" data-id="${tache.id}">
                    Supprimer
                </button>
            </td>
        `;

        tasksTable.appendChild(ligne);

    });


    // Afficher ou masquer le message si la liste est vide

    if (emptyMessage) {
        emptyMessage.style.display = liste.length === 0 ? "block" : "none";
    }

}


// 6. Rechercher et filtrer les tâches

function rechercherEtFiltrerTaches() {

    const taches = recupererTaches();

    // Récupérer les valeurs de recherche et des filtres

    const recherche = searchTask
        ? searchTask.value.toLowerCase().trim()
        : "";

    const prioriteChoisie = filterPriorite
        ? filterPriorite.value
        : "";

    const statutChoisi = filterStatut
        ? filterStatut.value
        : "";


    // Filtrer les tâches

    const resultats = taches.filter(function (tache) {

        let statutAffiche = tache.statut;

        if (
            tache.statut !== "Terminée" &&
            tache.statut !== "Annulée" &&
            tache.dateFin !== "" &&
            tache.dateFin < new Date().toISOString().split("T")[0]
        ) {
            statutAffiche = "En retard";
        }

        return (
            tache.titre.toLowerCase().includes(recherche) &&
            (prioriteChoisie === "" || tache.priorite === prioriteChoisie) &&
            (statutChoisi === "" || statutAffiche === statutChoisi)
        );

    });


    // Afficher les résultats

    afficherTaches(resultats);

}


// 7. Afficher les tâches au chargement de la page

if (tasksTable) {
    rechercherEtFiltrerTaches();
}


// 8. Recherche lorsque l'utilisateur écrit

if (searchTask) {
    searchTask.addEventListener("input", rechercherEtFiltrerTaches);
}


// 9. Filtrer par priorité

if (filterPriorite) {
    filterPriorite.addEventListener("change", rechercherEtFiltrerTaches);
}


// 10. Filtrer par statut

if (filterStatut) {
    filterStatut.addEventListener("change", rechercherEtFiltrerTaches);
}


// 11. Supprimer une tâche

function supprimerTache(id) {

    const confirmation = confirm(
        "Voulez-vous vraiment supprimer cette tâche ?"
    );

    if (!confirmation) {
        return;
    }

    let taches = recupererTaches();

    taches = taches.filter(function (tache) {
        return tache.id !== Number(id);
    });

    localStorage.setItem("taches", JSON.stringify(taches));

    rechercherEtFiltrerTaches();

    alert("Tâche supprimée avec succès !");

}


// 12. Gérer les clics sur les boutons Modifier et Supprimer

if (tasksTable) {

    tasksTable.addEventListener("click", function (event) {

        // Modifier une tâche

        if (event.target.classList.contains("edit")) {

            const id = event.target.dataset.id;

            localStorage.setItem("tacheAModifier", id);

            window.location.href = "tacheajout.html";

        }


        // Supprimer une tâche

        if (event.target.classList.contains("delete")) {

            const id = event.target.dataset.id;

            supprimerTache(id);

        }

    });

}


// 13. Préparer le formulaire en mode modification

if (formulaireTache) {

    const idTacheAModifier = localStorage.getItem("tacheAModifier");

    if (idTacheAModifier) {

        const taches = recupererTaches();

        const tache = taches.find(function (element) {
            return element.id === Number(idTacheAModifier);
        });

        if (tache) {

            titreInput.value = tache.titre;
            categorieInput.value = tache.categorie;
            responsableInput.value = tache.responsable;
            prioriteInput.value = tache.priorite;
            dateDebutInput.value = tache.dateDebut;
            dateFinInput.value = tache.dateFin;
            heureInput.value = tache.heure;
            statutInput.value = tache.statut;
            departementInput.value = tache.departement;
            equipementInput.value = tache.equipement;
            descriptionInput.value = tache.description;

        }

    }

}

