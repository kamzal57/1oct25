// Application State
let appState = {
    slides: [
        {
            id: Date.now(),
            layout: 'title',
            title: 'Titre de la Présentation',
            subtitle: 'Sous-titre optionnel',
            content: '',
            notes: '',
            transition: 'none',
            shapes: [],
            images: []
        }
    ],
    currentSlideIndex: 0,
    presentationIndex: 0,
    isPresentationMode: false,
    currentTheme: 'default',
    zoom: 1,
    history: [],
    historyIndex: -1
};

// Initialize Application
function initializeApp() {
    renderPanelContent();
    renderSlidesList();
    loadSlide(0);
    setupKeyboardShortcuts();
    setupDragAndDrop();
    showToast('Bienvenue dans Présentation Pro Ultra!', 'success');
}

// Render Panel Content
function renderPanelContent() {
    const panelContent = document.getElementById('panelContent');
    panelContent.innerHTML = `
        <!-- Layout Tab -->
        <div id="layoutTab" class="panel-tab-content">
            <div class="panel-section">
                <h3>Mise en page</h3>
                <div class="theme-grid">
                    ${generateLayoutOptions()}
                </div>
            </div>
        </div>

        <!-- Theme Tab -->
        <div id="themeTab" class="panel-tab-content" style="display: none;">
            <div class="panel-section">
                <h3>Thèmes de couleur</h3>
                <div class="theme-grid">
                    ${generateThemeOptions()}
                </div>
            </div>
        </div>

        <!-- Transition Tab -->
        <div id="transitionTab" class="panel-tab-content" style="display: none;">
            <div class="panel-section">
                <h3>Effets de transition</h3>
                <div class="theme-grid">
                    ${generateTransitionOptions()}
                </div>
            </div>
        </div>

        <!-- Notes Tab -->
        <div id="notesTab" class="panel-tab-content" style="display: none;">
            <div class="panel-section">
                <h3>Notes du présentateur</h3>
                <textarea style="width: 100%; height: 200px; padding: 10px; border: 1px solid var(--border); border-radius: 6px; resize: vertical;" placeholder="Ajoutez vos notes ici..." onblur="updateSlideNotes(this.value)"></textarea>
            </div>
        </div>
    `;
}

function generateLayoutOptions() {
    const layouts = [
        { id: 'title', name: 'Titre', preview: '<div style="text-align: center;"><strong>TITRE</strong><br>Sous-titre</div>' },
        { id: 'content', name: 'Contenu', preview: '<div><strong>Titre</strong><br>Contenu...</div>' },
        { id: 'two-columns', name: '2 Colonnes', preview: '<div style="display:flex;gap:5px;"><div>Col 1</div><div>Col 2</div></div>' },
        { id: 'three-columns', name: '3 Colonnes', preview: '<div style="display:flex;gap:3px;"><div>1</div><div>2</div><div>3</div></div>' },
        { id: 'comparison', name: 'Comparaison', preview: '<div style="display:flex;gap:5px;"><div>A</div>VS<div>B</div></div>' },
        { id: 'quote', name: 'Citation', preview: '<div style="font-size:2rem;">"</div>' },
        { id: 'team', name: 'Équipe', preview: '<div style="display:flex;gap:5px;">👤👤👤</div>' },
        { id: 'chart', name: 'Graphique', preview: '<div style="display:flex;gap:2px;align-items:flex-end;"><div style="height:20px;width:10px;background:#6366f1;"></div><div style="height:30px;width:10px;background:#8b5cf6;"></div></div>' },
        { id: 'qcm', name: 'QCM', preview: '<div style="font-size:0.6rem;">□ A<br>□ B<br>□ C</div>' },
        { id: 'timeline', name: 'Timeline', preview: '<div>━●━●━</div>' },
        { id: 'process', name: 'Processus', preview: '<div>①→②→③</div>' },
        { id: 'swot', name: 'SWOT', preview: '<div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;"><div style="background:#10b981;height:10px;"></div><div style="background:#ef4444;height:10px;"></div><div style="background:#6366f1;height:10px;"></div><div style="background:#f59e0b;height:10px;"></div></div>' },
        { id: 'summary', name: 'Sommaire', preview: '<div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;"><div style="background:#e5e7eb;height:15px;"></div><div style="background:#e5e7eb;height:15px;"></div></div>' },
        { id: 'video', name: 'Vidéo', preview: '<div style="font-size:1.5rem;color:#ef4444;">▶</div>' },
        { id: 'html', name: 'HTML', preview: '<div style="font-size:1rem;color:#6366f1;">&lt;/&gt;</div>' }
    ];
    
    return layouts.map(layout => `
        <div class="theme-option ${layout.id === 'title' ? 'active' : ''}" onclick="changeLayout('${layout.id}')">
            <div class="theme-preview" style="background: #f3f4f6; padding: 10px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem;">
                ${layout.preview}
            </div>
            <div>${layout.name}</div>
        </div>
    `).join('');
}

function generateThemeOptions() {
    const themes = [
        { id: 'default', name: 'Par défaut', color: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' },
        { id: 'dark', name: 'Sombre', color: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)' },
        { id: 'ocean', name: 'Océan', color: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)' },
        { id: 'sunset', name: 'Coucher soleil', color: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)' }
    ];
    
    return themes.map(theme => `
        <div class="theme-option ${theme.id === 'default' ? 'active' : ''}" onclick="changeTheme('${theme.id}')">
            <div class="theme-preview" style="background: ${theme.color};"></div>
            <div>${theme.name}</div>
        </div>
    `).join('');
}

function generateTransitionOptions() {
    const transitions = ['none', 'fade', 'slide', 'zoom'];
    return transitions.map(transition => `
        <div class="theme-option ${transition === 'none' ? 'active' : ''}" onclick="changeTransition('${transition}')">
            <div style="padding: 20px; text-transform: capitalize;">${transition}</div>
        </div>
    `).join('');
}

// Slide Management
function addSlide() {
    const newSlide = {
        id: Date.now(),
        layout: 'title',
        title: 'Nouvelle Diapositive',
        subtitle: '',
        content: '',
        notes: '',
        transition: 'none',
        shapes: [],
        images: [],
        // Team layout
        teamMembers: [],
        // Chart layout
        chartType: 'bar',
        chartData: [],
        chartTitle: 'Mon Graphique',
        // QCM layout
        qcmQuestion: '',
        qcmOptions: [],
        qcmCorrectAnswer: 0,
        qcmShowFeedback: false,
        // Timeline layout
        timelineItems: [],
        // Process layout
        processSteps: [],
        // SWOT layout
        swotData: {
            strengths: [],
            weaknesses: [],
            opportunities: [],
            threats: []
        },
        // Video layout
        videoUrl: '',
        videoTitle: '',
        // HTML layout
        htmlCode: '',
        htmlMode: 'preview',
        // Quote layout
        quoteText: '',
        quoteAuthor: ''
    };
    
    appState.slides.push(newSlide);
    saveToHistory();
    renderSlidesList();
    loadSlide(appState.slides.length - 1);
    showToast('Nouvelle diapositive ajoutée', 'success');
}

function deleteSlide(id, event) {
    event.stopPropagation();
    if (appState.slides.length > 1) {
        appState.slides = appState.slides.filter(slide => slide.id !== id);
        if (appState.currentSlideIndex >= appState.slides.length) {
            appState.currentSlideIndex = appState.slides.length - 1;
        }
        saveToHistory();
        renderSlidesList();
        loadSlide(appState.currentSlideIndex);
        showToast('Diapositive supprimée', 'warning');
    } else {
        showToast('Impossible de supprimer la dernière diapositive', 'error');
    }
}

function duplicateSlide(id, event) {
    event.stopPropagation();
    const slideIndex = appState.slides.findIndex(s => s.id === id);
    if (slideIndex !== -1) {
        const originalSlide = appState.slides[slideIndex];
        const duplicatedSlide = {
            ...originalSlide,
            id: Date.now()
        };
        appState.slides.splice(slideIndex + 1, 0, duplicatedSlide);
        saveToHistory();
        renderSlidesList();
        loadSlide(slideIndex + 1);
        showToast('Diapositive dupliquée', 'success');
    }
}

function renderSlidesList() {
    const slidesGrid = document.getElementById('slidesGrid');
    slidesGrid.innerHTML = '';
    
    appState.slides.forEach((slide, index) => {
        const slideThumbnail = document.createElement('div');
        slideThumbnail.className = `slide-thumbnail ${index === appState.currentSlideIndex ? 'active' : ''}`;
        slideThumbnail.onclick = () => loadSlide(index);
        
        slideThumbnail.innerHTML = `
            <div class="slide-preview">
                ${getSlidePreview(slide)}
            </div>
            <div class="slide-number">Diapo ${index + 1}</div>
            <div class="slide-actions">
                <button class="slide-action-btn" onclick="duplicateSlide(${slide.id}, event)" title="Dupliquer">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="slide-action-btn" onclick="deleteSlide(${slide.id}, event)" title="Supprimer">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        slidesGrid.appendChild(slideThumbnail);
    });
}

function getSlidePreview(slide) {
    switch(slide.layout) {
        case 'title':
            return `<div style="text-align: center; padding: 10px;">
                <div style="font-weight: bold; font-size: 0.7rem;">${slide.title}</div>
                <div style="font-size: 0.6rem; color: #666;">${slide.subtitle}</div>
            </div>`;
        case 'content':
            return `<div style="padding: 10px;">
                <div style="font-weight: bold; font-size: 0.7rem; margin-bottom: 5px;">${slide.title}</div>
                <div style="font-size: 0.5rem; color: #666;">${slide.content.substring(0, 30)}...</div>
            </div>`;
        case 'two-columns':
            return `<div style="display: flex; gap: 5px; padding: 10px;">
                <div style="flex: 1; border-right: 1px solid #ddd;">Col 1</div>
                <div style="flex: 1;">Col 2</div>
            </div>`;
        case 'quote':
            return `<div style="display: flex; align-items: center; justify-content: center; padding: 10px;">
                <div style="font-size: 1rem; color: var(--primary);">"</div>
            </div>`;
        default:
            return '';
    }
}

function loadSlide(index) {
    appState.currentSlideIndex = index;
    const slide = appState.slides[index];
    const slideContent = document.getElementById('slideContent');
    
    slideContent.className = `slide-content layout-${slide.layout}`;
    
    switch(slide.layout) {
        case 'title':
            slideContent.innerHTML = `
                <div class="title" contenteditable="true" onblur="updateSlideContent('title', this.innerText)">${slide.title}</div>
                <div class="subtitle" contenteditable="true" onblur="updateSlideContent('subtitle', this.innerText)">${slide.subtitle}</div>
            `;
            break;
        case 'content':
            slideContent.innerHTML = `
                <div class="title" contenteditable="true" onblur="updateSlideContent('title', this.innerText)">${slide.title}</div>
                <div class="content" contenteditable="true" onblur="updateSlideContent('content', this.innerText)">${slide.content}</div>
            `;
            break;
        case 'two-columns':
            slideContent.innerHTML = `
                <div class="column">
                    <div class="column-title" contenteditable="true">Colonne 1</div>
                    <div class="column-content" contenteditable="true">Contenu de la première colonne</div>
                </div>
                <div class="column">
                    <div class="column-title" contenteditable="true">Colonne 2</div>
                    <div class="column-content" contenteditable="true">Contenu de la deuxième colonne</div>
                </div>
            `;
            break;
        case 'three-columns':
            slideContent.innerHTML = `
                <div class="column">
                    <div class="column-title" contenteditable="true">Colonne 1</div>
                    <div class="column-content" contenteditable="true">Contenu 1</div>
                </div>
                <div class="column">
                    <div class="column-title" contenteditable="true">Colonne 2</div>
                    <div class="column-content" contenteditable="true">Contenu 2</div>
                </div>
                <div class="column">
                    <div class="column-title" contenteditable="true">Colonne 3</div>
                    <div class="column-content" contenteditable="true">Contenu 3</div>
                </div>
            `;
            break;
        case 'comparison':
            slideContent.innerHTML = `
                <div class="comparison-side left">
                    <div class="comparison-title" contenteditable="true">Option A</div>
                    <div class="comparison-content" contenteditable="true">Avantages de l'option A</div>
                </div>
                <div class="comparison-vs">VS</div>
                <div class="comparison-side right">
                    <div class="comparison-title" contenteditable="true">Option B</div>
                    <div class="comparison-content" contenteditable="true">Avantages de l'option B</div>
                </div>
            `;
            break;
        case 'quote':
            slideContent.innerHTML = `
                <div class="quote-icon">"</div>
                <div class="quote-text" contenteditable="true" onblur="updateSlideContent('quoteText', this.innerText)">${slide.quoteText || 'Votre citation ici'}</div>
                <div class="quote-author" contenteditable="true" onblur="updateSlideContent('quoteAuthor', this.innerText)">— ${slide.quoteAuthor || 'Auteur'}</div>
            `;
            break;
        case 'team':
            if (typeof renderTeamLayout === 'function') {
                renderTeamLayout(slide);
            }
            break;
        case 'chart':
            if (typeof renderChartLayout === 'function') {
                renderChartLayout(slide);
            }
            break;
        case 'qcm':
            if (typeof renderQcmLayout === 'function') {
                renderQcmLayout(slide);
            }
            break;
        case 'timeline':
            if (typeof renderTimelineLayout === 'function') {
                renderTimelineLayout(slide);
            }
            break;
        case 'process':
            if (typeof renderProcessLayout === 'function') {
                renderProcessLayout(slide);
            }
            break;
        case 'swot':
            if (typeof renderSwotLayout === 'function') {
                renderSwotLayout(slide);
            }
            break;
        case 'summary':
            if (typeof renderSummaryLayout === 'function') {
                renderSummaryLayout(slide);
            }
            break;
        case 'video':
            if (typeof renderVideoLayout === 'function') {
                renderVideoLayout(slide);
            }
            break;
        case 'html':
            if (typeof renderHtmlLayout === 'function') {
                renderHtmlLayout(slide);
            }
            break;
    }
    
    // Update notes
    const notesTextarea = document.querySelector('#notesTab textarea');
    if (notesTextarea) {
        notesTextarea.value = slide.notes || '';
    }
    
    renderSlidesList();
}

function updateSlideContent(field, value) {
    appState.slides[appState.currentSlideIndex][field] = value;
    saveToHistory();
    renderSlidesList();
}

function updateSlideNotes(value) {
    appState.slides[appState.currentSlideIndex].notes = value;
    saveToHistory();
}

// Layout Management
function changeLayout(layout) {
    appState.slides[appState.currentSlideIndex].layout = layout;
    saveToHistory();
    loadSlide(appState.currentSlideIndex);
    
    document.querySelectorAll('#layoutTab .theme-option').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.theme-option').classList.add('active');
    
    showToast(`Disposition changée: ${layout}`, 'success');
}

// Theme Management
function changeTheme(theme) {
    appState.currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    
    document.querySelectorAll('#themeTab .theme-option').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.theme-option').classList.add('active');
    
    showToast(`Thème appliqué: ${theme}`, 'success');
}

// Transition Management
function changeTransition(transition) {
    appState.slides[appState.currentSlideIndex].transition = transition;
    saveToHistory();
    
    document.querySelectorAll('#transitionTab .theme-option').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.theme-option').classList.add('active');
    
    showToast(`Transition appliquée: ${transition}`, 'success');
}

// Text Formatting
function formatText(command) {
    document.execCommand(command, false, null);
    saveToHistory();
}

function changeFont(font) {
    document.execCommand('fontName', false, font);
    saveToHistory();
}

function changeFontSize(size) {
    document.execCommand('fontSize', false, '7');
    const fontElements = document.getElementsByTagName('font');
    for (let i = 0; i < fontElements.length; i++) {
        if (fontElements[i].size === '7') {
            fontElements[i].removeAttribute('size');
            fontElements[i].style.fontSize = size + 'px';
        }
    }
    saveToHistory();
}

function changeTextColor(color) {
    document.execCommand('foreColor', false, color);
    saveToHistory();
}

function changeBackgroundColor(color) {
    document.execCommand('hiliteColor', false, color);
    saveToHistory();
}

function insertLink() {
    const url = prompt('Entrez l\'URL du lien:');
    if (url) {
        document.execCommand('createLink', false, url);
        saveToHistory();
    }
}

// Shape Management
function addShape(type) {
    showToast(`Fonction "${type}" en cours de développement`, 'info');
}

function addImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                showToast('Image ajoutée', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function addChart() {
    changeLayout('content');
    showToast('Graphique simplifié - Utilisez les modèles pour des graphiques avancés', 'info');
}

// Presentation Mode
function startPresentation() {
    appState.isPresentationMode = true;
    appState.presentationIndex = 0;
    document.getElementById('presentationOverlay').classList.add('active');
    showPresentationSlide();
    
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }
}

function showPresentationSlide() {
    const slide = appState.slides[appState.presentationIndex];
    const presentationSlide = document.getElementById('presentationSlide');
    const slideCounter = document.getElementById('slideCounter');
    
    presentationSlide.className = `presentation-slide layout-${slide.layout} slide-transition-${slide.transition}`;
    
    switch(slide.layout) {
        case 'title':
            presentationSlide.innerHTML = `
                <div class="title">${slide.title}</div>
                <div class="subtitle">${slide.subtitle}</div>
            `;
            break;
        case 'content':
            presentationSlide.innerHTML = `
                <div class="title">${slide.title}</div>
                <div class="content">${slide.content}</div>
            `;
            break;
        case 'two-columns':
            presentationSlide.innerHTML = `
                <div class="column">
                    <div class="column-title">Colonne 1</div>
                    <div class="column-content">Contenu 1</div>
                </div>
                <div class="column">
                    <div class="column-title">Colonne 2</div>
                    <div class="column-content">Contenu 2</div>
                </div>
            `;
            break;
        case 'quote':
            presentationSlide.innerHTML = `
                <div class="quote-icon">"</div>
                <div class="quote-text">${slide.quoteText || 'Votre citation'}</div>
                <div class="quote-author">— ${slide.quoteAuthor || 'Auteur'}</div>
            `;
            break;
    }
    
    slideCounter.textContent = `${appState.presentationIndex + 1} / ${appState.slides.length}`;
    
    const notesElement = document.getElementById('presentationNotes');
    if (slide.notes) {
        notesElement.textContent = slide.notes;
    } else {
        notesElement.style.display = 'none';
    }
}

function nextSlide() {
    if (appState.presentationIndex < appState.slides.length - 1) {
        appState.presentationIndex++;
        showPresentationSlide();
    }
}

function previousSlide() {
    if (appState.presentationIndex > 0) {
        appState.presentationIndex--;
        showPresentationSlide();
    }
}

function exitPresentation() {
    appState.isPresentationMode = false;
    document.getElementById('presentationOverlay').classList.remove('active');
    
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}

function toggleNotes() {
    const notesElement = document.getElementById('presentationNotes');
    notesElement.style.display = notesElement.style.display === 'none' ? 'block' : 'none';
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Templates
function openTemplates() {
    const modal = document.getElementById('templatesModal');
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Choisir un modèle</h2>
                <button class="modal-close" onclick="closeTemplates()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="theme-grid">
                <div class="theme-option" onclick="applyTemplate('business')">
                    <div class="theme-preview" style="display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-briefcase" style="font-size: 3rem; color: var(--primary);"></i>
                    </div>
                    <div style="font-weight: 600;">Professionnel</div>
                    <div style="font-size: 0.85rem; color: #6b7280;">Présentation d'entreprise</div>
                </div>
                <div class="theme-option" onclick="applyTemplate('education')">
                    <div class="theme-preview" style="display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-graduation-cap" style="font-size: 3rem; color: var(--secondary);"></i>
                    </div>
                    <div style="font-weight: 600;">Éducatif</div>
                    <div style="font-size: 0.85rem; color: #6b7280;">Leçon ou formation</div>
                </div>
                <div class="theme-option" onclick="applyTemplate('creative')">
                    <div class="theme-preview" style="display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-palette" style="font-size: 3rem; color: var(--accent);"></i>
                    </div>
                    <div style="font-weight: 600;">Créatif</div>
                    <div style="font-size: 0.85rem; color: #6b7280;">Portfolio artistique</div>
                </div>
                <div class="theme-option" onclick="applyTemplate('minimal')">
                    <div class="theme-preview" style="display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-minus" style="font-size: 3rem; color: var(--dark);"></i>
                    </div>
                    <div style="font-weight: 600;">Minimaliste</div>
                    <div style="font-size: 0.85rem; color: #6b7280;">Design épuré</div>
                </div>
            </div>
        </div>
    `;
    modal.classList.add('active');
}

function closeTemplates() {
    document.getElementById('templatesModal').classList.remove('active');
}

function applyTemplate(templateName) {
    const templates = {
        business: [
            { layout: 'title', title: 'Présentation Commerciale', subtitle: 'Stratégie 2024' },
            { layout: 'content', title: 'Objectifs', content: '• Croissance\n• Innovation\n• Excellence' },
            { layout: 'two-columns', title: 'Analyse' },
            { layout: 'quote', quoteText: 'Le succès est un voyage, pas une destination', quoteAuthor: 'Ben Sweetland' }
        ],
        education: [
            { layout: 'title', title: 'Cours: Sciences', subtitle: 'Module 3' },
            { layout: 'content', title: 'Objectifs', content: '• Comprendre\n• Appliquer\n• Maîtriser' },
            { layout: 'two-columns' },
            { layout: 'quote', quoteText: 'La connaissance est le pouvoir', quoteAuthor: 'Francis Bacon' }
        ],
        creative: [
            { layout: 'title', title: 'Portfolio Créatif', subtitle: 'Mes Réalisations' },
            { layout: 'content', title: 'Projets', content: 'Design • Photo • Art' },
            { layout: 'two-columns' },
            { layout: 'quote', quoteText: 'La créativité, c\'est l\'intelligence qui s\'amuse', quoteAuthor: 'Albert Einstein' }
        ],
        minimal: [
            { layout: 'title', title: 'Moins, c\'est plus', subtitle: '' },
            { layout: 'content', title: 'Principes', content: '• Simplicité\n• Clarté\n• Efficacité' },
            { layout: 'quote', quoteText: 'La simplicité est la sophistication suprême', quoteAuthor: 'Léonard de Vinci' }
        ]
    };
    
    if (templates[templateName]) {
        appState.slides = templates[templateName].map((slide, index) => ({
            ...slide,
            id: Date.now() + index,
            notes: '',
            transition: 'fade',
            shapes: [],
            images: []
        }));
        
        saveToHistory();
        renderSlidesList();
        loadSlide(0);
        closeTemplates();
        showToast(`Modèle "${templateName}" appliqué`, 'success');
    }
}

// Zoom Controls
function zoomIn() {
    appState.zoom = Math.min(appState.zoom + 0.1, 2);
    updateZoom();
}

function zoomOut() {
    appState.zoom = Math.max(appState.zoom - 0.1, 0.5);
    updateZoom();
}

function resetZoom() {
    appState.zoom = 1;
    updateZoom();
}

function updateZoom() {
    const canvasWrapper = document.getElementById('canvasWrapper');
    canvasWrapper.style.transform = `scale(${appState.zoom})`;
}

// Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

// Panel Tabs
function switchPanelTab(tabName) {
    document.querySelectorAll('.panel-tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    document.querySelectorAll('.panel-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName + 'Tab').style.display = 'block';
    event.target.classList.add('active');
}

// History Management
function saveToHistory() {
    const currentState = JSON.stringify(appState.slides);
    appState.history = appState.history.slice(0, appState.historyIndex + 1);
    appState.history.push(currentState);
    appState.historyIndex++;
    
    if (appState.history.length > 50) {
        appState.history.shift();
        appState.historyIndex--;
    }
}

function undo() {
    if (appState.historyIndex > 0) {
        appState.historyIndex--;
        appState.slides = JSON.parse(appState.history[appState.historyIndex]);
        renderSlidesList();
        loadSlide(appState.currentSlideIndex);
        showToast('Action annulée', 'success');
    }
}

function redo() {
    if (appState.historyIndex < appState.history.length - 1) {
        appState.historyIndex++;
        appState.slides = JSON.parse(appState.history[appState.historyIndex]);
        renderSlidesList();
        loadSlide(appState.currentSlideIndex);
        showToast('Action rétablie', 'success');
    }
}

// Save and Export
function savePresentation() {
    localStorage.setItem('presentation', JSON.stringify(appState.slides));
    showToast('Présentation sauvegardée localement', 'success');
}

function exportPresentation() {
    const presentationData = {
        title: 'Ma Présentation',
        slides: appState.slides,
        theme: appState.currentTheme,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(presentationData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `presentation_${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showToast('Présentation exportée', 'success');
}

function sharePresentation() {
    const shareData = {
        title: 'Ma Présentation',
        text: 'Découvrez ma présentation créée avec Présentation Pro Ultra',
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('Lien copié dans le presse-papiers', 'success');
    }
}

function printPresentation() {
    window.print();
    showToast('Préparation pour impression...', 'success');
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Keyboard Shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'n':
                    e.preventDefault();
                    addSlide();
                    break;
                case 's':
                    e.preventDefault();
                    savePresentation();
                    break;
                case 'z':
                    e.preventDefault();
                    if (e.shiftKey) {
                        redo();
                    } else {
                        undo();
                    }
                    break;
            }
        }
        
        if (appState.isPresentationMode) {
            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    nextSlide();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    previousSlide();
                    break;
                case 'Escape':
                    e.preventDefault();
                    exitPresentation();
                    break;
            }
        } else {
            if (e.key === 'F5') {
                e.preventDefault();
                startPresentation();
            }
        }
    });
}

// Drag and Drop Setup
function setupDragAndDrop() {
    const canvasContainer = document.getElementById('canvasContainer');
    
    canvasContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    });
    
    canvasContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                showToast('Image déposée - Fonction en cours de développement', 'info');
            }
        }
    });
}

// Load saved presentation on startup
window.addEventListener('load', () => {
    const savedPresentation = localStorage.getItem('presentation');
    if (savedPresentation) {
        try {
            appState.slides = JSON.parse(savedPresentation);
            showToast('Présentation restaurée', 'success');
        } catch (e) {
            console.error('Failed to load saved presentation:', e);
        }
    }
    
    initializeApp();
    saveToHistory();
});

// Auto-save every 30 seconds
setInterval(() => {
    savePresentation();
}, 30000);
