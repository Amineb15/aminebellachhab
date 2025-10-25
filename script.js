// ===== CONFIGURATION ET INITIALISATION =====

// Détection du thème par défaut (système)
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
let currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');

// ===== FONCTIONS PRINCIPALES =====

/**
 * Initialise le thème de l'application
 */
function initTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeToggle();
}

/**
 * Bascule entre les thèmes clair et sombre
 */
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeToggle();
}

/**
 * Met à jour l'icône du bouton de bascule de thème
 */
function updateThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    if (currentTheme === 'dark') {
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }
}

/**
 * Gère le menu de navigation mobile
 */
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!navToggle || !navLinks) return;
    
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Animation des barres du menu hamburger
        const spans = navToggle.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Fermer le menu en cliquant sur un lien
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
            
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

/**
 * Anime les compteurs numériques
 */
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000; // 2 secondes
                const step = target / (duration / 16); // 60fps
                let current = 0;
                
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        counter.textContent = target;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                }, 16);
                
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

/**
 * Anime les cercles de progression des compétences
 */
function animateProgressCircles() {
    const progressCircles = document.querySelectorAll('.circular-progress');
    
    if (progressCircles.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const circle = entry.target;
                const percentage = circle.getAttribute('data-percentage');
                const progressCircle = circle.querySelector('.progress');
                const progressValue = circle.querySelector('.progress-value');
                
                // Animation du cercle SVG
                const circumference = 2 * Math.PI * 70;
                const offset = circumference - (percentage / 100) * circumference;
                
                progressCircle.style.strokeDashoffset = offset;
                
                // Animation du compteur numérique
                let currentValue = 0;
                const duration = 1500; // 1.5 secondes
                const increment = percentage / (duration / 16); // 60fps
                
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= percentage) {
                        currentValue = percentage;
                        clearInterval(timer);
                    }
                    progressValue.textContent = Math.floor(currentValue) + '%';
                }, 16);
                
                observer.unobserve(circle);
            }
        });
    }, { threshold: 0.5 });
    
    progressCircles.forEach(circle => {
        observer.observe(circle);
    });
}

/**
 * Anime les éléments au défilement
 */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length === 0) return;
    
    // Assurer la visibilité initiale sur les petits écrans
    if (window.innerWidth < 768) {
        fadeElements.forEach(element => {
            element.classList.add('visible');
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Gère le formulaire de contact
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Récupération des données du formulaire
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Simulation d'envoi (à remplacer par une vraie requête)
            console.log('Données du formulaire:', data);
            
            // Affichage d'un message de confirmation
            alert('Merci pour votre message ! Je vous répondrai dans les plus brefs délais.');
            
            // Réinitialisation du formulaire
            contactForm.reset();
        });
    }
}

/**
 * Améliore la navigation fluide
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Ajoute un effet de flou au header lors du défilement
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.backdropFilter = 'blur(10px)';
            header.style.backgroundColor = 'rgba(var(--bg-color), 0.8)';
        } else {
            header.style.backdropFilter = 'none';
            header.style.backgroundColor = 'var(--bg-color)';
        }
        
        lastScrollY = window.scrollY;
    });
}

/**
 * Optimise les performances en gérant les images
 */
function initImageOptimization() {
    // Lazy loading pour les images
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== ANIMATIONS MATHÉMATIQUES INTERACTIVES =====

/**
 * Initialise les animations mathématiques interactives
 */
function initMathAnimations() {
    const shapes = document.querySelectorAll('.shape');
    
    if (shapes.length === 0) return;
    
    shapes.forEach(shape => {
        // Ajouter la courbe SVG pour shape-1
        if (shape.classList.contains('shape-1')) {
            const graph = shape.querySelector('.graph');
            if (graph && !graph.querySelector('.function-svg')) {
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('class', 'function-svg');
                svg.setAttribute('viewBox', '0 0 100 100');
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('class', 'function-curve');
                svg.appendChild(path);
                graph.appendChild(svg);
                // Courbe initiale f(x)=x²
                updateFunctionCurve(path, 'f(x) = x²');
            }
        }
        
        // Ajouter des événements interactifs
        shape.addEventListener('mouseenter', handleShapeHover);
        shape.addEventListener('mouseleave', handleShapeLeave);
        shape.addEventListener('click', handleShapeClick);
        
        // Support tactile
        shape.addEventListener('touchstart', handleShapeTouch, { passive: true });
    });
}

/**
 * Gère le survol des formes mathématiques
 */
function handleShapeHover(e) {
    const shape = e.currentTarget;
    const type = shape.getAttribute('data-type');
    
    // Animation spécifique selon le type
    switch(type) {
        case 'function':
            animateFunction(shape);
            break;
        case 'geometry':
            animateGeometry(shape);
            break;
        case 'calculus':
            animateCalculus(shape);
            break;
    }
    
    // Son d'interaction léger (optionnel)
    playMathSound(type);
}

/**
 * Gère la fin du survol
 */
function handleShapeLeave(e) {
    const shape = e.currentTarget;
    shape.style.transform = '';
}

/**
 * Gère le clic sur les formes
 */
function handleShapeClick(e) {
    const shape = e.currentTarget;
    const type = shape.getAttribute('data-type');
    
    // Animation de clic
    shape.style.transform = 'scale(0.95)';
    setTimeout(() => {
        shape.style.transform = 'scale(1.05)';
    }, 150);
    
    // Afficher une information sur le concept mathématique
    showMathConcept(type);
}

/**
 * Gère les interactions tactiles
 */
function handleShapeTouch(e) {
    const shape = e.currentTarget;
    shape.classList.add('active');
    setTimeout(() => {
        shape.classList.remove('active');
    }, 300);
}

/**
 * Anime la forme de fonction
 */
function animateFunction(shape) {
    const graph = shape.querySelector('.graph');
    const equation = shape.querySelector('.equation');
    
    // Courbe SVG à mettre à jour
    const path = graph ? graph.querySelector('.function-curve') : null;
    
    // Changement d'équation aléatoire
    const equations = [
        'f(x) = x²',
        'f(x) = sin(x)',
        'f(x) = eˣ',
        'f(x) = log(x)'
    ];
    const randomEq = equations[Math.floor(Math.random() * equations.length)];
    if (equation) equation.textContent = randomEq;
    if (path) updateFunctionCurve(path, randomEq);
}

/**
 * Anime la forme géométrique
 */
function animateGeometry(shape) {
    const polygon = shape.querySelector('.polygon');
    const equation = shape.querySelector('.equation');
    
    // Animation de rotation et changement de forme
    if (polygon) {
        const shapes = [
            'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', // pentagone
            'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', // diamant
            'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', // hexagone
            'circle(50% at 50% 50%)' // cercle
        ];
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        polygon.style.clipPath = randomShape;
    }
    
    // Changement d'équation
    const equations = [
        'A = πr²',
        'P = 4a',
        'V = a³',
        'A = ½bh'
    ];
    const randomEq = equations[Math.floor(Math.random() * equations.length)];
    if (equation) equation.textContent = randomEq;
}

/**
 * Anime la forme de calcul
 */
function animateCalculus(shape) {
    const equation = shape.querySelector('.equation');
    
    // Équations d'intégrale uniquement (cohérence visuelle)
    const equations = [
        '∫ f(x) dx',
        '∫₀¹ x² dx',
        '∫ₐᵇ f(x) dx',
        '∫ sin(x) dx'
    ];
    const randomEq = equations[Math.floor(Math.random() * equations.length)];
    if (equation) equation.textContent = randomEq;
}

/**
 * Joue un son mathématique léger (optionnel)
 */
function playMathSound(type) {
    // Implémentation optionnelle - pourrait utiliser l'API Web Audio
    // Pour l'instant, c'est un placeholder
    console.log(`Son mathématique pour: ${type}`);
}

/**
 * Affiche un concept mathématique au clic
 */
function showMathConcept(type) {
    const concepts = {
        function: "Les fonctions mathématiques décrivent la relation entre des variables. f(x) = x² est une fonction quadratique.",
        geometry: "La géométrie étudie les formes, les tailles et les propriétés de l'espace. A = πr² calcule l'aire d'un cercle.",
        calculus: "Le calcul différentiel et intégral étudie les changements et les accumulations. ∫ représente l'intégration."
    };
    
    // Créer une notification élégante
    const notification = document.createElement('div');
    notification.className = 'math-concept-notification';
    notification.textContent = concepts[type] || "Concept mathématique.";
    
    document.body.appendChild(notification);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Gère le bouton de retour en haut
 */
function initScrollToTop() {
    const scrollToTopButton = document.getElementById('scrollToTop');
    if (!scrollToTopButton) return;
    
    const scrollThreshold = 300; // Seuil de défilement en pixels

    // Fonction pour mettre à jour la visibilité du bouton
    function updateScrollToTopButton() {
        if (window.scrollY > scrollThreshold) {
            scrollToTopButton.classList.add('visible');
        } else {
            scrollToTopButton.classList.remove('visible');
        }
    }

    // Écouteur d'événement pour le défilement
    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateScrollToTopButton);
    });

    // Écouteur d'événement pour le clic sur le bouton
    scrollToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Modale des projets
 */
function initProjectsData() {
  // Cache pour éviter de recharger les mêmes fichiers
  const cache = new Map();

  async function fetchProjectData(id) {
    if (cache.has(id)) return cache.get(id);
    try {
      const res = await fetch(`projects/${id}.json`);
      if (!res.ok) throw new Error(`Fichier projects/${id}.json introuvable`);
      const data = await res.json();
      cache.set(id, data);
      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  // Remplir les cartes projets automatiquement
  document.querySelectorAll('.project-card').forEach(async (card) => {
    const id = card.getAttribute('data-project');
    const data = await fetchProjectData(id);
    if (!data) return;

    // Titre
    const titleEl = card.querySelector('.project-content h3');
    if (titleEl && data.title) titleEl.textContent = data.title;

    // Image
    const imgEl = card.querySelector('.project-image img');
    if (imgEl) {
      const thumb = data.thumbnail || data.cardImage || data.image;
      if (thumb) {
        imgEl.src = thumb;
        imgEl.alt = data.title || 'Image du projet';
      }
    }

    // Description courte avec gestion de l'expansion
    const descEl = card.querySelector('.project-content p');
    if (descEl && data.description) {
      descEl.textContent = data.description;

      // Assurer un wrapper pour placer le lien inline
      let wrapper = descEl.parentElement;
      if (!wrapper.classList.contains('description-wrapper')) {
        wrapper = document.createElement('div');
        wrapper.className = 'description-wrapper';
        descEl.parentNode.insertBefore(wrapper, descEl);
        wrapper.appendChild(descEl);
      }
      
      // Vérifier si le texte dépasse 5 lignes
      const lineHeight = parseFloat(getComputedStyle(descEl).lineHeight);
      const maxHeight = lineHeight * 5;
      
      if (descEl.scrollHeight > maxHeight) {
        // Ajouter un lien inline "… Lire plus" visuellement au bout du texte
        const readMoreLink = document.createElement('a');
        readMoreLink.href = '#';
        readMoreLink.className = 'read-more-inline';
        readMoreLink.textContent = '… Lire plus';
        
        readMoreLink.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (descEl.classList.contains('expanded')) {
            descEl.classList.remove('expanded');
            readMoreLink.textContent = '… Lire plus';
          } else {
            descEl.classList.add('expanded');
            readMoreLink.textContent = 'Lire moins';
          }
        });
        
        wrapper.appendChild(readMoreLink);
      }
    }

    // En savoir plus: rien à changer, toujours data-project-trigger
  });

  // Exposer pour usage dans le modal
  window.__fetchProjectData = fetchProjectData;
}

// Remplacer initProjectModal pour utiliser les données dynamiques
function initProjectModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  const modalTitle = document.getElementById('projectModalTitle');
  const projectDescription = document.getElementById('projectDescription');
  const projectObjectives = document.getElementById('projectObjectives');
  const projectAuthors = document.getElementById('projectAuthors');
  const projectCollection = document.getElementById('projectCollection');
  const projectEdition = document.getElementById('projectEdition');
  const projectModalImage = document.getElementById('projectModalImage');
  const projectLink = document.getElementById('projectLink');
  const modalClose = modal.querySelector('.modal-close');
  const modalBtnClose = modal.querySelector('.modal-btn-close');
  const body = document.body;

  async function openModal(projectId) {
    const data = await window.__fetchProjectData?.(projectId);
    if (!data) return;

    // Titre
    modalTitle.textContent = data.title || 'Projet';
    // Image avec fonctionnalité de zoom
    if (projectModalImage) {
      projectModalImage.innerHTML = '';
      const img = document.createElement('img');
      img.alt = data.title || 'Image du projet';
      const fullImage = data.modalImage || data.image || '';
      img.src = fullImage;
      img.style.maxWidth = '100%';
      img.style.borderRadius = '12px';
      img.style.cursor = 'zoom-in';
      
      // Ajouter l'événement de clic pour le zoom
      img.onclick = function() {
        openImageZoom(fullImage, data.title || 'Image du projet');
      };
      
      projectModalImage.appendChild(img);
    }

    // Description
    projectDescription.textContent = data.description || '';

    // Objectifs
    projectObjectives.innerHTML = '';
    (data.objectifs || []).forEach(obj => {
      const li = document.createElement('li');
      li.textContent = obj;
      projectObjectives.appendChild(li);
    });

    // Auteurs, Collection, Édition
    if (projectAuthors) {
      if (Array.isArray(data.auteurs)) {
        projectAuthors.innerHTML = '<ul>' + data.auteurs.map(auteur => `<li>${auteur}</li>`).join('') + '</ul>';
      } else {
        projectAuthors.textContent = data.auteurs || '';
      }
    }
    
    if (projectCollection) {
      if (Array.isArray(data.collection)) {
        projectCollection.innerHTML = '<ul>' + data.collection.map(item => `<li>${item}</li>`).join('') + '</ul>';
      } else {
        projectCollection.textContent = data.collection || '';
      }
    }
    
    if (projectEdition) projectEdition.textContent = data.edition || '';

    // Lien
    if (projectLink) projectLink.href = data.link || '#';

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
  }

  // Écouteurs pour fermer
  modalClose?.addEventListener('click', closeModal);
  modalBtnClose?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // Clic sur les projets
  document.querySelectorAll('[data-project-trigger]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const projectCard = trigger.closest('.project-card');
      const projectId = projectCard.getAttribute('data-project');
      openModal(projectId);
    });
  });
}

// Hook dans DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialisation du thème
    initTheme();
    
    // Écouteur pour le bouton de bascule de thème
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Initialisation du menu mobile
    initMobileMenu();
    
    // Initialisation des animations
    initScrollAnimations();
    animateCounters();
    animateProgressCircles();
    
    // Initialisation du formulaire de contact
    initContactForm();
    
    // Amélioration de la navigation
    initSmoothScrolling();
    initHeaderScroll();
    
    // Optimisations des performances
    initImageOptimization();
    
    // Initialisation des animations mathématiques
    initMathAnimations();
    
    // Initialisation du bouton de retour en haut
    initScrollToTop();
    
    // Initialisation des données projets (JSON) puis modale
    initProjectsData();
    initProjectModal();
    
    // Initialisation du zoom d'image
    initImageZoom();
    
    // Initialisation de l'année dynamique du footer
    initFooterYear();

    // Initialiser troncature et lien inline pour À propos
    initAboutReadMore();
    
    // Ajout de la classe fade-in aux éléments à animer
    const elementsToAnimate = document.querySelectorAll('.about-content, .skills-grid, .projects-grid, .contact-content, .about-text, .skill-circle, .project-card, .contact-info');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
    });
    
    // Fallback pour assurer la visibilité après un délai
    setTimeout(() => {
        document.querySelectorAll('.fade-in:not(.visible)').forEach(el => {
            el.classList.add('visible');
        });
    }, 1000);
});

// ===== FONCTIONNALITÉ DE ZOOM D'IMAGE =====
function initImageZoom() {
    const overlay = document.getElementById('imageZoomOverlay');
    const closeBtn = overlay.querySelector('.image-zoom-close');
    
    // Fermer avec le bouton X
    closeBtn.addEventListener('click', closeImageZoom);
    
    // Fermer en cliquant sur l'overlay
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeImageZoom();
        }
    });
    
    // Fermer avec la touche Échap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeImageZoom();
        }
    });
}

function openImageZoom(imageSrc, imageAlt) {
    const overlay = document.getElementById('imageZoomOverlay');
    const zoomedImage = document.getElementById('zoomedImage');
    
    zoomedImage.src = imageSrc;
    zoomedImage.alt = imageAlt;
    overlay.classList.add('active');
    
    // Empêcher le scroll du body
    document.body.style.overflow = 'hidden';
}

function closeImageZoom() {
    const overlay = document.getElementById('imageZoomOverlay');
    overlay.classList.remove('active');
    
    // Restaurer le scroll du body
    document.body.style.overflow = '';
}

// ===== GESTION DES ERREURS =====

window.addEventListener('error', (e) => {
    console.error('Erreur JavaScript:', e.error);
});

// ===== OPTIMISATIONS DES PERFORMANCES =====

// Délai de traitement des tâches non critiques
setTimeout(() => {
    // Initialisation des fonctionnalités non critiques
    if ('serviceWorker' in navigator) {
        // Enregistrement d'un Service Worker pour le cache (optionnel)
        // navigator.serviceWorker.register('/sw.js');
    }
}, 2000);

// ===== ACCESSIBILITÉ =====

// Gestion de la navigation au clavier
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Fermer le menu mobile si ouvert
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const navToggle = document.getElementById('navToggle');
            if (navToggle) navToggle.classList.remove('active');
        }
        
        // Fermer la modale si ouverte
        const modal = document.getElementById('projectModal');
        if (modal && modal.classList.contains('open')) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
        
        // Fermer les notifications
        const notifications = document.querySelectorAll('.math-concept-notification');
        notifications.forEach(notification => {
            notification.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        });
    }
});

// Amélioration du focus pour l'accessibilité
document.addEventListener('focusin', (e) => {
    if (e.target.matches('a, button, input, textarea')) {
        e.target.classList.add('focused');
    }
});

document.addEventListener('focusout', (e) => {
    if (e.target.matches('a, button, input, textarea')) {
        e.target.classList.remove('focused');
    }
});

// Support des préférences de réduction de mouvement
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (reduceMotion.matches) {
    document.documentElement.style.setProperty('--transition', 'none');
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
    });
}
function initFooterYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}
function updateFunctionCurve(pathEl, equationName) {
    // Génère un chemin SVG adapté à l'équation choisie dans un repère 100x100
    // avec origine au centre (50,50) pour correspondre aux axes CSS
    const points = [];
    const n = 100;
    const centerX = 50; // Centre X du repère
    const centerY = 50; // Centre Y du repère
    
    for (let i = 0; i <= n; i++) {
        const x = i; // Position X dans le SVG (0..100)
        let y;
        
        switch (equationName) {
            case 'f(x) = x²': {
                // Convertir x SVG vers coordonnées mathématiques (-2 à +2)
                const xMath = (x - centerX) / 20; // -2.5..2.5
                const yMath = xMath * xMath; // 0..6.25
                // Convertir y mathématique vers coordonnées SVG (inverser Y)
                y = centerY - (yMath * 8); // Échelle pour visibilité
                y = Math.max(0, Math.min(100, y)); // Limiter dans le SVG
                break;
            }
            case 'f(x) = sin(x)': {
                // Convertir x SVG vers radians (-π à +π)
                const xMath = (x - centerX) / centerX * Math.PI;
                const yMath = Math.sin(xMath);
                // Convertir vers coordonnées SVG
                y = centerY - (yMath * 30); // Amplitude 30px
                break;
            }
            case 'f(x) = eˣ': {
                // Convertir x SVG vers coordonnées mathématiques (-1 à +2)
                const xMath = (x - centerX) / 20 - 0.5; // -3..2
                if (xMath > 2) {
                    y = 0; // Limiter la croissance exponentielle
                } else {
                    const yMath = Math.exp(xMath);
                    y = centerY - (Math.log(yMath + 1) * 15); // Échelle logarithmique pour visibilité
                    y = Math.max(0, Math.min(100, y));
                }
                break;
            }
            case 'f(x) = log(x)': {
                // Convertir x SVG vers coordonnées mathématiques (0.1 à 10)
                const xMath = (x - centerX + 50) / 10; // 0..10
                if (xMath <= 0) {
                    y = 100; // log non défini pour x <= 0
                } else {
                    const yMath = Math.log(xMath);
                    y = centerY - (yMath * 20); // Échelle pour visibilité
                    y = Math.max(0, Math.min(100, y));
                }
                break;
            }
            default: {
                // Ligne droite passant par l'origine
                y = centerY - (x - centerX) * 0.5;
            }
        }
        
        points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    
    const d = points.join(' ');
    pathEl.setAttribute('d', d);
    
    // Reset et relancer l'animation
    pathEl.style.animation = 'none';
    void pathEl.offsetWidth; // Force reflow
    pathEl.style.animation = 'drawCurve 2s ease-in-out forwards';
}
function animateCalculus(shape) {
    const equation = shape.querySelector('.equation');
    
    // Équations d'intégrale uniquement (cohérence visuelle)
    const equations = [
        '∫ f(x) dx',
        '∫₀¹ x² dx',
        '∫ₐᵇ f(x) dx',
        '∫ sin(x) dx'
    ];
    const randomEq = equations[Math.floor(Math.random() * equations.length)];
    if (equation) equation.textContent = randomEq;
}

// Gestion de l’affichage “Lire plus / Lire moins” pour la section À propos.
// Exigences UX:
// - Afficher seulement le 1er paragraphe en mode réduit.
// - Le lien “Lire plus” doit apparaître à la fin du 1er paragraphe.
// - Les statistiques doivent rester visibles en permanence.
// - En mode étendu, afficher tous les paragraphes et déplacer le lien en fin
//   du dernier paragraphe sous forme “Lire moins”.
// Accessibilité:
// - Utiliser aria-controls pour lier le contrôle au conteneur de texte.
// - Mettre à jour aria-expanded sur le lien selon l’état.
// - Texte du lien adapté pour les lecteurs d’écran via aria-label.
function initAboutReadMore() {
  const aboutContainer = document.querySelector('.about-text');
  if (!aboutContainer) return;

  const paragraphs = Array.from(aboutContainer.querySelectorAll('p'));
  // Sélection robuste des statistiques: dans .about-text, sinon dans .about-content, sinon dans #apropos
  let statsEl = aboutContainer.querySelector('.about-stats');
  if (!statsEl) {
    const aboutContent = aboutContainer.closest('.about-content') || document.querySelector('.about-content');
    if (aboutContent) statsEl = aboutContent.querySelector('.about-stats');
  }
  if (!statsEl) {
    const aboutSection = document.getElementById('apropos') || document.querySelector('#apropos');
    if (aboutSection) statsEl = aboutSection.querySelector('.about-stats');
  }
  if (paragraphs.length === 0) return;

  // Wrapper d’état: sert à positionner le lien et mémoriser l’état visuel
  let wrapper = aboutContainer.parentElement;
  if (!wrapper || !wrapper.classList.contains('description-wrapper')) {
    wrapper = document.createElement('div');
    wrapper.className = 'description-wrapper';
    aboutContainer.parentNode.insertBefore(wrapper, aboutContainer);
    wrapper.appendChild(aboutContainer);
  }

  const firstP = paragraphs[0];
  const lastP = paragraphs[paragraphs.length - 1];

  // Créer le lien contrôleur
  const readMoreLink = document.createElement('a');
  readMoreLink.href = '#';
  readMoreLink.className = 'read-more-inline';
  readMoreLink.textContent = '… Lire plus';
  // Accessibilité: rôle bouton et association au conteneur
  readMoreLink.setAttribute('role', 'button');
  // Utiliser l’ID si présent, sinon l’ajouter
  if (!aboutContainer.id) aboutContainer.id = 'aboutText';
  readMoreLink.setAttribute('aria-controls', aboutContainer.id);
  readMoreLink.setAttribute('aria-expanded', 'false');
  readMoreLink.setAttribute('aria-label', 'Afficher la suite de la description');

  // Insertion sûre d’un espace insécable avant le lien si absent
  const ensureNbspBefore = (node) => {
    if (!node || !node.parentNode) return;
    const prev = node.previousSibling;
    const needsSpace = !prev || !(prev.nodeType === Node.TEXT_NODE && /\s$/.test(prev.textContent));
    if (needsSpace) node.parentNode.insertBefore(document.createTextNode('\u00A0'), node);
  };

  // Fonctions d’affichage
  const collapse = () => {
    // Masquer tous les paragraphes après le premier
    for (let i = 1; i < paragraphs.length; i++) {
      paragraphs[i].classList.add('hidden-abt');
    }
    // Toujours afficher les statistiques
    if (statsEl) {
      statsEl.style.display = '';
    }
    // Lire plus placé après le premier paragraphe
    firstP.appendChild(readMoreLink);
    ensureNbspBefore(readMoreLink);
    readMoreLink.textContent = '… Lire plus';
    readMoreLink.setAttribute('aria-expanded', 'false');
    readMoreLink.setAttribute('aria-label', 'Afficher la suite de la description');
    wrapper.classList.remove('expanded');
  };

  const expand = () => {
    // Afficher tous les paragraphes
    for (let i = 1; i < paragraphs.length; i++) {
      paragraphs[i].classList.remove('hidden-abt');
    }
    // Lien “Lire moins” à la fin du dernier paragraphe, avant les stats
    if (lastP) lastP.appendChild(readMoreLink);
    ensureNbspBefore(readMoreLink);
    readMoreLink.textContent = 'Lire moins';
    readMoreLink.setAttribute('aria-expanded', 'true');
    readMoreLink.setAttribute('aria-label', 'Réduire la description');
    wrapper.classList.add('expanded');
  };

  readMoreLink.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wrapper.classList.contains('expanded')) {
      collapse();
    } else {
      expand();
    }
  });

  // Initialiser: texte caché après le 1er paragraphe, stats visibles
  collapse();
}