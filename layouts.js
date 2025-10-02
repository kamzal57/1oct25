// layouts.js - Gestion des layouts avancés

function renderTeamLayout(slide) {
    const slideContent = document.getElementById('slideContent');
    const teamHierarchy = organizeTeamHierarchy(slide.teamMembers || []);
    
    let html = '<div class="team-hierarchy">';
    
    ['ceo', 'director', 'manager', 'employee'].forEach(level => {
        if (teamHierarchy[level] && teamHierarchy[level].length > 0) {
            html += '<div class="team-level">';
            teamHierarchy[level].forEach(member => {
                html += createTeamMemberElement(member);
            });
            html += '</div>';
        }
    });
    
    if (!appState.isPresentationMode) {
        html += `
            <div class="team-level">
                <div class="add-team-member" onclick="openTeamMemberModal()">
                    <i class="fas fa-plus"></i>
                    <span>Ajouter un membre</span>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    slideContent.innerHTML = html;
}

function organizeTeamHierarchy(teamMembers) {
    return {
        ceo: teamMembers.filter(m => m.level === 'ceo'),
        director: teamMembers.filter(m => m.level === 'director'),
        manager: teamMembers.filter(m => m.level === 'manager'),
        employee: teamMembers.filter(m => m.level === 'employee')
    };
}

function createTeamMemberElement(member) {
    const levelClass = `level-${member.level}`;
    return `
        <div class="team-member ${levelClass}" data-id="${member.id}">
            <div class="team-avatar">${member.avatar}</div>
            <div class="team-name" ${!appState.isPresentationMode ? `contenteditable="true" onblur="updateTeamMember(${member.id}, 'name', this.innerText)"` : ''}>${member.name}</div>
            <div class="team-role" ${!appState.isPresentationMode ? `contenteditable="true" onblur="updateTeamMember(${member.id}, 'role', this.innerText)"` : ''}>${member.role}</div>
            <div class="team-level-badge ${levelClass}">${getLevelLabel(member.level)}</div>
            ${!appState.isPresentationMode ? `
                <div class="team-member-actions">
                    <div class="team-member-action" onclick="editTeamMember(${member.id})" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </div>
                    <div class="team-member-action" onclick="deleteTeamMember(${member.id})" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

function getLevelLabel(level) {
    const labels = {
        ceo: 'CEO',
        director: 'Directeur',
        manager: 'Manager',
        employee: 'Employé'
    };
    return labels[level] || level;
}

function renderChartLayout(slide) {
    const slideContent = document.getElementById('slideContent');
    
    let html = `
        <div class="chart-title" ${!appState.isPresentationMode ? `contenteditable="true" onblur="updateSlideContent('title', this.innerText)"` : ''}>${slide.title || 'Graphique'}</div>
        ${!appState.isPresentationMode ? `
            <div class="chart-type-selector">
                <button class="chart-type-btn ${slide.chartType === 'bar' ? 'active' : ''}" onclick="changeChartType('bar')">
                    <i class="fas fa-chart-bar"></i> Barres
                </button>
                <button class="chart-type-btn ${slide.chartType === 'pie' ? 'active' : ''}" onclick="changeChartType('pie')">
                    <i class="fas fa-chart-pie"></i> Camembert
                </button>
                <button class="chart-type-btn ${slide.chartType === 'line' ? 'active' : ''}" onclick="changeChartType('line')">
                    <i class="fas fa-chart-line"></i> Ligne
                </button>
            </div>
        ` : ''}
        <div class="chart-container">
    `;
    
    const chartData = slide.chartData || [
        { label: 'Jan', value: 65 },
        { label: 'Fév', value: 80 },
        { label: 'Mar', value: 45 },
        { label: 'Avr', value: 90 }
    ];
    
    switch(slide.chartType || 'bar') {
        case 'bar':
            html += renderBarChart(chartData);
            break;
        case 'pie':
            html += renderPieChart(chartData);
            break;
        case 'line':
            html += renderLineChart(chartData);
            break;
    }
    
    if (!appState.isPresentationMode) {
        html += `
            <div class="chart-data-editor">
                <h3>Données du graphique</h3>
                <div id="chartDataRows">
        `;
        
        chartData.forEach((data, index) => {
            html += `
                <div class="data-row">
                    <input type="text" class="data-input" value="${data.label}" onchange="updateChartData(${index}, 'label', this.value)">
                    <input type="number" class="data-input" value="${data.value}" onchange="updateChartData(${index}, 'value', this.value)">
                    <button class="data-remove" onclick="removeChartData(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        });
        
        html += `
                </div>
                <button class="add-data-row" onclick="addChartData()">
                    <i class="fas fa-plus"></i> Ajouter
                </button>
            </div>
        `;
    }
    
    html += '</div>';
    slideContent.innerHTML = html;
}

function renderBarChart(data) {
    let html = '<div class="bar-chart">';
    data.forEach(item => {
        const height = Math.max(item.value * 2, 20);
        html += `
            <div class="bar" style="height: ${height}px;">
                <div class="bar-value">${item.value}</div>
                <div class="bar-label">${item.label}</div>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

function renderPieChart(data) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];
    
    let html = '<div style="display: flex; flex-direction: column; align-items: center;">';
    html += '<svg width="300" height="300" viewBox="0 0 300 300">';
    
    let currentAngle = 0;
    data.forEach((item, index) => {
        const percentage = (item.value / total) * 100;
        const angle = (percentage / 100) * 360;
        const endAngle = currentAngle + angle;
        
        const x1 = 150 + 140 * Math.cos((currentAngle - 90) * Math.PI / 180);
        const y1 = 150 + 140 * Math.sin((currentAngle - 90) * Math.PI / 180);
        const x2 = 150 + 140 * Math.cos((endAngle - 90) * Math.PI / 180);
        const y2 = 150 + 140 * Math.sin((endAngle - 90) * Math.PI / 180);
        
        const largeArcFlag = angle > 180 ? 1 : 0;
        
        html += `
            <path d="M 150 150 L ${x1} ${y1} A 140 140 0 ${largeArcFlag} 1 ${x2} ${y2} Z" 
                  fill="${colors[index % colors.length]}" 
                  stroke="white" 
                  stroke-width="2"/>
        `;
        
        currentAngle = endAngle;
    });
    
    html += '</svg>';
    html += '<div class="pie-legend">';
    data.forEach((item, index) => {
        html += `
            <div class="legend-item">
                <div class="legend-color" style="background: ${colors[index % colors.length]};"></div>
                <span>${item.label}: ${item.value}</span>
            </div>
        `;
    });
    html += '</div></div>';
    
    return html;
}

function renderLineChart(data) {
    const maxValue = Math.max(...data.map(d => d.value));
    const points = data.map((item, i) => {
        const x = 50 + i * (700 / (data.length - 1 || 1));
        const y = 250 - (item.value / maxValue) * 200;
        return `${x},${y}`;
    }).join(' ');
    
    let html = '<svg width="800" height="300" viewBox="0 0 800 300">';
    
    // Grid
    for (let i = 0; i <= 5; i++) {
        html += `<line x1="50" y1="${50 + i * 40}" x2="750" y2="${50 + i * 40}" stroke="#e5e7eb" stroke-width="1"/>`;
    }
    
    // Line
    html += `<polyline points="${points}" fill="none" stroke="#6366f1" stroke-width="3"/>`;
    
    // Points and labels
    data.forEach((item, i) => {
        const x = 50 + i * (700 / (data.length - 1 || 1));
        const y = 250 - (item.value / maxValue) * 200;
        html += `
            <circle cx="${x}" cy="${y}" r="5" fill="#6366f1"/>
            <text x="${x}" y="${y - 10}" text-anchor="middle" font-size="12" fill="#6366f1">${item.value}</text>
            <text x="${x}" y="280" text-anchor="middle" font-size="12" fill="#6b7280">${item.label}</text>
        `;
    });
    
    html += '</svg>';
    return html;
}

function renderQcmLayout(slide) {
    const slideContent = document.getElementById('slideContent');
    
    const question = slide.qcmQuestion || 'Votre question ici?';
    const options = slide.qcmOptions || ['Option A', 'Option B', 'Option C', 'Option D'];
    const correctAnswer = slide.qcmCorrectAnswer || 0;
    
    let html = `
        <div class="qcm-question" ${!appState.isPresentationMode ? `contenteditable="true" onblur="updateSlideContent('qcmQuestion', this.innerText)"` : ''}>${question}</div>
        <div class="qcm-options">
    `;
    
    options.forEach((option, index) => {
        html += `
            <div class="qcm-option" onclick="selectQcmOption(${index})">
                <div class="qcm-option-letter">${String.fromCharCode(65 + index)}</div>
                <div class="qcm-option-text" ${!appState.isPresentationMode ? `contenteditable="true" onblur="updateQcmOption(${index}, this.innerText)"` : ''}>${option}</div>
            </div>
        `;
    });
    
    html += '</div>';
    
    if (!appState.isPresentationMode) {
        html += `
            <div class="qcm-controls">
                <button class="qcm-btn qcm-btn-secondary" onclick="openQcmModal()">
                    <i class="fas fa-cog"></i> Paramètres
                </button>
            </div>
        `;
    }
    
    html += '<div class="qcm-feedback" id="qcmFeedback" style="display: none;"></div>';
    
    slideContent.innerHTML = html;
}

function renderTimelineLayout(slide) {
    const slideContent = document.getElementById('slideContent');
    const items = slide.timelineItems || [
        { date: '2020', title: 'Événement 1', description: 'Description' },
        { date: '2021', title: 'Événement 2', description: 'Description' },
        { date: '2022', title: 'Événement 3', description: 'Description' }
    ];
    
    let html = '<div class="timeline">';
    
    items.forEach((item, index) => {
        html += `
            <div class="timeline-item">
                <div class="timeline-content">
                    <div class="timeline-date" ${!appState.isPresentationMode ? `contenteditable="true" onblur="updateTimelineItem(${index}, 'date', this.innerText)"` : ''}>${item.date}</div>
                    <div class="timeline-title" ${!appState.isPresentationMode ? `contenteditable="true" onblur="updateTimelineItem(${index}, 'title', this.innerText)"` : ''}>${item.title}</div>
                    <div class="timeline-description" ${!appState.isPresentationMode ? `contenteditable="true" onblur="updateTimelineItem(${index}, 'description', this.innerText)"` : ''}>${item.description}</div>
                </div>
                <div class="timeline-dot"></div>
            </div>
        `;
    });
    
    html += '</div>';
    
    if (!appState.isPresentationMode) {
        html += `
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-primary" onclick="addTimelineItem()">
                    <i class="fas fa-plus"></i> Ajouter un événement
                </button>
            </div>
        `;
    }
    
    slideContent.innerHTML = html;
}

function renderProcessLayout(slide) {
    const slideContent = document.getElementById('slideContent');
    const steps = slide.processSteps || [
        { number: 1, title: 'Étape 1', description: 'Description' },
        { number: 2, title: 'Étape 2', description: 'Description' },
        { number: 3, title: 'Étape 3', description: 'Description' }
    ];
    
    let html = '<div class="process-flow">';
    
    steps.forEach((step, index) => {
        html += `
            <div class="process-step">
                <div class="process-step-number">${step.number}</div>
                <div class="process-step-title" ${!appState.isPresentationMode ? `contenteditable="true" onblur="updateProcessStep(${index}, 'title', this.innerText)"` : ''}>${step.title}</div>
                <div class="process-step-description" ${!appState.isPresentationMode ? `contenteditable="true" onblur="updateProcessStep(${index}, 'description', this.innerText)"` : ''}>${step.description}</div>
            </div>
        `;
        
        if (index < steps.length - 1) {
            html += '<div class="process-connector"></div>';
        }
    });
    
    html += '</div>';
    
    if (!appState.isPresentationMode) {
        html += `
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-primary" onclick="addProcessStep()">
                    <i class="fas fa-plus"></i> Ajouter une étape
                </button>
            </div>
        `;
    }
    
    slideContent.innerHTML = html;
}

function renderSwotLayout(slide) {
    const slideContent = document.getElementById('slideContent');
    
    const swotData = {
        strengths: slide.swotStrengths || ['Force 1', 'Force 2'],
        weaknesses: slide.swotWeaknesses || ['Faiblesse 1', 'Faiblesse 2'],
        opportunities: slide.swotOpportunities || ['Opportunité 1', 'Opportunité 2'],
        threats: slide.swotThreats || ['Menace 1', 'Menace 2']
    };
    
    const titles = {
        strengths: 'Forces',
        weaknesses: 'Faiblesses',
        opportunities: 'Opportunités',
        threats: 'Menaces'
    };
    
    let html = '<div class="layout-swot">';
    
    Object.keys(swotData).forEach(category => {
        html += `
            <div class="swot-quadrant ${category}">
                <div class="swot-title">${titles[category]}</div>
                <ul class="swot-list">
        `;
        
        swotData[category].forEach((item, index) => {
            html += `<li class="swot-item" ${!appState.isPresentationMode ? `contenteditable="true" onblur="updateSwotItem('${category}', ${index}, this.innerText)"` : ''}>${item}</li>`;
        });
        
        html += '</ul>';
        
        if (!appState.isPresentationMode) {
            html += `
                <button class="btn btn-secondary" onclick="addSwotItem('${category}')" style="margin-top: 10px;">
                    <i class="fas fa-plus"></i> Ajouter
                </button>
            `;
        }
        
        html += '</div>';
    });
    
    html += '</div>';
    slideContent.innerHTML = html;
}

function renderSummaryLayout(slide) {
    const slideContent = document.getElementById('slideContent');
    
    let html = `
        <div class="summary-title">Sommaire de la Présentation</div>
        <div class="summary-grid">
    `;
    
    appState.slides.forEach((s, index) => {
        const isActive = index === appState.currentSlideIndex;
        html += `
            <div class="summary-item ${isActive ? 'active' : ''}" ${!appState.isPresentationMode ? `onclick="loadSlide(${index})"` : ''}>
                <div class="summary-preview">
                    ${getSlidePreview(s)}
                </div>
                <div class="summary-info">
                    <span class="summary-number">Diapo ${index + 1}</span>
                    <span class="summary-layout">${getLayoutLabel(s.layout)}</span>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    slideContent.innerHTML = html;
}

function getLayoutLabel(layout) {
    const labels = {
        'title': 'Titre',
        'content': 'Contenu',
        'two-columns': '2 Colonnes',
        'three-columns': '3 Colonnes',
        'comparison': 'Comparaison',
        'quote': 'Citation',
        'team': 'Équipe',
        'chart': 'Graphique',
        'qcm': 'QCM',
        'timeline': 'Chronologie',
        'process': 'Processus',
        'swot': 'SWOT',
        'summary': 'Sommaire',
        'video': 'Vidéo',
        'html': 'HTML'
    };
    return labels[layout] || layout;
}

function renderVideoLayout(slide) {
    const slideContent = document.getElementById('slideContent');
    
    let videoEmbed = '';
    if (slide.videoUrl) {
        videoEmbed = getVideoEmbed(slide.videoUrl);
    }
    
    let html = `
        <div class="video-container">
            <div class="video-player">
                ${videoEmbed || `
                    <div class="video-placeholder">
                        <i class="fas fa-play-circle"></i>
                        <div>Aucune vidéo sélectionnée</div>
                    </div>
                `}
            </div>
            ${!appState.isPresentationMode ? `
                <div class="video-controls">
                    <input type="text" class="video-input" id="videoUrlInput" placeholder="URL de la vidéo (YouTube, Vimeo...)" value="${slide.videoUrl || ''}">
                    <button class="video-btn" onclick="updateVideo()">
                        <i class="fas fa-upload"></i> Charger
                    </button>
                </div>
                <div class="video-info">
                    Supporte : YouTube, Vimeo, Dailymotion
                </div>
            ` : ''}
        </div>
    `;
    
    slideContent.innerHTML = html;
}

function getVideoEmbed(url) {
    if (!url) return '';
    
    // YouTube
    if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        if (videoId) return `<iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>`;
    }
    if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        if (videoId) return `<iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>`;
    }
    
    // Vimeo
    if (url.includes('vimeo.com/')) {
        const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
        if (videoId) return `<iframe src="https://player.vimeo.com/video/${videoId}" allowfullscreen></iframe>`;
    }
    
    // Dailymotion
    if (url.includes('dailymotion.com/video/')) {
        const videoId = url.split('dailymotion.com/video/')[1]?.split('_')[0];
        if (videoId) return `<iframe src="https://www.dailymotion.com/embed/video/${videoId}" allowfullscreen></iframe>`;
    }
    
    return `<iframe src="${url}" allowfullscreen></iframe>`;
}

function renderHtmlLayout(slide) {
    const slideContent = document.getElementById('slideContent');
    const mode = slide.htmlMode || 'split';
    
    let html = `
        <div class="html-container">
            ${!appState.isPresentationMode ? `
                <div class="html-editor">
                    <div class="html-toolbar">
                        <button class="html-toolbar-btn ${mode === 'code' ? 'active' : ''}" onclick="switchHtmlMode('code')">
                            <i class="fas fa-code"></i> Code
                        </button>
                        <button class="html-toolbar-btn ${mode === 'preview' ? 'active' : ''}" onclick="switchHtmlMode('preview')">
                            <i class="fas fa-eye"></i> Aperçu
                        </button>
                        <button class="html-toolbar-btn ${mode === 'split' ? 'active' : ''}" onclick="switchHtmlMode('split')">
                            <i class="fas fa-columns"></i> Divisé
                        </button>
                    </div>
                    <div style="display: flex; gap: 20px; height: 400px;">
                        <div style="${mode === 'preview' ? 'display: none;' : mode === 'split' ? 'flex: 1;' : 'flex: 1;'}">
                            <textarea class="html-code-editor" id="htmlCodeEditor" placeholder="Entrez votre code HTML..." oninput="updateHtmlCode()">${slide.htmlCode || ''}</textarea>
                        </div>
                        <div style="${mode === 'code' ? 'display: none;' : mode === 'split' ? 'flex: 1;' : 'flex: 1;'}">
                            <div class="html-preview">
                                <div class="html-preview-content" id="htmlPreviewContent"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ` : `
                <div class="html-preview-content">
                    ${slide.htmlCode || '<p style="text-align: center; color: #6b7280;">Aucun contenu HTML</p>'}
                </div>
            `}
        </div>
    `;
    
    slideContent.innerHTML = html;
    
    if (slide.htmlCode && (mode === 'preview' || mode === 'split')) {
        setTimeout(() => updateHtmlPreview(), 100);
    }
}
