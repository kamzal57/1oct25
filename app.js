// Application State
const appState = {
    slides: [],
    currentSlideIndex: 0,
    zoom: 1,
    currentTheme: 'default',
    isPresentationMode: false,
    presentationIndex: 0,
    history: [],
    historyIndex: -1,
    selectedElement: null
};

// Theme definitions
const themes = {
    default: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        text: '#1e293b'
    },
    dark: {
        primary: '#6b7280',
        secondary: '#374151',
        background: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
        text: '#f3f4f6'
    },
    ocean: {
        primary: '#0ea5e9',
        secondary: '#06b6d4',
        background: 'linear-gradient(135deg, #667eea 0%, #00d4ff 100%)',
        text: '#0c4a6e'
    },
    sunset: {
        primary: '#f59e0b',
        secondary: '#ef4444',
        background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
        text: '#7c2d12'
    }
};

// Initialize app
function initializeApp() {
    if (appState.slides.length === 0) {
        appState.slides.push(createNewSlide('title'));
    }
    renderSlidesList();
    loadSlide(0);
    setupKeyboardShortcuts();
    setupDragAndDrop();
}

// Create a new slide
function createNewSlide(layout = 'content') {
    return {
        id: Date.now(),
        layout: layout,
        title: layout === 'title' ? 'Titre de la diapositive' : 'Titre',
        subtitle: '',
        content: '',
        notes: '',
        transition: 'fade',
        shapes: [],
        images: [],
        ...getSlideDefaults(layout)
    };
}

// Get default properties for each layout
function getSlideDefaults(layout) {
    const defaults = {
        title: { subtitle: 'Sous-titre', content: '' },
        content: { content: 'Votre contenu ici...' },
        'two-columns': { 
            column1Title: 'Colonne 1', 
            column1Content: 'Contenu de la colonne 1', 
            column2Title: 'Colonne 2', 
            column2Content: 'Contenu de la colonne 2' 
        },
        'three-columns': { 
            column1Title: 'Colonne 1', 
            column1Content: 'Contenu 1', 
            column2Title: 'Colonne 2', 
            column2Content: 'Contenu 2',
            column3Title: 'Colonne 3',
            column3Content: 'Contenu 3'
        },
        comparison: { 
            leftTitle: 'Option A', 
            leftContent: 'Avantages de l\'option A', 
            rightTitle: 'Option B', 
            rightContent: 'Avantages de l\'option B' 
        },
        quote: { quoteText: 'Votre citation inspirante', quoteAuthor: 'Auteur' },
        team: { teamMembers: [] },
        chart: { chartData: [], chartType: 'bar', chartTitle: 'Titre du graphique' },
        qcm: { 
            qcmQuestion: 'Votre question?', 
            qcmOptions: ['Option A', 'Option B', 'Option C', 'Option D'], 
            qcmCorrectAnswer: 0, 
            qcmFeedback: 'Bonne réponse!' 
        },
        timeline: { timelineItems: [] },
        process: { processSteps: [] },
        swot: { 
            swotStrengths: ['Force 1', 'Force 2'], 
            swotWeaknesses: ['Faiblesse 1', 'Faiblesse 2'], 
            swotOpportunities: ['Opportunité 1', 'Opportunité 2'], 
            swotThreats: ['Menace 1', 'Menace 2'] 
        },
        summary: {},
        video: { videoUrl: '', videoPlatform: 'youtube' },
        html: { htmlCode: '<h2>Contenu HTML</h2><p>Votre code HTML ici...</p>', htmlMode: 'split' }
    };
    return defaults[layout] || {};
}

// Add a new slide
function addSlide() {
    const newSlide = createNewSlide('content');
    appState.slides.push(newSlide);
    saveToHistory();
    renderSlidesList();
    loadSlide(appState.slides.length - 1);
    showToast('Diapositive ajoutée', 'success');
}

// Delete a slide
function deleteSlide(index) {
    if (appState.slides.length <= 1) {
        showToast('Impossible de supprimer la dernière diapositive', 'error');
        return;
    }
    
    if (confirm('Voulez-vous vraiment supprimer cette diapositive ?')) {
        appState.slides.splice(index, 1);
        saveToHistory();
        
        if (appState.currentSlideIndex >= appState.slides.length) {
            appState.currentSlideIndex = appState.slides.length - 1;
        }
        
        renderSlidesList();
        loadSlide(appState.currentSlideIndex);
        showToast('Diapositive supprimée', 'success');
    }
}

// Duplicate a slide
function duplicateSlide(index) {
    const slide = appState.slides[index];
    const duplicatedSlide = JSON.parse(JSON.stringify(slide));
    duplicatedSlide.id = Date.now();
    appState.slides.splice(index + 1, 0, duplicatedSlide);
    saveToHistory();
    renderSlidesList();
    loadSlide(index + 1);
    showToast('Diapositive dupliquée', 'success');
}

// Render the slides list
function renderSlidesList() {
    const slidesList = document.getElementById('slidesList');
    slidesList.innerHTML = '';
    
    appState.slides.forEach((slide, index) => {
        const slideItem = document.createElement('div');
        slideItem.className = `slide-item ${index === appState.currentSlideIndex ? 'active' : ''}`;
        slideItem.onclick = () => loadSlide(index);
        
        const theme = themes[appState.currentTheme];
        slideItem.innerHTML = `
            <div class="slide-thumbnail" style="background: ${theme.background};">
                ${index + 1}
            </div>
            <div class="slide-info">
                <span class="slide-number">Diapo ${index + 1}</span>
                <div class="slide-actions">
                    <button class="btn-icon" onclick="event.stopPropagation(); duplicateSlide(${index})" title="Dupliquer">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="btn-icon" onclick="event.stopPropagation(); deleteSlide(${index})" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        slidesList.appendChild(slideItem);
    });
}

// Load a slide
function loadSlide(index) {
    appState.currentSlideIndex = index;
    const slide = appState.slides[index];
    
    renderSlidesList();
    renderSlideOnCanvas(slide);
    
    // Update notes
    document.getElementById('notesTextarea').value = slide.notes || '';
    
    // Update transition
    document.getElementById('transitionSelect').value = slide.transition || 'fade';
}

// Render slide on canvas
function renderSlideOnCanvas(slide) {
    const canvas = document.getElementById('canvas');
    const theme = themes[appState.currentTheme];
    
    canvas.innerHTML = '';
    canvas.style.background = theme.background;
    canvas.style.color = theme.text;
    
    const layoutDiv = document.createElement('div');
    layoutDiv.className = 'slide-layout';
    
    // Render based on layout type
    switch(slide.layout) {
        case 'title':
            layoutDiv.className += ' slide-title-layout';
            layoutDiv.innerHTML = `
                <h1 contenteditable="true" onblur="updateSlideProperty('title', this.textContent)">${slide.title || 'Titre'}</h1>
                <h2 contenteditable="true" onblur="updateSlideProperty('subtitle', this.textContent)">${slide.subtitle || 'Sous-titre'}</h2>
            `;
            break;
            
        case 'content':
            layoutDiv.className += ' slide-content-layout';
            layoutDiv.innerHTML = `
                <h2 contenteditable="true" onblur="updateSlideProperty('title', this.textContent)">${slide.title || 'Titre'}</h2>
                <div class="content" contenteditable="true" onblur="updateSlideProperty('content', this.textContent)">${slide.content || 'Contenu'}</div>
            `;
            break;
            
        case 'two-columns':
            layoutDiv.className += ' slide-two-columns-layout';
            layoutDiv.innerHTML = `
                <div class="slide-column">
                    <h3 contenteditable="true" onblur="updateSlideProperty('column1Title', this.textContent)">${slide.column1Title || 'Colonne 1'}</h3>
                    <div contenteditable="true" onblur="updateSlideProperty('column1Content', this.textContent)">${slide.column1Content || 'Contenu'}</div>
                </div>
                <div class="slide-column">
                    <h3 contenteditable="true" onblur="updateSlideProperty('column2Title', this.textContent)">${slide.column2Title || 'Colonne 2'}</h3>
                    <div contenteditable="true" onblur="updateSlideProperty('column2Content', this.textContent)">${slide.column2Content || 'Contenu'}</div>
                </div>
            `;
            break;
            
        case 'three-columns':
            layoutDiv.className += ' slide-three-columns-layout';
            layoutDiv.innerHTML = `
                <div class="slide-column">
                    <h3 contenteditable="true" onblur="updateSlideProperty('column1Title', this.textContent)">${slide.column1Title || 'Colonne 1'}</h3>
                    <div contenteditable="true" onblur="updateSlideProperty('column1Content', this.textContent)">${slide.column1Content || ''}</div>
                </div>
                <div class="slide-column">
                    <h3 contenteditable="true" onblur="updateSlideProperty('column2Title', this.textContent)">${slide.column2Title || 'Colonne 2'}</h3>
                    <div contenteditable="true" onblur="updateSlideProperty('column2Content', this.textContent)">${slide.column2Content || ''}</div>
                </div>
                <div class="slide-column">
                    <h3 contenteditable="true" onblur="updateSlideProperty('column3Title', this.textContent)">${slide.column3Title || 'Colonne 3'}</h3>
                    <div contenteditable="true" onblur="updateSlideProperty('column3Content', this.textContent)">${slide.column3Content || ''}</div>
                </div>
            `;
            break;
            
        case 'comparison':
            layoutDiv.className += ' slide-comparison-layout';
            layoutDiv.innerHTML = `
                <div class="comparison-side left">
                    <h3 contenteditable="true" onblur="updateSlideProperty('leftTitle', this.textContent)">${slide.leftTitle || 'Option A'}</h3>
                    <div contenteditable="true" onblur="updateSlideProperty('leftContent', this.textContent)">${slide.leftContent || 'Contenu'}</div>
                </div>
                <div class="comparison-side right">
                    <h3 contenteditable="true" onblur="updateSlideProperty('rightTitle', this.textContent)">${slide.rightTitle || 'Option B'}</h3>
                    <div contenteditable="true" onblur="updateSlideProperty('rightContent', this.textContent)">${slide.rightContent || 'Contenu'}</div>
                </div>
            `;
            break;
            
        case 'quote':
            layoutDiv.className += ' slide-quote-layout';
            layoutDiv.innerHTML = `
                <div class="quote-text" contenteditable="true" onblur="updateSlideProperty('quoteText', this.textContent)">${slide.quoteText || 'Citation'}</div>
                <div class="quote-author" contenteditable="true" onblur="updateSlideProperty('quoteAuthor', this.textContent)">— ${slide.quoteAuthor || 'Auteur'}</div>
            `;
            break;
            
        default:
            // For other layouts, use the layouts.js rendering
            if (typeof renderAdvancedLayout === 'function') {
                layoutDiv.innerHTML = renderAdvancedLayout(slide);
            } else {
                layoutDiv.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #6b7280;">Layout non supporté</div>';
            }
    }
    
    canvas.appendChild(layoutDiv);
}

// Update slide property
function updateSlideProperty(property, value) {
    appState.slides[appState.currentSlideIndex][property] = value;
    saveToHistory();
}

// Change layout
function changeLayout(layout) {
    const slide = appState.slides[appState.currentSlideIndex];
    slide.layout = layout;
    Object.assign(slide, getSlideDefaults(layout));
    saveToHistory();
    loadSlide(appState.currentSlideIndex);
    showToast(`Disposition changée: ${layout}`, 'success');
}

// Change theme
function changeTheme(themeName) {
    appState.currentTheme = themeName;
    renderSlidesList();
    loadSlide(appState.currentSlideIndex);
    showToast(`Thème changé: ${themeName}`, 'success');
}

// Change transition
function changeTransition(transition) {
    appState.slides[appState.currentSlideIndex].transition = transition;
    saveToHistory();
    showToast(`Transition changée: ${transition}`, 'success');
}

// Update notes
function updateNotes() {
    const notes = document.getElementById('notesTextarea').value;
    appState.slides[appState.currentSlideIndex].notes = notes;
    saveToHistory();
}

// Presentation Mode
function startPresentation() {
    appState.isPresentationMode = true;
    appState.presentationIndex = 0;
    document.getElementById('presentationOverlay').classList.add('active');
    showPresentationSlide();
    
    // Request fullscreen
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }
}

function showPresentationSlide() {
    const slide = appState.slides[appState.presentationIndex];
    const slideElement = document.getElementById('presentationSlide');
    const theme = themes[appState.currentTheme];
    
    slideElement.style.background = theme.background;
    slideElement.style.color = theme.text;
    
    // Render slide content for presentation
    slideElement.innerHTML = renderSlideForPresentation(slide);
    
    // Update counter
    document.getElementById('slideCounter').textContent = `${appState.presentationIndex + 1} / ${appState.slides.length}`;
    
    // Update notes
    const notesElement = document.getElementById('presentationNotes');
    notesElement.textContent = slide.notes || 'Aucune note';
}

function renderSlideForPresentation(slide) {
    const layoutDiv = document.createElement('div');
    layoutDiv.className = 'slide-layout';
    
    switch(slide.layout) {
        case 'title':
            layoutDiv.className += ' slide-title-layout';
            layoutDiv.innerHTML = `
                <h1>${slide.title || ''}</h1>
                <h2>${slide.subtitle || ''}</h2>
            `;
            break;
            
        case 'content':
            layoutDiv.className += ' slide-content-layout';
            layoutDiv.innerHTML = `
                <h2>${slide.title || ''}</h2>
                <div class="content">${slide.content || ''}</div>
            `;
            break;
            
        case 'two-columns':
            layoutDiv.className += ' slide-two-columns-layout';
            layoutDiv.innerHTML = `
                <div class="slide-column">
                    <h3>${slide.column1Title || ''}</h3>
                    <div>${slide.column1Content || ''}</div>
                </div>
                <div class="slide-column">
                    <h3>${slide.column2Title || ''}</h3>
                    <div>${slide.column2Content || ''}</div>
                </div>
            `;
            break;
            
        case 'three-columns':
            layoutDiv.className += ' slide-three-columns-layout';
            layoutDiv.innerHTML = `
                <div class="slide-column">
                    <h3>${slide.column1Title || ''}</h3>
                    <div>${slide.column1Content || ''}</div>
                </div>
                <div class="slide-column">
                    <h3>${slide.column2Title || ''}</h3>
                    <div>${slide.column2Content || ''}</div>
                </div>
                <div class="slide-column">
                    <h3>${slide.column3Title || ''}</h3>
                    <div>${slide.column3Content || ''}</div>
                </div>
            `;
            break;
            
        case 'comparison':
            layoutDiv.className += ' slide-comparison-layout';
            layoutDiv.innerHTML = `
                <div class="comparison-side left">
                    <h3>${slide.leftTitle || ''}</h3>
                    <div>${slide.leftContent || ''}</div>
                </div>
                <div class="comparison-side right">
                    <h3>${slide.rightTitle || ''}</h3>
                    <div>${slide.rightContent || ''}</div>
                </div>
            `;
            break;
            
        case 'quote':
            layoutDiv.className += ' slide-quote-layout';
            layoutDiv.innerHTML = `
                <div class="quote-text">${slide.quoteText || ''}</div>
                <div class="quote-author">— ${slide.quoteAuthor || ''}</div>
            `;
            break;
            
        case 'video':
            return renderVideoPresentation(slide);
            
        case 'html':
            return renderHtmlPresentation(slide);
            
        default:
            // For other layouts, use the layouts.js rendering
            if (typeof renderAdvancedLayoutForPresentation === 'function') {
                return renderAdvancedLayoutForPresentation(slide);
            }
            layoutDiv.innerHTML = '<div>Layout non supporté</div>';
    }
    
    return layoutDiv.outerHTML;
}

function renderVideoPresentation(slide) {
    if (slide.videoUrl) {
        return `
            <div class="video-container" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 40px;">
                <div class="video-player" style="width: 100%; max-width: 900px; aspect-ratio: 16/9;">
                    ${getVideoEmbed(slide.videoUrl, slide.videoPlatform)}
                </div>
            </div>
        `;
    } else {
        return `
            <div class="video-container" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                <div class="video-placeholder">
                    <i class="fas fa-play-circle" style="font-size: 4rem;"></i>
                    <div style="font-size: 1.5rem; margin-top: 20px;">Aucune vidéo</div>
                </div>
            </div>
        `;
    }
}

function getVideoEmbed(url, platform) {
    let videoId = '';
    
    if (platform === 'youtube') {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
        videoId = match ? match[1] : '';
        return `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width: 100%; height: 100%;"></iframe>`;
    } else if (platform === 'vimeo') {
        const match = url.match(/vimeo\.com\/(\d+)/);
        videoId = match ? match[1] : '';
        return `<iframe src="https://player.vimeo.com/video/${videoId}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="width: 100%; height: 100%;"></iframe>`;
    } else if (platform === 'dailymotion') {
        const match = url.match(/dailymotion\.com\/video\/([^_]+)/);
        videoId = match ? match[1] : '';
        return `<iframe src="https://www.dailymotion.com/embed/video/${videoId}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen style="width: 100%; height: 100%;"></iframe>`;
    }
    
    return '<div style="display: flex; align-items: center; justify-content: center; height: 100%;"><p>URL vidéo invalide</p></div>';
}

function renderHtmlPresentation(slide) {
    if (slide.htmlCode) {
        return `
            <div class="html-preview-content" style="width: 100%; height: 100%; overflow: auto; padding: 40px;">
                ${slide.htmlCode}
            </div>
        `;
    } else {
        return `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
                <div style="text-align: center; color: #6b7280;">
                    <i class="fas fa-code" style="font-size: 4rem; margin-bottom: 20px;"></i>
                    <div style="font-size: 1.5rem;">Aucun code HTML</div>
                </div>
            </div>
        `;
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
    
    // Exit fullscreen
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
    document.getElementById('zoomLevel').textContent = `${Math.round(appState.zoom * 100)}%`;
}

// Sidebar & Panel Toggles
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

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

function toggleRightPanel() {
    const rightPanel = document.getElementById('rightPanel');
    rightPanel.classList.toggle('hidden');
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
    localStorage.setItem('presentationTheme', appState.currentTheme);
    showToast('Présentation sauvegardée', 'success');
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
        text: 'Découvrez ma présentation',
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('Lien copié', 'success');
    }
}

function printPresentation() {
    window.print();
}

// Templates
function openTemplates() {
    document.getElementById('templatesModal').classList.add('active');
}

function closeTemplates() {
    document.getElementById('templatesModal').classList.remove('active');
}

function applyTemplate(templateName) {
    const templates = {
        business: [
            { layout: 'title', title: 'Présentation Commerciale', subtitle: 'Stratégie 2024' },
            { layout: 'summary' },
            { layout: 'content', title: 'Notre Vision', content: 'Présentation de la vision stratégique...' },
            { layout: 'two-columns', column1Title: 'Forces', column1Content: 'Nos atouts', column2Title: 'Objectifs', column2Content: 'Nos cibles' },
            { layout: 'chart', chartTitle: 'Résultats' }
        ],
        education: [
            { layout: 'title', title: 'Leçon: Les Sciences', subtitle: 'Module 3 - Physique' },
            { layout: 'content', title: 'Objectifs', content: '• Comprendre les concepts\n• Appliquer les formules' },
            { layout: 'qcm' },
            { layout: 'timeline' }
        ],
        creative: [
            { layout: 'title', title: 'Portfolio Créatif', subtitle: 'Mes Réalisations' },
            { layout: 'team' },
            { layout: 'comparison', leftTitle: 'Avant', leftContent: 'Design initial', rightTitle: 'Après', rightContent: 'Design final' }
        ],
        tech: [
            { layout: 'title', title: 'Architecture Technique', subtitle: 'Solution Scalable' },
            { layout: 'content', title: 'Stack', content: '• Frontend: React\n• Backend: Node.js' },
            { layout: 'process' },
            { layout: 'swot' }
        ],
        marketing: [
            { layout: 'title', title: 'Campagne Marketing', subtitle: 'Lancement 2024' },
            { layout: 'three-columns' },
            { layout: 'chart' }
        ],
        minimal: [
            { layout: 'title', title: 'Moins, c\'est plus', subtitle: '' },
            { layout: 'content', title: 'Principes', content: '• Simplicité\n• Clarté\n• Efficacité' },
            { layout: 'quote', quoteText: 'La perfection est atteinte...', quoteAuthor: 'Antoine de Saint-Exupéry' }
        ]
    };
    
    if (templates[templateName]) {
        appState.slides = templates[templateName].map((slide, index) => ({
            ...createNewSlide(slide.layout),
            ...slide,
            id: Date.now() + index
        }));
        
        saveToHistory();
        renderSlidesList();
        loadSlide(0);
        closeTemplates();
        showToast(`Modèle "${templateName}" appliqué`, 'success');
    }
}

// Toast
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
                case 'e':
                    e.preventDefault();
                    exportPresentation();
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
                case 'n':
                    e.preventDefault();
                    toggleNotes();
                    break;
                case 'f':
                    e.preventDefault();
                    toggleFullscreen();
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

// Drag and Drop
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
                const reader = new FileReader();
                reader.onload = (event) => {
                    showToast('Image importée', 'success');
                };
                reader.readAsDataURL(file);
            }
        }
    });
}

// Load saved presentation
window.addEventListener('load', () => {
    const savedPresentation = localStorage.getItem('presentation');
    const savedTheme = localStorage.getItem('presentationTheme');
    
    if (savedPresentation) {
        try {
            appState.slides = JSON.parse(savedPresentation);
            showToast('Présentation restaurée', 'success');
        } catch (e) {
            console.error('Failed to load saved presentation:', e);
        }
    }
    
    if (savedTheme) {
        appState.currentTheme = savedTheme;
    }
    
    initializeApp();
    saveToHistory();
});

// Auto-save
setInterval(() => {
    savePresentation();
}, 30000);
