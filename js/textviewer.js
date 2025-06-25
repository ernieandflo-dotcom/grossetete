document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const filePath = params.get('file');
  const container = document.getElementById('file-content');

  if (!filePath || !container) {
    container.textContent = "Fichier introuvable ou chemin non précisé.";
    return;
  }

  fetch(filePath)
    .then(response => {
      if (!response.ok) throw new Error("Échec du chargement");
      return response.text();
    })
    .then(text => {
      // Preserve line breaks safely
      const escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      container.innerHTML = '<pre>' + escaped + '</pre>';
    })
    .catch(() => {
      container.textContent = "Fichier introuvable ou erreur de chargement.";
    });
});
