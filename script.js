document.addEventListener('DOMContentLoaded', () => {

  const introTL = gsap.timeline({
    onComplete: () => {
      document.querySelector('#welcome-intro').style.display = 'none';
    }
  });

  introTL
    .to('.intro-text span', {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1.2,
      stagger: 0.15,
      ease: 'power4.out'
    })
    .to('.intro-text span', {
      opacity: 0,
      y: -40,
      filter: 'blur(10px)',
      duration: 0.8,
      stagger: {
        each: 0.1,
        from: 'end'
      },
      ease: 'power4.in',
      delay: 1.2
    })
    .to('#welcome-intro', {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut'
    });

  // Mobile Menu Logic
  const menuIcon = document.querySelector('#menu-icon');
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('nav a');

  if (menuIcon && nav) {
    menuIcon.addEventListener('click', () => {
      nav.classList.toggle('active');
      menuIcon.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('active')) {
          nav.classList.remove('active');
          menuIcon.classList.remove('open');
        }
      });
    });
  }

  // Cursor Logic
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  const interactiveElements = document.querySelectorAll('a, button, .menu-icon, .social-icons a, .project-card, .skill-card, .cert-card, .experience-card, .project-tech-stack span');

  let mouseX = 0;
  let mouseY = 0;
  let outlineX = 0;
  let outlineY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;

    // Spawn trail particles
    if (Math.random() > 0.5) {
      spawnTrailParticle(mouseX, mouseY);
    }
  });

  const animateCursor = () => {
    const distX = mouseX - outlineX;
    const distY = mouseY - outlineY;


    outlineX = outlineX + distX * 0.12;
    outlineY = outlineY + distY * 0.12;

    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;

    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.classList.add('active');
      cursorOutline.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('active');
      cursorOutline.classList.remove('active');
    });
  });




  const revealElements = document.querySelectorAll('.education-card, .skill-card, .cert-card, .project-card, .experience-card, .home-img, .home-content h1, .home-content h3, .home-content p, .home-content .btn, .social-icons, .education-title, .skills-title, .certifications-title, .experience-title, .contact-section h1, .contact-info, .contact-form');
  revealElements.forEach(el => {
    gsap.set(el, { autoAlpha: 0, y: 30 });
  });


  gsap.registerPlugin(ScrollTrigger);


  const initScrollAnimations = () => {

    document.querySelectorAll('section h1, section h2, .education-title, .skills-title, .certifications-title, .experience-title').forEach(title => {
      gsap.to(title, {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });


    const homeElements = ['.home-content h1', '.home-content h3', '.home-content p', '.home-content .btn', '.social-icons'];
    gsap.to(homeElements, {
      autoAlpha: 1,
      y: 0,
      stagger: 0.15,
      duration: 1,
      ease: 'power4.out',
      delay: 3.2
    });

    gsap.to('.home-img', {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 1.5,
      ease: 'elastic.out(1, 0.8)',
      delay: 3.5
    });

    gsap.to('.education-card', {
      autoAlpha: 1,
      y: 0,
      stagger: 0.2,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.education-container',
        start: 'top 80%'
      }
    });

    gsap.to('.skill-card', {
      autoAlpha: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.skills-container',
        start: 'top 85%'
      }
    });

    gsap.to('.project-card', {
      autoAlpha: 1,
      y: 0,
      stagger: 0.2,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.projects-container',
        start: 'top 80%'
      }
    });


    gsap.to('.cert-card', {
      autoAlpha: 1,
      y: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.certifications-container',
        start: 'top 85%'
      }
    });


    gsap.to('.experience-card', {
      autoAlpha: 1,
      y: 0,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.experience-container',
        start: 'top 85%'
      }
    });


    gsap.to(['.contact-info', '.contact-form'], {
      autoAlpha: 1,
      y: 0,
      stagger: 0.3,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.contact-content',
        start: 'top 85%'
      }
    });


    gsap.to('#bg-canvas', {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }
    });
  };


  initScrollAnimations();

  // Background Particles
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let particles = [];
  let trailParticles = [];
  const particleCount = 150;

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor(x, y, isTrail = false) {
      this.x = x || Math.random() * canvas.width;
      this.y = y || Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.speedY = Math.random() * 0.8 - 0.4;
      this.isTrail = isTrail;
      this.life = isTrail ? 80 : 1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (!this.isTrail) {
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      } else {
        this.life--;
        this.size *= 0.97;
      }

      // Stronger mouse reaction
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 250) {
        const force = (250 - distance) / 250;
        this.x -= dx * force * 0.04;
        this.y -= dy * force * 0.04;
      }
    }

    draw() {
      const alpha = this.isTrail ? (this.life / 80) * 0.4 : 0.25;
      ctx.fillStyle = `rgba(148, 163, 120, ${alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const spawnTrailParticle = (x, y) => {
    trailParticles.push(new Particle(x, y, true));
    if (trailParticles.length > 70) trailParticles.shift();
  };

  const initParticles = () => {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  };

  const connectParticles = () => {
    const allParticles = [...particles, ...trailParticles];
    for (let a = 0; a < allParticles.length; a++) {
      for (let b = a; b < allParticles.length; b++) {
        const dx = allParticles[a].x - allParticles[b].x;
        const dy = allParticles[a].y - allParticles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 140) {
          ctx.strokeStyle = `rgba(148, 163, 120, ${0.12 * (1 - distance / 140)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(allParticles[a].x, allParticles[a].y);
          ctx.lineTo(allParticles[b].x, allParticles[b].y);
          ctx.stroke();
        }
      }
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    trailParticles = trailParticles.filter(p => p.life > 0);
    trailParticles.forEach(p => {
      p.update();
      p.draw();
    });

    connectParticles();
    requestAnimationFrame(animate);
  };

  initParticles();
  animate();
});

// --- Easter Egg: Ask Hrid ---
window.hrid = function () {
  const asciiArt = `
 ██╗  ██╗██████╗ ██╗██████╗ 
 ██║  ██║██╔══██╗██║██╔══██╗
 ███████║██████╔╝██║██║  ██║
 ██╔══██║██╔══██╗██║██║  ██║
 ██║  ██║██║  ██║██║██████╔╝
 ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═════╝ 
    `;

  const styleHeader = "color: #94A378; font-weight: bold; font-size: 16px; font-family: monospace;";
  const styleTagline = "color: #ededed; font-style: italic; font-size: 12px; font-family: sans-serif;";
  const styleLink = "color: #94A378; text-decoration: underline; font-family: monospace;";

  console.log(`%c${asciiArt}`, "color: #94A378; font-weight: bold;");
  console.log("%c⚡ Engineer Mode Activated", styleHeader);
  console.log("%c\"Building. Learning. Shipping.\"", styleTagline);
  console.log("%c🔗 GitHub: https://github.com/hrid07", styleLink);

  return "Status: Operational";
};
