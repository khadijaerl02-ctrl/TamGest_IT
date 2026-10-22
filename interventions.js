// 1. Récupération des éléments HTML du formulaire

const formulaireIntervention = document.querySelector("#interventionForm");

const titreInput = document.querySelector("#titre");
const typeInput = document.querySelector("#type");
const equipementInput = document.querySelector("#equipement");
const technicienInput = document.querySelector("#technicien");
const utilisateurInput = document.querySelector("#utilisateur");
const departementInput = document.querySelector("#departement");
const urgenceInput = document.querySelector("#urgence");
const statutInput = document.querySelector("#statut");
const dateInput = document.querySelector("#date");
const dureeInput = document.querySelector("#duree");
const problemeInput = document.querySelector("#probleme");
const solutionInput = document.querySelector("#solution");


// 2. Récupération des interventions enregistrées

function recupererInterventions() {
    return JSON.parse(localStorage.getItem("interventions")) || [];
}


// 3. Enregistrer une nouvelle intervention ou modifier une intervention

if (formulaireIntervention) {

    formulaireIntervention.addEventListener("submit", function (event) {
      event.preventDefault();

      // Récupération des données

      const titre = titreInput.value.trim();
      const type = typeInput.value;
      const equipement = equipementInput.value.trim();
      const technicien = technicienInput.value.trim();
      const utilisateur = utilisateurInput.value.trim();
      const departement = departementInput.value;
      const urgence = urgenceInput.value;
      const statut = statutInput.value;
      const date = dateInput.value;
      const duree = dureeInput.value.trim();
      const probleme = problemeInput.value.trim();
      const solution = solutionInput.value.trim();

      // Validation des données

      if (titre === "" || equipement === "" || technicien === "") {
        alert("Veuillez remplir le titre, l'équipement et le technicien.");
        return;
      }

      // Création de l'objet intervention

      const intervention = {
        id: Date.now(),
        titre: titre,
        type: type,
        equipement: equipement,
        technicien: technicien,
        utilisateur: utilisateur,
        departement: departement,
        urgence: urgence,
        statut: statut,
        date: date,
        duree: duree,
        probleme: probleme,
        solution: solution,
      };

      // Récupération des interventions enregistrées

      let interventions = recupererInterventions();

      // Vérifier si nous sommes en mode modification

      const idInterventionAModifier = localStorage.getItem(
        "interventionAModifier",
      );

      if (idInterventionAModifier) {
        // Chercher l'intervention à modifier

        const index = interventions.findIndex(function (element) {
          return element.id === Number(idInterventionAModifier);
        });

        // Vérifier si l'intervention existe

        if (index !== -1) {
          // Garder le même identifiant

          intervention.id = interventions[index].id;

          // Remplacer l'ancienne intervention

          interventions[index] = intervention;

          alert("Intervention modifiée avec succès !");
        } else {
          alert("Intervention introuvable !");
          return;
        }

        // Supprimer le mode modification

        localStorage.removeItem("interventionAModifier");
      } else {
        // Mode ajout : ajouter la nouvelle intervention

        interventions.push(intervention);

        alert("Intervention ajoutée avec succès !");
      }

      // Enregistrer les interventions dans localStorage

      localStorage.setItem("interventions", JSON.stringify(interventions));

      // Synchroniser le statut de la tâche correspondante
      synchroniserStatutTache(intervention);

      // Réinitialiser le formulaire

      formulaireIntervention.reset();

      // Retourner à la liste des interventions

      window.location.href = "intervliste.html";
    });

}


// 4. Récupération des éléments HTML de la liste

const interventionsTable = document.querySelector("#interventionsTable");

const emptyMessageIntervention = document.querySelector("#emptyMessage");

const searchIntervention = document.querySelector("#searchIntervention");

const filterStatutIntervention = document.querySelector("#filterStatut");

const filterTypeIntervention = document.querySelector("#filterType");


// 5. Afficher les interventions dans le tableau

function afficherInterventions(liste) {

    if (!interventionsTable) {
        return;
    }

    interventionsTable.innerHTML = "";

    liste.forEach(function (intervention, index) {

        // Création d'une ligne du tableau

        const ligne = document.createElement("tr");

        ligne.innerHTML = `
            <td>${index + 1}</td>

            <td>${intervention.equipement}</td>

            <td>${intervention.technicien}</td>

            <td>${intervention.type}</td>

            <td>${intervention.date || "-"}</td>

            <td>${intervention.duree || "-"}</td>

            <td>${intervention.statut}</td>

            <td>
                <button type="button" class="edit"
                    data-id="${intervention.id}">
                    Modifier
                </button>
          
                <button type="button" class="delete"
                    data-id="${intervention.id}">
                    Supprimer
                </button>
            </td>
        `;

        interventionsTable.appendChild(ligne);

    });


    // Afficher ou masquer le message si la liste est vide

    if (emptyMessageIntervention) {
        emptyMessageIntervention.style.display =
            liste.length === 0 ? "block" : "none";
    }

}


// 6. Rechercher et filtrer les interventions

function rechercherEtFiltrerInterventions() {

    const interventions = recupererInterventions();


    // Récupérer les valeurs de recherche et des filtres

    const recherche = searchIntervention
        ? searchIntervention.value.toLowerCase().trim()
        : "";

    const statutChoisi = filterStatutIntervention
        ? filterStatutIntervention.value
        : "";

    const typeChoisi = filterTypeIntervention
        ? filterTypeIntervention.value
        : "";


    // Filtrer les interventions

    const resultats = interventions.filter(function (intervention) {

        return (

            (
                intervention.titre.toLowerCase().includes(recherche) ||
                intervention.equipement.toLowerCase().includes(recherche) ||
                intervention.technicien.toLowerCase().includes(recherche)
            )

            &&

            (statutChoisi === "" || intervention.statut === statutChoisi)

            &&

            (typeChoisi === "" || intervention.type === typeChoisi)

        );

    });


    // Afficher les résultats

    afficherInterventions(resultats);

}


// 7. Afficher toutes les interventions au chargement de la page

if (interventionsTable) {
    rechercherEtFiltrerInterventions();
}


// 8. Recherche lorsque l'utilisateur écrit

if (searchIntervention) {
    searchIntervention.addEventListener(
        "input",
        rechercherEtFiltrerInterventions
    );
}


// 9. Filtrer par statut

if (filterStatutIntervention) {
    filterStatutIntervention.addEventListener(
        "change",
        rechercherEtFiltrerInterventions
    );
}


// 10. Filtrer par type

if (filterTypeIntervention) {
    filterTypeIntervention.addEventListener(
        "change",
        rechercherEtFiltrerInterventions
    );
}


// 11. Supprimer une intervention

function supprimerIntervention(id) {

    const confirmation = confirm(
        "Voulez-vous vraiment supprimer cette intervention ?"
    );

    if (!confirmation) {
        return;
    }

    let interventions = recupererInterventions();

    interventions = interventions.filter(function (intervention) {
        return intervention.id !== Number(id);
    });


    // Enregistrer la nouvelle liste

    localStorage.setItem(
        "interventions",
        JSON.stringify(interventions)
    );



    // Actualiser le tableau

    rechercherEtFiltrerInterventions();

    alert("Intervention supprimée avec succès !");

}

function synchroniserStatutTache(intervention) {
  // Récupérer les tâches enregistrées
  let taches = JSON.parse(localStorage.getItem("taches")) || [];

  // Chercher les tâches ayant le même titre
  taches.forEach(function (tache) {
    if (
      tache.titre.trim().toLowerCase() ===
      intervention.titre.trim().toLowerCase()
    ) {
      // Synchroniser le statut de la tâche
      if (intervention.statut === "En attente") {
        tache.statut = "À faire";
      } else {
        tache.statut = intervention.statut;
      }
    }
  });

  // Enregistrer les tâches mises à jour
  localStorage.setItem("taches", JSON.stringify(taches));
}

// 12. Gérer les clics sur Modifier et Supprimer

if (interventionsTable) {

    interventionsTable.addEventListener("click", function (event) {

        // Modifier une intervention

        if (event.target.classList.contains("edit-intervention")) {

            const id = event.target.dataset.id;

            localStorage.setItem("interventionAModifier", id);

            window.location.href = "intervajout.html";

        }


        // Supprimer une intervention

        if (event.target.classList.contains("delete-intervention")) {

            const id = event.target.dataset.id;

            supprimerIntervention(id);

        }

    });

}


// 13. Préparer le formulaire en mode modification

if (formulaireIntervention) {

    const idInterventionAModifier =
        localStorage.getItem("interventionAModifier");


    if (idInterventionAModifier) {

        const interventions = recupererInterventions();

        const intervention = interventions.find(function (element) {

            return element.id === Number(idInterventionAModifier);

        });


        if (intervention) {

            titreInput.value = intervention.titre;
            typeInput.value = intervention.type;
            equipementInput.value = intervention.equipement;
            technicienInput.value = intervention.technicien;
            utilisateurInput.value = intervention.utilisateur;
            departementInput.value = intervention.departement;
            urgenceInput.value = intervention.urgence;
            statutInput.value = intervention.statut;
            dateInput.value = intervention.date;
            dureeInput.value = intervention.duree;
            problemeInput.value = intervention.probleme;
            solutionInput.value = intervention.solution;

        }

    }

}

