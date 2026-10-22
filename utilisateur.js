// 1. Récupération des éléments HTML

const formulaire = document.querySelector("form");

const matriculeInput = document.querySelector("#matricule");
const nomInput = document.querySelector("#nom");
const prenomInput = document.querySelector("#prenom");
const posteInput = document.querySelector("#poste");
const departementInput = document.querySelector("#departement");
const emailInput = document.querySelector("#email");
const telephoneInput = document.querySelector("#telephone");
const bureauInput = document.querySelector("#bureau");
const dateEmbaucheInput = document.querySelector("#dateEmbauche");
const statutInput = document.querySelector("#statut");
const remarqueInput = document.querySelector("#remarque");

if (formulaire) {
  formulaire.addEventListener("submit", function (event) {
    event.preventDefault();

    // 1. Récupération des données
    const matricule = matriculeInput.value.trim();
    const nom = nomInput.value.trim();
    const prenom = prenomInput.value.trim();
    const poste = posteInput.value.trim();
    const departement = departementInput.value;
    const email = emailInput.value.trim();
    const telephone = telephoneInput.value.trim();
    const bureau = bureauInput.value.trim();
    const dateEmbauche = dateEmbaucheInput.value;
    const statut = statutInput.value;
    const remarque = remarqueInput.value.trim();

    // 2. Validation des données
    if (matricule === "" || nom === "") {
      alert("Veuillez remplir le matricule et le nom.");
      return;
    }

    // 3. Création de l'objet utilisateur
    const utilisateur = {
      matricule: matricule,
      nom: nom,
      prenom: prenom,
      poste: poste,
      departement: departement,
      email: email,
      telephone: telephone,
      bureau: bureau,
      dateEmbauche: dateEmbauche,
      statut: statut,
      remarque: remarque,
    };

    // 4. Récupération des utilisateurs enregistrés
    let utilisateurs = recupererUtilisateurs();

    // 5. Vérifier si nous sommes en mode modification
    const matriculeAModifier = localStorage.getItem("matriculeAModifier");

    if (matriculeAModifier) {
      // Chercher l'utilisateur à modifier
      const index = utilisateurs.findIndex(function (element) {
        return element.matricule === matriculeAModifier;
      });

      // Remplacer l'ancien utilisateur par le nouveau
      if (index !== -1) {
        utilisateurs[index] = utilisateur;

        alert("Utilisateur modifié avec succès !");
      }

      // Supprimer le mode modification
      localStorage.removeItem("matriculeAModifier");
    } else {
      // Mode ajout : vérifier si le matricule existe déjà
      const existe = utilisateurs.some(function (element) {
        return element.matricule.toLowerCase() === matricule.toLowerCase();
      });

      if (existe) {
        alert("Ce matricule existe déjà !");
        return;
      }

      // Ajouter le nouvel utilisateur
      utilisateurs.push(utilisateur);

      alert("Utilisateur ajouté avec succès !");
    }

    // 6. Enregistrer les modifications dans localStorage
    localStorage.setItem("utilisateurs", JSON.stringify(utilisateurs));

    // 7. Réinitialiser le formulaire
    formulaire.reset();

    // 8. Retourner à la liste des utilisateurs
    window.location.href = "listeuser.html";
  });
}

// Récupération des éléments de la page Liste

const usersTable = document.querySelector("#usersTable");
const emptyMessage = document.querySelector("#emptyMessage");
const searchUser = document.querySelector("#searchUser");
const filterDepartement = document.querySelector("#filterDepartement");
const filterStatut = document.querySelector("#filterStatut");

function afficherUtilisateurs(liste) {
  if (!usersTable) {
    return;
  }

  usersTable.innerHTML = "";

  liste.forEach(function (utilisateur) {
    const ligne = document.createElement("tr");

    // Compter les équipements affectés à cet utilisateur
    const equipements = recupererEquipements();

    const nombreEquipements = equipements.filter(function (element) {
      return element.utilisateur === utilisateur.prenom + " " + utilisateur.nom;
    }).length;

    ligne.innerHTML = `
            <td>${utilisateur.matricule}</td>
            <td>${utilisateur.nom}</td>
            <td>${utilisateur.prenom}</td>
            <td>${utilisateur.departement}</td>
            <td>${utilisateur.poste}</td>
            <td>${utilisateur.email}</td>
            <td>${utilisateur.telephone}</td>
            <td>${utilisateur.statut}</td>
            <td>${nombreEquipements} appareil(s)</td>

            <td>
                <button class="edit" data-id="${utilisateur.matricule}">
                    Modifier
                </button>

                <button class="delete" data-id="${utilisateur.matricule}">
                    Supprimer
                </button>
            </td>
            
        `;

    usersTable.appendChild(ligne);
  });

  if (emptyMessage) {
    emptyMessage.style.display = liste.length === 0 ? "block" : "none";
  }
}

// Récupérer les utilisateurs enregistrés
function recupererUtilisateurs() {
  return JSON.parse(localStorage.getItem("utilisateurs")) || [];
}

// Récupérer les équipements enregistrés
function recupererEquipements() {
  return JSON.parse(localStorage.getItem("equipements")) || [];
}

// Filtrer et rechercher les utilisateurs
function rechercherEtFiltrer() {
  const utilisateurs = recupererUtilisateurs();

  // Récupérer les valeurs des filtres
  const recherche = searchUser ? searchUser.value.toLowerCase().trim() : "";
  const departementChoisi = filterDepartement ? filterDepartement.value : "";
  const statutChoisi = filterStatut ? filterStatut.value : "";

  // Filtrer les utilisateurs
  const resultats = utilisateurs.filter(function (utilisateur) {
    return (
      (utilisateur.nom.toLowerCase().includes(recherche) ||
        utilisateur.prenom.toLowerCase().includes(recherche) ||
        utilisateur.matricule.toLowerCase().includes(recherche) ||
        utilisateur.email.toLowerCase().includes(recherche)) &&
      (departementChoisi === "" ||
        utilisateur.departement === departementChoisi) &&
      (statutChoisi === "" || utilisateur.statut === statutChoisi)
    );
  });

  // Afficher les résultats
  afficherUtilisateurs(resultats);
}

// Afficher tous les utilisateurs au chargement de la page
if (usersTable) {
  rechercherEtFiltrer();
}

// Recherche lorsque l'utilisateur écrit
if (searchUser) {
  searchUser.addEventListener("input", rechercherEtFiltrer);
}

// Filtrer par département
if (filterDepartement) {
  filterDepartement.addEventListener("change", rechercherEtFiltrer);
}

// Filtrer par statut
if (filterStatut) {
  filterStatut.addEventListener("change", rechercherEtFiltrer);
}

// Supprimer un utilisateur
function supprimerUtilisateur(matricule) {
  const confirmation = confirm(
    "Voulez-vous vraiment supprimer cet utilisateur ?",
  );

  if (!confirmation) {
    return;
  }

  let utilisateurs = recupererUtilisateurs();

  utilisateurs = utilisateurs.filter(function (utilisateur) {
    return utilisateur.matricule !== matricule;
  });

  localStorage.setItem("utilisateurs", JSON.stringify(utilisateurs));

  rechercherEtFiltrer();

  alert("Utilisateur supprimé avec succès !");
}

// Gérer les clics sur les boutons Modifier / Supprimer
if (usersTable) {
  usersTable.addEventListener("click", function (event) {
    // Modifier un utilisateur
    if (event.target.classList.contains("edit")) {
      const matricule = event.target.dataset.id;

      localStorage.setItem("matriculeAModifier", matricule);

      window.location.href = "utilisateur.html";
    }

    // Supprimer un utilisateur
    if (event.target.classList.contains("delete")) {
      const matricule = event.target.dataset.id;

      supprimerUtilisateur(matricule);
    }
  });
}

// Préparer le formulaire de modification
if (formulaire) {
  const matriculeAModifier = localStorage.getItem("matriculeAModifier");

  if (matriculeAModifier) {
    const utilisateurs = recupererUtilisateurs();

    const utilisateur = utilisateurs.find(function (element) {
      return element.matricule === matriculeAModifier;
    });

    if (utilisateur) {
      matriculeInput.value = utilisateur.matricule;
      nomInput.value = utilisateur.nom;
      prenomInput.value = utilisateur.prenom;
      posteInput.value = utilisateur.poste;
      departementInput.value = utilisateur.departement;
      emailInput.value = utilisateur.email;
      telephoneInput.value = utilisateur.telephone;
      bureauInput.value = utilisateur.bureau;
      dateEmbaucheInput.value = utilisateur.dateEmbauche;
      statutInput.value = utilisateur.statut;
      remarqueInput.value = utilisateur.remarque;
    }
  }
}
