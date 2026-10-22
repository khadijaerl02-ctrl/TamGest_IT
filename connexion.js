const loginForm = document.querySelector("#loginForm");
const identifiant = document.querySelector("#identifiant");
const motDePasse = document.querySelector("#motDePasse");
const togglePassword = document.querySelector("#togglePassword");
const messageErreur = document.querySelector("#messageErreur");

// 1. Créer le compte administrateur s'il n'existe pas
let comptes = JSON.parse(localStorage.getItem("comptes")) || [];

const adminExiste = comptes.some(function (compte) {
return compte.role === "admin";
});

if (!adminExiste) {
comptes.push({
identifiant: "admin",
motDePasse: "admin123",
role: "admin",
nom: "Administrateur"
});


localStorage.setItem("comptes", JSON.stringify(comptes));


}

// 2. Afficher ou masquer le mot de passe
togglePassword.addEventListener("click", function () {
if (motDePasse.type === "password") {
motDePasse.type = "text";


    togglePassword.innerHTML =
        '<i class="fa-solid fa-eye-slash"></i>';
} else {
    motDePasse.type = "password";

    togglePassword.innerHTML =
        '<i class="fa-solid fa-eye"></i>';
}


});

// 3. Vérifier les informations de connexion
loginForm.addEventListener("submit", function (event) {
event.preventDefault();
messageErreur.textContent = "";

const identifiantSaisi = identifiant.value.trim();
const motDePasseSaisi = motDePasse.value;

const compteTrouve = comptes.find(function (compte) {
    return compte.identifiant === identifiantSaisi &&
           compte.motDePasse === motDePasseSaisi;
});

if (compteTrouve) {

    // Enregistrer le compte connecté
    localStorage.setItem(
        "sessionUtilisateur",
        JSON.stringify({
            identifiant: compteTrouve.identifiant,
            nom: compteTrouve.nom,
            role: compteTrouve.role
        })
    );

    // Ouvrir le tableau de bord
    window.location.href = "index.html";

} else {
    messageErreur.textContent =
        "Identifiant ou mot de passe incorrect.";
}


});


