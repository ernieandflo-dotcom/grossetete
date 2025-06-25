document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('toggle-demarche');
  const section = document.querySelector('.demarche-section');

  if (!button || !section) return;

  section.style.display = 'none';

  button.addEventListener('click', () => {
    const isVisible = section.style.display === 'block';
    section.style.display = isVisible ? 'none' : 'block';
    button.textContent = isVisible
      ? 'Voir la démarche artistique'
      : 'Cacher la démarche artistique';
  });
});
