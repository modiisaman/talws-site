document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Lenis smooth scroll ---------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenis;
  if (!prefersReducedMotion && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ---------- Smooth anchor scrolling (works with or without Lenis) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -70 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- GSAP scroll reveal ---------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Mark reveal targets
    const revealSelectors = [
      '.about-copy', '.about-stats .stat',
      '.focus-card', '.gallery-item',
      '.donate-copy', '.donate-card',
      '.volunteer-copy', '.volunteer-form'
    ];
    revealSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.classList.add('reveal'));
    });

    gsap.utils.toArray('.reveal').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        delay: (i % 4) * 0.06,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Hero entrance
    gsap.from('.eyebrow, .hero-title .line, .hero-sub, .hero-ctas', {
      opacity: 0,
      y: 20,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power2.out',
      delay: 0.1
    });

    // Sun rays gentle rotation on scroll through hero
    gsap.to('.hero-rays', {
      rotation: 25,
      transformOrigin: '200px 200px',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  } else {
    // No GSAP available — just show everything
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Gallery filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const match = filter === 'all' || item.dataset.pillar === filter;
        item.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ---------- Donate: amount selection ---------- */
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customInput = document.getElementById('customAmount');
  let selectedAmount = 500;

  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      if (btn.dataset.amount === 'custom') {
        customInput.style.display = 'block';
        customInput.focus();
        selectedAmount = null;
      } else {
        customInput.style.display = 'none';
        selectedAmount = parseInt(btn.dataset.amount, 10);
      }
    });
  });
  customInput?.addEventListener('input', () => {
    selectedAmount = parseInt(customInput.value, 10) || null;
  });

  /* ---------- Donate: Razorpay checkout ----------
     [PLACEHOLDER] Replace 'rzp_test_XXXXXXXXXXXX' with your real Razorpay Key ID.
     For production, create the order server-side (Razorpay requires an order_id
     from a backend call for live payments) — this client-only flow is a starting
     point suitable for test mode / simple donation buttons. */
  const donateBtn = document.getElementById('donateBtn');
  donateBtn.addEventListener('click', () => {
    const amount = selectedAmount || parseInt(customInput.value, 10);
    if (!amount || amount <= 0) {
      alert('Please choose or enter a donation amount.');
      return;
    }
    if (typeof Razorpay === 'undefined') {
      alert('Payment gateway failed to load. Please check your connection and try again.');
      return;
    }
    const options = {
      key: 'rzp_test_XXXXXXXXXXXX', // [PLACEHOLDER: your Razorpay Key ID]
      amount: amount * 100, // Razorpay expects paise
      currency: 'INR',
      name: 'The Amazing Life Welfare Society',
      description: 'Donation',
      handler: function (response) {
        alert('Thank you for your donation! Payment ID: ' + response.razorpay_payment_id);
      },
      theme: { color: '#C1502E' }
    };
    const rzp = new Razorpay(options);
    rzp.open();
  });

  /* ---------- Volunteer form: Netlify Forms submit (AJAX) ---------- */
  const form = document.getElementById('volunteerForm');
  const formStatus = document.getElementById('formStatus');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString()
    })
      .then(() => {
        formStatus.textContent = "Thanks — we'll be in touch soon!";
        form.reset();
      })
      .catch(() => {
        formStatus.textContent = 'Something went wrong. Please try again or email us directly.';
      });
  });

});
