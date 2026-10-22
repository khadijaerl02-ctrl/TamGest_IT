const sessionUtilisateur = localStorage.getItem("sessionUtilisateur");

if (!sessionUtilisateur) {
  window.location.href = "connexion.html";
}
