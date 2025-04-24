new fullpage('#fullpage', {
    autoScrolling: true,
    scrollingSpeed: 1000,
    navigation: true,
    anchors: ['lore', 'vision', 'spiel'],
    navigationTooltips: ['Lore', 'Vision', 'Spiel'],
    showActiveTooltip: true,
    onLeave: function(origin, destination, direction) {
      const section = document.querySelector(`#section${destination.index + 1}`);
      createParticles(section);
    }
  });

  // Partikel-Effekt - Fremdcode
  function createParticles(section) {
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.top = `${Math.random() * 100}vh`;
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.animationDuration = `${Math.random() * 5 + 5}s`;
      section.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 10000);
    }
  }

  // Lightbox-Funktionalität
  const images = document.querySelectorAll('.clickable-image');
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxImage = document.querySelector('.lightbox-image');
  const closeLightbox = document.querySelector('.close-lightbox');

  // Öffnen der Lightbox
  images.forEach(image => {
    image.addEventListener('click', () => {
      lightboxImage.src = image.src;
      lightboxOverlay.style.display = 'flex';
    });
  });

  // Schließen der Lightbox
  closeLightbox.addEventListener('click', () => {
    lightboxOverlay.style.display = 'none';
  });

  // Schließen bei Klick außerhalb des Bildes
  lightboxOverlay.addEventListener('click', (event) => {
    if (event.target === lightboxOverlay) {
      lightboxOverlay.style.display = 'none';
    }
  });