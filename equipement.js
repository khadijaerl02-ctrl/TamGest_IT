// 1. Récupération des éléments HTML

const formulaire = document.querySelector("form");

const nomInput = document.querySelector("#nom");
const typeInput = document.querySelector("#type");
const marqueInput = document.querySelector("#Marque");
const snInput = document.querySelector("#sn");
const departementInput = document.querySelector("#departement");
const utilisateurInput = document.querySelector("#Utilisateur");

const odInput = document.querySelector("#od");
const antivirusInput = document.querySelector("#av");
const domaineInput = document.querySelector("#domaine");
const etatInput = document.querySelector("#etat");
const wifiInput = document.querySelector("#wifi");
const dateAchatInput = document.querySelector("#dateA");



if (formulaire) {
  //console.log("page ajouter");
  formulaire.addEventListener("submit", function (event) {
    event.preventDefault();

    // 1. Récupération des données
    const nom = nomInput.value.trim();
    const type = typeInput.value;
    const marque = marqueInput.value.trim();
    const numeroSerie = snInput.value.trim();
    const departement = departementInput.value;
    const utilisateur = utilisateurInput.value.trim();

    const oneDrive = odInput.value;
    const antivirus = antivirusInput.value;
    const domaine = domaineInput.value;
    const etat = etatInput.value;
    const wifi = wifiInput.value.trim();
    const dateAchat = dateAchatInput.value;

    // 2. Validation des données
    if (nom === "" || numeroSerie === "") {
      alert("Veuillez remplir le nom et le numéro de série.");
      return;
    }

    // 3. Création de l'objet équipement
    const equipement = {
      nom: nom,
      type: type,
      marque: marque,
      numeroSerie: numeroSerie,
      departement: departement,
      utilisateur: utilisateur,
      oneDrive: oneDrive,
      antivirus: antivirus,
      domaine: domaine,
      etat: etat,
      wifi: wifi,
      dateAchat: dateAchat,
    };

    // 4. Récupération des équipements enregistrés

    let equipements = recupererEquipements();

    // 5. Vérifier si nous sommes en mode modification
    const numeroSerieAModifier = localStorage.getItem("equipementAModifier");

    if (numeroSerieAModifier) {
      // Chercher l'équipement à modifier
      const index = equipements.findIndex(function (element) {
        return element.numeroSerie === numeroSerieAModifier;
      });

      // Vérifier si l'équipement existe
      if (index !== -1) {
        // Vérifier si le nouveau numéro de série existe déjà
        const existe = equipements.some(function (element, i) {
          return (
            i !== index &&
            element.numeroSerie.toLowerCase() === numeroSerie.toLowerCase()
          );
        });

        if (existe) {
          alert("Ce numéro de série existe déjà !");
          return;
        }

        // Remplacer l'ancien équipement par le nouveau
        equipements[index] = equipement;

        alert("Équipement modifié avec succès !");
      } else {
        alert("Équipement introuvable !");
        return;
      }

      // Supprimer le mode modification
      localStorage.removeItem("equipementAModifier");
    } else {
      // Mode ajout : vérifier si le numéro de série existe déjà
      const existe = equipements.some(function (element) {
        return element.numeroSerie.toLowerCase() === numeroSerie.toLowerCase();
      });

      if (existe) {
        alert("Ce numéro de série existe déjà !");
        return;
      }

      // Ajouter le nouvel équipement
      equipements.push(equipement);

      alert("Équipement ajouté avec succès !");
    }

    // 6. Enregistrer les modifications dans localStorage
    localStorage.setItem("equipements", JSON.stringify(equipements));

    // 7. Réinitialiser le formulaire
    formulaire.reset();

    //console.log(equipements);
  });
}

// Récupération des éléments de la page Liste

const equipementsTable = document.querySelector("#equipementsTable");
const emptyMessage = document.querySelector("#emptyMessage");
const searchInput = document.querySelector("#searchInput");
const filterType = document.querySelector("#filterType");
const filterEtat = document.querySelector("#filterEtat");

function afficherEquipements(liste) {
  if (!equipementsTable) {
    return;
  }

  equipementsTable.innerHTML = "";

  liste.forEach(function (equipement) {
    const ligne = document.createElement("tr");

    ligne.innerHTML = `
            <td>${equipement.nom}</td>
            <td>${equipement.type}</td>
            <td>${equipement.marque}</td>
            <td>${equipement.departement}</td>
            <td>${equipement.utilisateur}</td>
            <td>${equipement.etat}</td>
            <td>${equipement.numeroSerie}</td>
            <td>${equipement.antivirus}</td>
            <td>${equipement.domaine}</td>
            <td>${equipement.wifi}</td>
            <td>${equipement.dateAchat}</td>

            <td>
                <button class="edit" data-id="${equipement.numeroSerie}">
                    Modifier
                </button>

                <button class="delete" data-id="${equipement.numeroSerie}">
                   Supprimer
                </button>
            </td>
            
        `;

    equipementsTable.appendChild(ligne);
  });

  if (emptyMessage) {
    emptyMessage.style.display = liste.length === 0 ? "block" : "none";
  }
}

// Récupérer les équipements enregistrés
function recupererEquipements() {
  return JSON.parse(localStorage.getItem("equipements")) || [];
}

// Filtrer et rechercher les équipements
function rechercherEtFiltrer() {
  const equipements = recupererEquipements();

  // Récupérer les valeurs des filtres
  const recherche = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const typeChoisi = filterType ? filterType.value : "";
  const etatChoisi = filterEtat ? filterEtat.value : "";

  // Filtrer les équipements
  const resultats = equipements.filter(function (equipement) {
    
    return equipement.nom.toLowerCase().includes(recherche)
        && (typeChoisi === "" || equipement.type === typeChoisi)
        && (etatChoisi === "" || equipement.etat === etatChoisi);        
  });

  // Afficher les résultats
  afficherEquipements(resultats);
}

// Afficher tous les équipements au chargement de la page
if (equipementsTable) {
  rechercherEtFiltrer();
}

// Recherche lorsque l'utilisateur écrit
if (searchInput) {
  searchInput.addEventListener("input", rechercherEtFiltrer);
}

// Filtrer par type
if (filterType) {
  filterType.addEventListener("change", rechercherEtFiltrer);
}

// Filtrer par état
if (filterEtat) {
  filterEtat.addEventListener("change", rechercherEtFiltrer);
}

// Supprimer un équipement
function supprimerEquipement(numeroSerie) {
  const confirmation = confirm(
    "Voulez-vous vraiment supprimer cet équipement ?",
  );

  if (!confirmation) {
    return;
  }

  let equipements = recupererEquipements();

  equipements = equipements.filter(function (equipement) {
    return equipement.numeroSerie !== numeroSerie;
  });

  localStorage.setItem("equipements", JSON.stringify(equipements));

  rechercherEtFiltrer();

  alert("Équipement supprimé avec succès !");
}

// Gérer les clics sur les boutons Supprimer
if (equipementsTable) {
  equipementsTable.addEventListener("click", function (event) {
    // Modifier un équipement
    if (event.target.classList.contains("edit")) {
      const numeroSerie = event.target.dataset.id;

      localStorage.setItem("equipementAModifier", numeroSerie);

      window.location.href = "ajouter-equipement.html";
    }

    // Supprimer un équipement
    if (event.target.classList.contains("delete")) {
      const numeroSerie = event.target.dataset.id;

      supprimerEquipement(numeroSerie);
    }
  });
}
// Préparer le formulaire de modification
if (formulaire) {
  const numeroSerieAModifier = localStorage.getItem("equipementAModifier");

  if (numeroSerieAModifier) {
    const equipements = recupererEquipements();

    const equipement = equipements.find(function (element) {
      return element.numeroSerie === numeroSerieAModifier;
    });

    if (equipement) {
      nomInput.value = equipement.nom;
      typeInput.value = equipement.type;
      marqueInput.value = equipement.marque;
      snInput.value = equipement.numeroSerie;
      departementInput.value = equipement.departement;
      utilisateurInput.value = equipement.utilisateur;
      odInput.value = equipement.oneDrive;
      antivirusInput.value = equipement.antivirus;
      domaineInput.value = equipement.domaine;
      etatInput.value = equipement.etat;
      wifiInput.value = equipement.wifi;
      dateAchatInput.value = equipement.dateAchat;
    }
  }
}
