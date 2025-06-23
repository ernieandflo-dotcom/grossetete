// textviewer.js

document.addEventListener('DOMContentLoaded', () => {
    const target = document.getElementById('text-content');
  
    function getQueryParam(param) {
      const params = new URLSearchParams(window.location.search);
      return params.get(param);
    }
  
    const filePath = getQueryParam('file');
  
    if (!target) return;
  
    if (filePath) {
      fetch(filePath)
        .then(response => {
          if (!response.ok) throw new Error("Erreur de chargement");
          return response.text();
        })
        .then(text => {
          target.textContent = text;
        })
        .catch(err => {
          target.textContent = "Fichier introuvable ou erreur de chargement.";
        });
    } else {
      target.textContent = "Aucun fichier spécifié.";
    }
  });
  