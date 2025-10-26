/**
 * Générateur de Pages PDF - JavaScript
 * Créé par Amine Bellachhab
 * Version: 2.1 (Révisé)
 */

class PDFPageGenerator {
    constructor() {
        this.uploadZone = null;
        this.pdfFileInput = null;
        this.configForm = null;
        this.previewSection = null;
        this.messages = null;
        
        this.currentPdfFile = null;
        this.generatedHtml = '';
        
        this.init();
    }
    
    init() {
        // Attendre que le DOM soit chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initElements());
        } else {
            this.initElements();
        }
    }
    
    initElements() {
        // Récupérer les éléments DOM
        this.uploadZone = document.getElementById('uploadZone');
        this.pdfFileInput = document.getElementById('pdfFile');
        this.configForm = document.getElementById('configForm');
        this.previewSection = document.getElementById('previewSection');
        this.messages = document.getElementById('messages');
        
        // Vérifier que tous les éléments existent
        if (!this.uploadZone || !this.pdfFileInput || !this.configForm || !this.previewSection || !this.messages) {
            console.error('Erreur: Éléments DOM manquants pour le générateur');
            return;
        }
        
        this.initEventListeners();
        this.showMessage('Générateur initialisé avec succès !', 'success');
    }
    
    initEventListeners() {
        // Upload zone events
        this.uploadZone.addEventListener('click', () => this.pdfFileInput.click());
        this.uploadZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadZone.addEventListener('drop', (e) => this.handleDrop(e));
        
        // File input change
        this.pdfFileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Form events
        const pageTypeSelect = document.getElementById('pageType');
        const pageNameInput = document.getElementById('pageName');
        const yearInput = document.getElementById('year');
        const generateBtn = document.getElementById('generateBtn');
        
        if (pageTypeSelect) {
            pageTypeSelect.addEventListener('change', () => this.handleTypeChange());
        }
        if (pageNameInput) {
            pageNameInput.addEventListener('input', () => this.updatePreview());
        }
        if (yearInput) {
            yearInput.addEventListener('input', () => this.updatePreview());
        }
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generatePage());
        }
        
        // Download events - S'assurer que ces boutons existent avant d'ajouter les écouteurs
        const downloadBtn = document.getElementById('downloadHtml');
        const copyBtn = document.getElementById('copyToClipboard');
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadHtml());
        }
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyToClipboard());
        }
    }
    
    handleDragOver(e) {
        e.preventDefault();
        this.uploadZone.classList.add('dragover');
    }
    
    handleDragLeave(e) {
        e.preventDefault();
        this.uploadZone.classList.remove('dragover');
    }
    
    handleDrop(e) {
        e.preventDefault();
        
        // Afficher la section de démarrage du processus
        const startProcessSection = document.getElementById('startProcessSection');
        if (startProcessSection) {
            startProcessSection.classList.remove('hidden');
        }
        this.uploadZone.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'application/pdf') {
                this.processPdfFile(file);
            } else {
                this.showMessage('Veuillez sélectionner un fichier PDF valide.', 'error');
            }
        }
    }
    
    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.type === 'application/pdf') {
                this.processPdfFile(file);
                
                // Afficher la section de démarrage du processus
                const startProcessSection = document.getElementById('startProcessSection');
                if (startProcessSection) {
                    startProcessSection.classList.remove('hidden');
                    
                    // Mettre à jour les informations du fichier
                    const selectedFileName = document.getElementById('selectedFileName');
                    const selectedFileSize = document.getElementById('selectedFileSize');
                    
                    if (selectedFileName) {
                        selectedFileName.textContent = file.name;
                    }
                    
                    if (selectedFileSize) {
                        const fileSizeKB = Math.round(file.size / 1024);
                        selectedFileSize.textContent = `${fileSizeKB} KB`;
                    }
                    
                    // Configurer le bouton de démarrage
                    const startProcessBtn = document.getElementById('startProcessBtn');
                    if (startProcessBtn) {
                        // Supprimer les anciens écouteurs pour éviter les doublons
                        startProcessBtn.replaceWith(startProcessBtn.cloneNode(true));
                        document.getElementById('startProcessBtn').addEventListener('click', () => this.startGenerationProcess());
                    }
                }
            } else {
                this.showMessage('Veuillez sélectionner un fichier PDF valide.', 'error');
            }
        }
    }
    
    startGenerationProcess() {
        // Afficher la barre de statut
        const statusBarContainer = document.querySelector('.status-bar-container');
        if (statusBarContainer) {
            statusBarContainer.style.display = 'block';
        }
        
        // Simuler le processus de génération avec des étapes
        this.updateStatus('analyse', 'Analyse du fichier PDF en cours...', 25);
        
        setTimeout(() => {
            this.updateStatus('extraction', 'Extraction des informations...', 50);
            
            setTimeout(() => {
                this.updateStatus('generation', 'Génération du code HTML...', 75);
                
                setTimeout(() => {
                    this.updateStatus('finalisation', 'Finalisation...', 100);
                    
                    setTimeout(() => {
                        this.generatePage();
                        this.showMessage('Processus de génération terminé avec succès !', 'success');
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
    }
    
    updateStatus(step, message, progress) {
        // Mettre à jour l'étape active
        const steps = ['analyse', 'extraction', 'generation', 'finalisation'];
        const currentStepIndex = steps.indexOf(step);
        
        steps.forEach((stepId, index) => {
            const stepElement = document.getElementById(`step${stepId.charAt(0).toUpperCase() + stepId.slice(1)}`);
            if (stepElement) {
                if (index < currentStepIndex) {
                    stepElement.classList.remove('active');
                    stepElement.classList.add('completed');
                } else if (index === currentStepIndex) {
                    stepElement.classList.add('active');
                    stepElement.classList.remove('completed');
                } else {
                    stepElement.classList.remove('active');
                    stepElement.classList.remove('completed');
                }
            }
        });
        
        // Mettre à jour la barre de progression
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        // Mettre à jour le message de statut
        const statusMessage = document.getElementById('statusMessage');
        if (statusMessage) {
            statusMessage.textContent = message;
        }
    }
    
    processPdfFile(file) {
        try {
            this.currentPdfFile = file;
            const fileName = file.name;
            
            // Analyser le nom du fichier
            const analysis = this.analyzePdfFileName(fileName);
            
            // Remplir les champs
            const pdfNameInput = document.getElementById('pdfName');
            const pageTypeSelect = document.getElementById('pageType');
            const pageNameInput = document.getElementById('pageName');
            const yearInput = document.getElementById('year');
            
            if (pdfNameInput) pdfNameInput.value = fileName;
            if (pageTypeSelect) pageTypeSelect.value = analysis.type;
            if (pageNameInput) pageNameInput.value = analysis.suggestedPageName;
            
            if (analysis.year && yearInput) {
                yearInput.value = analysis.year;
            }
            
            this.handleTypeChange();
            
            // CORRECTION : Afficher le formulaire de configuration
            this.configForm.classList.add('visible');
            
            const generateBtn = document.getElementById('generateBtn');
            if (generateBtn) {
                generateBtn.disabled = false;
            }
            
            this.showMessage(`Fichier "${fileName}" analysé avec succès !`, 'success');
        } catch (error) {
            console.error('Erreur lors du traitement du fichier PDF:', error);
            this.showMessage('Erreur lors du traitement du fichier PDF.', 'error');
        }
    }
    
    analyzePdfFileName(fileName) {
        const nameWithoutExt = fileName.replace('.pdf', '');
        let type = 'auto';
        let suggestedPageName = '';
        let year = null;
        
        try {
            // Détecter le type
            if (nameWithoutExt.includes('Élève') || nameWithoutExt.includes('Elève')) {
                type = 'eleve';
            } else if (nameWithoutExt.includes('Préparation')) {
                type = 'preparation';
            }
            
            // Extraire l'année pour les préparations
            const yearMatch = nameWithoutExt.match(/(\d{4})/);
            if (yearMatch) {
                year = yearMatch[1];
            }
            
            // Générer le nom de page suggéré
            const apicMatch = nameWithoutExt.match(/(\d+)Apic.*?S(\d+)/i);
            if (apicMatch) {
                const niveau = apicMatch[1];
                const sequence = apicMatch[2];
                suggestedPageName = `${niveau}ApicS${sequence}`;
                
                if (type === 'preparation' && year) {
                    suggestedPageName += `-${year}`;
                }
                
                suggestedPageName += '.html';
            }
        } catch (error) {
            console.error('Erreur lors de l\'analyse du nom de fichier:', error);
        }
        
        return { type, suggestedPageName, year };
    }
    
    handleTypeChange() {
        try {
            const pageTypeSelect = document.getElementById('pageType');
            const yearGroup = document.getElementById('yearGroup');
            
            if (pageTypeSelect && yearGroup) {
                const type = pageTypeSelect.value;
                
                if (type === 'preparation') {
                    yearGroup.style.display = 'block';
                } else {
                    yearGroup.style.display = 'none';
                }
            }
            
            this.updatePreview();
        } catch (error) {
            console.error('Erreur lors du changement de type:', error);
        }
    }
    
    updatePreview() {
        if (!this.currentPdfFile) return;
        
        try {
            const pdfName = this.currentPdfFile.name;
            const pageTypeSelect = document.getElementById('pageType');
            const pageNameInput = document.getElementById('pageName');
            const yearInput = document.getElementById('year');
            
            const pageType = pageTypeSelect ? pageTypeSelect.value : 'auto';
            const pageName = pageNameInput ? (pageNameInput.value || 'page-generee.html') : 'page-generee.html';
            const year = yearInput ? yearInput.value : '';
            
            // Générer le titre
            let title = '📘 Visualisation du PDF';
            if (pageType !== 'auto') {
                const apicMatch = pdfName.match(/(\d+)Apic.*?S(\d+)/i);
                
                if (apicMatch) {
                    const niveau = apicMatch[1];
                    const sequence = apicMatch[2];
                    
                    if (pageType === 'eleve') {
                        title += ` - Élève ${niveau} Apic S${sequence}`;
                    } else if (pageType === 'preparation') {
                        title += ` - Préparation ${niveau} Apic S${sequence}`;
                        if (year) {
                            title += ` - ${year}`;
                        }
                    }
                }
            }
            
            // Mettre à jour l'aperçu
            const previewPageName = document.getElementById('previewPageName');
            const previewPdfName = document.getElementById('previewPdfName');
            const previewTitle = document.getElementById('previewTitle');
            const previewType = document.getElementById('previewType');
            
            if (previewPageName) previewPageName.textContent = pageName;
            if (previewPdfName) previewPdfName.textContent = pdfName;
            if (previewTitle) previewTitle.textContent = title;
            if (previewType) {
                previewType.textContent = 
                    pageType === 'eleve' ? '👨‍🎓 Élève' : 
                    pageType === 'preparation' ? '📋 Préparation' : 
                    '🤖 Auto';
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'aperçu:', error);
        }
    }
    
    generatePage() {
        if (!this.currentPdfFile) {
            this.showMessage('Aucun fichier PDF sélectionné.', 'error');
            return;
        }
        
        try {
            const pdfName = this.currentPdfFile.name;
            const pageTypeSelect = document.getElementById('pageType');
            const pageNameInput = document.getElementById('pageName');
            const yearInput = document.getElementById('year');
            
            const pageType = pageTypeSelect ? pageTypeSelect.value : 'auto';
            const pageName = pageNameInput ? (pageNameInput.value || 'page-generee.html') : 'page-generee.html';
            const year = yearInput ? yearInput.value : '';
            
            // Générer le HTML
            this.generatedHtml = this.createHtmlTemplate(pdfName, pageType, year);
            
            // CORRECTION : Afficher la section de prévisualisation
            this.previewSection.classList.add('visible');
            
            // Mettre à jour l'aperçu avec les informations générées
            this.updatePreview();
            
            // Afficher le visualiseur de code
            this.showCodeViewer(this.generatedHtml);
            
            // Réinitialiser les écouteurs d'événements pour les boutons de téléchargement et copie
            this.reinitActionButtons();
            
            this.showMessage('Page HTML générée avec succès !', 'success');
        } catch (error) {
            console.error('Erreur lors de la génération de la page:', error);
            this.showMessage('Erreur lors de la génération de la page.', 'error');
        }
    }
    
    createHtmlTemplate(pdfName, pageType, year) {
        const dataAttributes = [];
        
        if (pageType === 'preparation') {
            dataAttributes.push('data-prefix="Préparation"');
            if (year) {
                dataAttributes.push(`data-year="${year}"`);
            }
        } else {
            dataAttributes.push('data-prefix="Élève"');
        }
        
        // Générer le titre pour les métadonnées et l'affichage
        let title = '📘 Visualisation du PDF';
        let metaTitle = 'Visualisation PDF';
        let metaDescription = 'Visualisation PDF avec compteurs de vues et téléchargements';
        
        // Extraire les informations du nom du fichier pour personnaliser le titre
        const apicMatch = pdfName.match(/(\d+)Apic.*?S(\d+)/i);
        const chapitreMatch = pdfName.match(/Chapitre\s+(\d+)/i);
        
        if (apicMatch) {
            const niveau = apicMatch[1];
            const sequence = apicMatch[2];
            
            if (pageType === 'eleve') {
                title += ` - Élève ${niveau}Apic S${sequence}`;
                metaTitle += ` - Élève ${niveau}Apic S${sequence} | Amine Bellachhab`;
                metaDescription = `Visualisation PDF Élève ${niveau}Apic S${sequence} avec compteurs de vues et téléchargements`;
            } else if (pageType === 'preparation') {
                title += ` - Préparation ${niveau}Apic S${sequence}`;
                metaTitle += ` - Préparation ${niveau}Apic S${sequence} | Amine Bellachhab`;
                metaDescription = `Visualisation PDF Préparation ${niveau}Apic S${sequence} avec compteurs de vues et téléchargements`;
                if (year) {
                    title += ` - ${year}`;
                    metaTitle += ` - ${year}`;
                }
            }
        } else if (chapitreMatch) {
            const chapitre = chapitreMatch[1];
            title += ` - Chapitre ${chapitre}`;
            metaTitle += ` - Chapitre ${chapitre} | Amine Bellachhab`;
            metaDescription = `Visualisation PDF Chapitre ${chapitre} avec compteurs de vues et téléchargements`;
        }
        
        const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${metaDescription}">
    <meta property="og:title" content="${metaTitle}">
    <meta property="og:description" content="Consultez et téléchargez le PDF avec compteurs de statistiques">
    <meta property="og:type" content="website">
    <title>${title} | Amine Bellachhab</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/visio.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Header commun -->
    <header class="header">
        <div class="container">
            <nav class="nav">
                <a href="https://aminebellachhab.ma/" class="logo">A<span>.</span> BELLACHHAB</a>
                <ul class="nav-links">
                    <li><a href="https://aminebellachhab.ma/">Accueil</a></li>
                    <li><a href="https://aminebellachhab.ma/#apropos">À propos</a></li>
                    <li><a href="https://aminebellachhab.ma/#competences">Compétences</a></li>
                    <li><a href="https://aminebellachhab.ma/#projets">Projets</a></li>  
                    <li><a href="https://aminebellachhab.ma/#contact">Contact</a></li>
                </ul>
                <button class="theme-toggle" id="themeToggle" aria-label="Basculer le mode sombre/clair">
                    <span class="theme-icon">🌙</span>
                </button>
                <button class="nav-toggle" id="navToggle" aria-label="Ouvrir le menu de navigation">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>
        </div>
    </header>

    <!-- Section principale de visualisation du PDF -->
    <section class="section" id="visio">
        <div class="container">
            <h2 class="visio-title">${title}</h2>

            <!-- Conteneur PDF avec loader -->
            <div class="pdf-container">
                <div class="loader" id="loader">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progress-fill"></div>
                    </div>
                </div>
                <iframe id="pdf-viewer" class="pdf-iframe" src="${pdfName}" title="Visualisation PDF"></iframe>
            </div>

            <!-- Section stats et bouton -->
            <div class="stats-section">
                <div class="counters">
                    <div class="counter" id="view-counter">👁️ Visites : 0</div>
                    <div class="counter" id="download-counter">⬇️ Téléchargements : 0</div>
                </div>
                <a id="download-btn" class="download-btn">Télécharger le PDF</a>
            </div>
        </div>
    </section>

    <!-- Footer commun -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-info">
                    <a href="#accueil" class="logo">A<span>.</span> BELLACHHAB</a>
                    <p>Enseignant passionné par la transmission des savoirs mathématiques.</p>
                </div>
                <div class="footer-links">
                    <h4>Liens rapides</h4>
                    <ul>
                    <li><a href="https://aminebellachhab.ma/">Accueil</a></li>
                    <li><a href="https://aminebellachhab.ma/#apropos">À propos</a></li>
                    <li><a href="https://aminebellachhab.ma/#competences">Compétences</a></li>
                    <li><a href="https://aminebellachhab.ma/#projets">Projets</a></li>  
                    <li><a href="https://aminebellachhab.ma/#contact">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-social">
                    <h4>Réseaux sociaux</h4>
                    <div class="social-links">
                        <a href="http://www.linkedin.com/in/aminebellachhab" aria-label="LinkedIn">LinkedIn</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; <span id="currentYear"></span> AMINE BELLACHHAB | Enseignant de Mathématiques. Tous droits réservés.</p>
            </div>
        </div>
    </footer>

    <!-- Bouton retour en haut -->
    <button id="scrollToTop" class="scroll-to-top" aria-label="Retour en haut de la page">
        <span>↑</span>
    </button>

    <script>
        // Configuration du PDF pour visio.js
        window.pdfConfig = {
            fileName: "${pdfName}",
            title: "${title}"
        };
    </script>
    <script src="js/script.js"></script>
    <script src="js/visio.js"></script>
    <script>
        // Mettre à jour l'année dans le footer
        document.getElementById('currentYear').textContent = new Date().getFullYear();
    </script>
</body>
</html>`;

        return html;
    }
    
    showCodeViewer(html) {
        // Afficher le visualiseur de code
        const codeViewer = document.getElementById('codeViewer');
        if (codeViewer) {
            codeViewer.style.display = 'block';
            
            // Remplir le contenu du code avec numéros de ligne
            const codeContent = document.getElementById('codeContent');
            if (codeContent && html) {
                // Diviser le code en lignes
                const lines = html.split('\n');
                let formattedCode = '';
                
                // Ajouter chaque ligne avec son numéro
                lines.forEach((line, index) => {
                    formattedCode += `<div class="code-line">
                        <span class="line-number">${index + 1}</span>
                        <span class="line-content">${this.escapeHtml(line)}</span>
                    </div>`;
                });
                
                codeContent.innerHTML = formattedCode;
            }
        }
    }
    
    reinitActionButtons() {
        // Réinitialiser les écouteurs pour les boutons d'action
        const downloadBtn = document.getElementById('downloadHtml');
        const copyBtn = document.getElementById('copyToClipboard');
        const copyCodeBtn = document.getElementById('copyCodeBtn');
        
        if (downloadBtn) {
            downloadBtn.replaceWith(downloadBtn.cloneNode(true));
            document.getElementById('downloadHtml').addEventListener('click', () => this.downloadHtml());
        }
        
        if (copyBtn) {
            copyBtn.replaceWith(copyBtn.cloneNode(true));
            document.getElementById('copyToClipboard').addEventListener('click', () => this.copyToClipboard());
        }
        
        if (copyCodeBtn) {
            copyCodeBtn.replaceWith(copyCodeBtn.cloneNode(true));
            document.getElementById('copyCodeBtn').addEventListener('click', () => this.copyToClipboard());
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    downloadHtml() {
        if (!this.generatedHtml) {
            this.showMessage('Aucun code HTML généré.', 'error');
            return;
        }
        
        try {
            const pageNameInput = document.getElementById('pageName');
            const fileName = pageNameInput ? pageNameInput.value : 'page-generee.html';
            
            const downloadBtn = document.getElementById('downloadHtml');
            if (downloadBtn) {
                // Animation de téléchargement
                const originalText = downloadBtn.innerHTML;
                const originalClass = downloadBtn.className;
                
                downloadBtn.innerHTML = '<span class="btn-icon">⏬</span> Téléchargement...';
                downloadBtn.className = 'btn btn-secondary';
                downloadBtn.disabled = true;
                
                setTimeout(() => {
                    const blob = new Blob([this.generatedHtml], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    // Animation de succès
                    downloadBtn.innerHTML = '<span class="btn-icon">✅</span> Téléchargé !';
                    downloadBtn.className = 'btn btn-success';
                    
                    // Restaurer après 2 secondes
                    setTimeout(() => {
                        downloadBtn.innerHTML = originalText;
                        downloadBtn.className = originalClass;
                        downloadBtn.disabled = false;
                    }, 2000);
                    
                    this.showMessage(`Fichier "${fileName}" téléchargé avec succès !`, 'success');
                }, 1000);
            }
        } catch (error) {
            console.error('Erreur lors du téléchargement:', error);
            this.showMessage('Erreur lors du téléchargement du fichier.', 'error');
        }
    }
    
    copyToClipboard() {
        if (!this.generatedHtml) {
            this.showMessage('Aucune page HTML générée à copier.', 'error');
            return;
        }
        
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(this.generatedHtml).then(() => {
                    this.showMessage('Code HTML copié dans le presse-papiers !', 'success');
                }).catch((error) => {
                    console.error('Erreur lors de la copie:', error);
                    this.fallbackCopyToClipboard();
                });
            } else {
                this.fallbackCopyToClipboard();
            }
        } catch (error) {
            console.error('Erreur lors de la copie:', error);
            this.showMessage('Erreur lors de la copie dans le presse-papiers.', 'error');
        }
    }
    
    fallbackCopyToClipboard() {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = this.generatedHtml;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                this.showMessage('Code HTML copié dans le presse-papiers !', 'success');
            } else {
                this.showMessage('Impossible de copier automatiquement. Veuillez copier manuellement.', 'error');
            }
        } catch (error) {
            console.error('Erreur lors de la copie de secours:', error);
            this.showMessage('Erreur lors de la copie dans le presse-papiers.', 'error');
        }
    }
    
    showMessage(text, type) {
        try {
            if (!this.messages) return;
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `${type}-message`;
            messageDiv.textContent = text;
            
            this.messages.appendChild(messageDiv);
            
            // Supprimer le message après 5 secondes
            setTimeout(() => {
                if (messageDiv && messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 5000);
        } catch (error) {
            console.error('Erreur lors de l\'affichage du message:', error);
        }
    }
}

// Initialiser le générateur automatiquement
let pdfGenerator = null;

function initPDFGenerator() {
    try {
        pdfGenerator = new PDFPageGenerator();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation du générateur PDF:', error);
    }
}

// Démarrer l'initialisation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPDFGenerator);
} else {
    initPDFGenerator();
}