(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Portrait: fall back to the monogram until assets/portrait.jpg exists
  const portrait = document.getElementById('portrait-img');
  if (portrait) {
    const drop = () => portrait.remove();
    if (portrait.complete && portrait.naturalWidth === 0) drop();
    else portrait.addEventListener('error', drop);
  }

  // Count-up numbers
  const format = (value, decimals) =>
    value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  const countUp = (el) => {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    if (reduceMotion || Number.isNaN(target)) return;
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = format(target * eased, decimals);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = format(target, decimals);
    };
    requestAnimationFrame(tick);
  };

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        entry.target.querySelectorAll('.count').forEach(countUp);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  // Close the mobile menu after picking a link
  const menu = document.querySelector('.mobile-menu');
  if (menu) {
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => menu.removeAttribute('open')));
  }

  // Contact form: compose an email in the visitor's mail app
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').trim();
      const org = (data.get('org') || '').trim();
      const subject = `Portfolio inquiry: ${data.get('topic')} (${name})`;
      const body = [
        (data.get('message') || '').trim(),
        '',
        `${name}${org ? `, ${org}` : ''}`,
        data.get('email'),
      ].join('\n');
      window.location.href =
        `mailto:mahirrfaisal07@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
