const graspLink = document.querySelector('.research-video-link');

if (graspLink) {
  const video = graspLink.querySelector('video');
  const hoverCapable = window.matchMedia('(hover: hover)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pointerInside = false;

  const stopPreview = () => {
    pointerInside = false;
    graspLink.classList.remove('is-playing');
    video.pause();
    if (video.readyState > 0) video.currentTime = 0;
  };

  graspLink.addEventListener('pointerenter', async () => {
    if (!hoverCapable.matches || reducedMotion.matches) return;
    pointerInside = true;

    try {
      await video.play();
      if (pointerInside && !reducedMotion.matches) {
        graspLink.classList.add('is-playing');
      } else {
        video.pause();
      }
    } catch {
      stopPreview();
    }
  });

  graspLink.addEventListener('pointerleave', stopPreview);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) stopPreview();
  });
}
