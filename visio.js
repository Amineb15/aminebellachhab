// Scripts spécifiques pour la page de visualisation PDF

(function() {
  // Fonction pour extraire le nom du PDF et le titre depuis l'URL de la page
  function extractPdfInfoFromUrl() {
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    const visioSection = document.getElementById('visio');
    const prefix = visioSection?.dataset.prefix || 'Elève';
    const year = visioSection?.dataset.year || '';
    // Si une année est fournie dans l'URL (ex: -2025 à la fin), la retirer pour la base
    const cleanedPage = year ? currentPage.replace(new RegExp(`-${year}$`), '') : currentPage;
    const transformed = cleanedPage.replace(/(\d+)([A-Za-z]+)(S\d+)/, '$1$2- $3');
    const suffix = year ? ` - ${year}` : '';
    const pdfFileName = `${prefix} - ${transformed}${suffix}.pdf`;
    const titleCore = cleanedPage.replace(/(\d+)([A-Za-z]+)(S\d+)/, '$1 $2 $3');
    const titleText = `${titleCore}${year ? ` - ${year}` : ''}`;
    return {
      pdfFileName,
      title: `📘 Visualisation du PDF - ${prefix} ${titleText}`
    };
  }
  // Fonction pour animer le compteur 
  function animateCounter(element) { 
    element.classList.add('animate'); 
    setTimeout(() => { 
      element.classList.remove('animate'); 
    }, 300); 
  } 

  // Initialisation et mise à jour des compteurs avec localStorage 
  let views = parseInt(localStorage.getItem('pdf_views')); 
  if (isNaN(views)) { 
    views = Math.floor(Math.random() * (760 - 70 + 1)) + 70; 
  } else { 
    let increment = Math.floor(Math.random() * 20) + 1; 
    views += increment; 
  } 
  localStorage.setItem('pdf_views', views); 

  let downloads = parseInt(localStorage.getItem('pdf_downloads')); 
  if (isNaN(downloads)) { 
    downloads = Math.floor(Math.random() * (760 - 70 + 1)) + 70; 
  } else { 
    let increment = Math.floor(Math.random() * 20) + 1; 
    downloads += increment; 
  } 
  localStorage.setItem('pdf_downloads', downloads); 

  // Attendre que le DOM soit chargé
  document.addEventListener('DOMContentLoaded', function() {
    // Extraire les informations du PDF depuis l'URL
    const pdfInfo = extractPdfInfoFromUrl();
    
    // Mettre à jour le titre de la page
    const titleElement = document.querySelector('.visio-title');
    if (titleElement) {
      titleElement.textContent = pdfInfo.title;
    }
    // Mettre à jour le titre de l'onglet du navigateur
    document.title = `${pdfInfo.title} | Amine Bellachhab`;
    
    // Mettre à jour la source du PDF dans l'iframe
    const pdfViewer = document.getElementById('pdf-viewer');

    if (pdfViewer) {
      pdfViewer.src = pdfInfo.pdfFileName;
    }
    
    // Mettre à jour les affichages 
    const viewCounter = document.getElementById('view-counter'); 
    if (viewCounter) {
      viewCounter.textContent = `👁️ Visites : ${views}`; 
      animateCounter(viewCounter); 
    }

    const downloadCounter = document.getElementById('download-counter'); 
    if (downloadCounter) {
      downloadCounter.textContent = `⬇️ Téléchargements : ${downloads}`; 
      animateCounter(downloadCounter); 
    }

    // Gestion du bouton de téléchargement 
    const downloadBtn = document.getElementById('download-btn'); 
    if (downloadBtn) {
      downloadBtn.addEventListener('click', (e) => { 
        e.preventDefault(); // Empêcher le comportement par défaut 
        downloads = parseInt(localStorage.getItem('pdf_downloads')); 
        downloads += 1; // Incrément simple sur clic 
        localStorage.setItem('pdf_downloads', downloads); 
        downloadCounter.textContent = `⬇️ Téléchargements : ${downloads}`; 
        animateCounter(downloadCounter); 
        // Déclencher le téléchargement 
        const link = document.createElement('a'); 
        link.href = pdfInfo.pdfFileName; 
        link.download = pdfInfo.pdfFileName; 
        document.body.appendChild(link); 
        link.click(); 
        document.body.removeChild(link); 
      }); 
    }

    // Barre de progression optionnelle pour le chargement du PDF 
    const loader = document.getElementById('loader'); 
    const progressFill = document.getElementById('progress-fill'); 
    // pdfViewer already declared above; reuse it here

    if (loader && progressFill && pdfViewer) {
      // Simulation de progression (car iframe n'a pas d'événement progress natif) 
      let progress = 0; 
      const interval = setInterval(() => { 
        progress += 10; 
        progressFill.style.width = `${progress}%`; 
        if (progress >= 100) { 
          clearInterval(interval); 
          setTimeout(() => { 
            loader.classList.add('hidden'); 
          }, 500); // Délai pour une transition douce 
        } 
      }, 200); // Ajuster pour simuler le chargement 

      // Cacher le loader une fois l'iframe chargée 
      pdfViewer.addEventListener('load', () => { 
        clearInterval(interval); 
        progressFill.style.width = '100%'; 
        setTimeout(() => { 
          loader.classList.add('hidden'); 
        }, 300); 
      }); 
    }
  });
})();