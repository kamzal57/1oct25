// Advanced Layout Rendering Functions

function renderAdvancedLayout(slide) {
    switch(slide.layout) {
        case 'team':
            return renderTeamLayout(slide);
        case 'chart':
            return renderChartLayout(slide);
        case 'qcm':
            return renderQCMLayout(slide);
        case 'timeline':
            return renderTimelineLayout(slide);
        case 'process':
            return renderProcessLayout(slide);
        case 'swot':
            return renderSWOTLayout(slide);
        case 'summary':
            return renderSummaryLayout(slide);
        case 'video':
            return renderVideoLayout(slide);
        case 'html':
            return renderHtmlLayout(slide);
        default:
            return '<div>Layout non supporté</div>';
    }
}

function renderAdvancedLayoutForPresentation(slide) {
    switch(slide.layout) {
        case 'team':
            return renderTeamLayoutPresentation(slide);
        case 'chart':
            return renderChartLayoutPresentation(slide);
        case 'qcm':
            return renderQCMLayoutPresentation(slide);
        case 'timeline':
            return renderTimelineLayoutPresentation(slide);
        case 'process':
            return renderProcessLayoutPresentation(slide);
        case 'swot':
            return renderSWOTLayoutPresentation(slide);
        case 'summary':
            return renderSummaryLayoutPresentation(slide);
        default:
            return '<div>Layout non supporté</div>';
    }
}

// Team Layout
function renderTeamLayout(slide) {
    const members = slide.teamMembers || [];
    
    return `
        <div style="padding: 40px;">
            <h2 style="text-align: center; margin-bottom: 30px;">Notre Équipe</h2>
            <div class="team-container">
                ${members.map(member => `
                    <div class="team-member">
                        <div class="team-avatar">${member.avatar || '👤'}</div>
                        <div class="team-name">${member.name || 'Nom'}</div>
                        <div class="team-role">${member.role || 'Rôle'}</div>
                    </div>
                `).join('')}
                ${members.length === 0 ? '<div style="text-align: center; color: #6b7280;">Aucun membre ajouté</div>' : ''}
            </div>
            <button onclick="addTeamMember()" class="btn-primary" style="margin-top: 20px;">
                <i class="fas fa-plus"></i> Ajouter un membre
            </button>
        </div>
    `;
}

function renderTeamLayoutPresentation(slide) {
    const members = slide.teamMembers || [];
    
    return `
        <div style="padding: 40px; height: 100%;">
            <h2 style="text-align: center; margin-bottom: 30px; font-size: 2.5rem;">Notre Équipe</h2>
            <div class="team-container">
                ${members.map(member => `
                    <div class="team-member">
                        <div class="team-avatar">${member.avatar || '👤'}</div>
                        <div class="team-name" style="font-size: 1.2rem;">${member.name || 'Nom'}</div>
                        <div class="team-role">${member.role || 'Rôle'}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Chart Layout
function renderChartLayout(slide) {
    const chartData = slide.chartData || [];
    const chartType = slide.chartType || 'bar';
    
    return `
        <div style="padding: 40px;">
            <h2 style="text-align: center; margin-bottom: 30px;">${slide.chartTitle || 'Graphique'}</h2>
            <div class="chart-container">
                <canvas id="chartCanvas"></canvas>
            </div>
            <button onclick="openChartEditor()" class="btn-primary" style="margin-top: 20px;">
                <i class="fas fa-edit"></i> Modifier les données
            </button>
        </div>
    `;
}

function renderChartLayoutPresentation(slide) {
    const chartData = slide.chartData || [];
    const chartType = slide.chartType || 'bar';
    
    setTimeout(() => {
        const canvas = document.getElementById('presentationChartCanvas');
        if (canvas && chartData.length > 0) {
            const ctx = canvas.getContext('2d');
            new Chart(ctx, {
                type: chartType,
                data: {
                    labels: chartData.map(d => d.label),
                    datasets: [{
                        label: slide.chartTitle || 'Données',
                        data: chartData.map(d => d.value),
                        backgroundColor: [
                            'rgba(99, 102, 241, 0.7)',
                            'rgba(139, 92, 246, 0.7)',
                            'rgba(34, 197, 94, 0.7)',
                            'rgba(239, 68, 68, 0.7)',
                            'rgba(251, 146, 60, 0.7)'
                        ],
                        borderColor: [
                            'rgb(99, 102, 241)',
                            'rgb(139, 92, 246)',
                            'rgb(34, 197, 94)',
                            'rgb(239, 68, 68)',
                            'rgb(251, 146, 60)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: chartType === 'pie',
                            labels: {
                                font: {
                                    size: 14
                                }
                            }
                        }
                    },
                    scales: chartType !== 'pie' ? {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    size: 14
                                }
                            }
                        },
                        x: {
                            ticks: {
                                font: {
                                    size: 14
                                }
                            }
                        }
                    } : {}
                }
            });
        }
    }, 100);
    
    return `
        <div style="padding: 40px; height: 100%; display: flex; flex-direction: column;">
            <h2 style="text-align: center; margin-bottom: 30px; font-size: 2.5rem;">${slide.chartTitle || 'Graphique'}</h2>
            <div class="chart-container" style="flex: 1;">
                <canvas id="presentationChartCanvas"></canvas>
            </div>
        </div>
    `;
}

// QCM Layout
function renderQCMLayout(slide) {
    const question = slide.qcmQuestion || 'Votre question?';
    const options = slide.qcmOptions || ['Option A', 'Option B', 'Option C', 'Option D'];
    
    return `
        <div class="qcm-container" style="padding: 40px;">
            <div class="qcm-question" contenteditable="true" onblur="updateSlideProperty('qcmQuestion', this.textContent)">${question}</div>
            <div class="qcm-options">
                ${options.map((option, index) => `
                    <div class="qcm-option" contenteditable="true" onblur="updateQCMOption(${index}, this.textContent)">
                        ${option}
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 20px;">
                <label>Réponse correcte: </label>
                <select onchange="updateSlideProperty('qcmCorrectAnswer', parseInt(this.value))" style="padding: 5px;">
                    ${options.map((_, index) => `
                        <option value="${index}" ${slide.qcmCorrectAnswer === index ? 'selected' : ''}>Option ${index + 1}</option>
                    `).join('')}
                </select>
            </div>
        </div>
    `;
}

function renderQCMLayoutPresentation(slide) {
    const question = slide.qcmQuestion || 'Votre question?';
    const options = slide.qcmOptions || ['Option A', 'Option B', 'Option C', 'Option D'];
    
    return `
        <div class="qcm-container" style="padding: 60px;">
            <div class="qcm-question" style="font-size: 2.2rem;">${question}</div>
            <div class="qcm-options">
                ${options.map((option, index) => `
                    <div class="qcm-option" style="font-size: 1.3rem; padding: 25px;">
                        <strong>${String.fromCharCode(65 + index)}.</strong> ${option}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Timeline Layout
function renderTimelineLayout(slide) {
    const items = slide.timelineItems || [];
    
    return `
        <div style="padding: 40px;">
            <h2 style="text-align: center; margin-bottom: 30px;">Chronologie</h2>
            <div class="timeline-container">
                <div class="timeline-line"></div>
                ${items.map(item => `
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-date">${item.date || 'Date'}</div>
                        <div class="timeline-title">${item.title || 'Titre'}</div>
                        <div class="timeline-description">${item.description || 'Description'}</div>
                    </div>
                `).join('')}
                ${items.length === 0 ? '<div style="text-align: center; color: #6b7280;">Aucun événement ajouté</div>' : ''}
            </div>
            <button onclick="addTimelineItem()" class="btn-primary" style="margin-top: 20px;">
                <i class="fas fa-plus"></i> Ajouter un événement
            </button>
        </div>
    `;
}

function renderTimelineLayoutPresentation(slide) {
    const items = slide.timelineItems || [];
    
    return `
        <div style="padding: 40px; height: 100%; overflow: auto;">
            <h2 style="text-align: center; margin-bottom: 30px; font-size: 2.5rem;">Chronologie</h2>
            <div class="timeline-container">
                <div class="timeline-line"></div>
                ${items.map(item => `
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-date" style="font-size: 1.2rem;">${item.date || ''}</div>
                        <div class="timeline-title" style="font-size: 1.5rem;">${item.title || ''}</div>
                        <div class="timeline-description" style="font-size: 1.1rem;">${item.description || ''}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Process Layout
function renderProcessLayout(slide) {
    const steps = slide.processSteps || [];
    
    return `
        <div style="padding: 40px;">
            <h2 style="text-align: center; margin-bottom: 30px;">Processus</h2>
            <div class="process-container">
                ${steps.map((step, index) => `
                    <div class="process-step">
                        <div class="process-number">${step.number || index + 1}</div>
                        <div class="process-title">${step.title || 'Étape'}</div>
                        <div class="process-description">${step.description || 'Description'}</div>
                    </div>
                    ${index < steps.length - 1 ? '<div class="process-arrow"><i class="fas fa-arrow-right"></i></div>' : ''}
                `).join('')}
                ${steps.length === 0 ? '<div style="text-align: center; color: #6b7280;">Aucune étape ajoutée</div>' : ''}
            </div>
            <button onclick="addProcessStep()" class="btn-primary" style="margin-top: 20px;">
                <i class="fas fa-plus"></i> Ajouter une étape
            </button>
        </div>
    `;
}

function renderProcessLayoutPresentation(slide) {
    const steps = slide.processSteps || [];
    
    return `
        <div style="padding: 40px; height: 100%;">
            <h2 style="text-align: center; margin-bottom: 30px; font-size: 2.5rem;">Processus</h2>
            <div class="process-container">
                ${steps.map((step, index) => `
                    <div class="process-step">
                        <div class="process-number" style="width: 80px; height: 80px; font-size: 2rem;">${step.number || index + 1}</div>
                        <div class="process-title" style="font-size: 1.4rem;">${step.title || ''}</div>
                        <div class="process-description" style="font-size: 1.1rem;">${step.description || ''}</div>
                    </div>
                    ${index < steps.length - 1 ? '<div class="process-arrow" style="font-size: 2.5rem;"><i class="fas fa-arrow-right"></i></div>' : ''}
                `).join('')}
            </div>
        </div>
    `;
}

// SWOT Layout
function renderSWOTLayout(slide) {
    return `
        <div style="padding: 40px; height: 100%;">
            <h2 style="text-align: center; margin-bottom: 20px;">Analyse SWOT</h2>
            <div class="swot-container">
                <div class="swot-quadrant strengths">
                    <div class="swot-title">Forces</div>
                    <ul class="swot-list">
                        ${(slide.swotStrengths || []).map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="swot-quadrant weaknesses">
                    <div class="swot-title">Faiblesses</div>
                    <ul class="swot-list">
                        ${(slide.swotWeaknesses || []).map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="swot-quadrant opportunities">
                    <div class="swot-title">Opportunités</div>
                    <ul class="swot-list">
                        ${(slide.swotOpportunities || []).map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="swot-quadrant threats">
                    <div class="swot-title">Menaces</div>
                    <ul class="swot-list">
                        ${(slide.swotThreats || []).map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
}

function renderSWOTLayoutPresentation(slide) {
    return `
        <div style="padding: 40px; height: 100%;">
            <h2 style="text-align: center; margin-bottom: 30px; font-size: 2.5rem;">Analyse SWOT</h2>
            <div class="swot-container">
                <div class="swot-quadrant strengths">
                    <div class="swot-title" style="font-size: 1.8rem;">Forces</div>
                    <ul class="swot-list">
                        ${(slide.swotStrengths || []).map(item => `<li style="font-size: 1.2rem;">${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="swot-quadrant weaknesses">
                    <div class="swot-title" style="font-size: 1.8rem;">Faiblesses</div>
                    <ul class="swot-list">
                        ${(slide.swotWeaknesses || []).map(item => `<li style="font-size: 1.2rem;">${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="swot-quadrant opportunities">
                    <div class="swot-title" style="font-size: 1.8rem;">Opportunités</div>
                    <ul class="swot-list">
                        ${(slide.swotOpportunities || []).map(item => `<li style="font-size: 1.2rem;">${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="swot-quadrant threats">
                    <div class="swot-title" style="font-size: 1.8rem;">Menaces</div>
                    <ul class="swot-list">
                        ${(slide.swotThreats || []).map(item => `<li style="font-size: 1.2rem;">${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
}

// Summary Layout
function renderSummaryLayout(slide) {
    return `
        <div style="padding: 40px;">
            <h2 style="text-align: center; margin-bottom: 30px;">Sommaire</h2>
            <div class="summary-container">
                ${appState.slides.map((s, index) => `
                    <div class="summary-item" onclick="loadSlide(${index})">
                        <span class="summary-number">${index + 1}.</span>
                        ${s.title || 'Diapositive ' + (index + 1)}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderSummaryLayoutPresentation(slide) {
    return `
        <div style="padding: 60px; height: 100%; overflow: auto;">
            <h2 style="text-align: center; margin-bottom: 40px; font-size: 3rem;">Sommaire</h2>
            <div class="summary-container">
                ${appState.slides.map((s, index) => `
                    <div class="summary-item" style="font-size: 1.4rem; padding: 25px;">
                        <span class="summary-number" style="font-size: 1.6rem;">${index + 1}.</span>
                        ${s.title || 'Diapositive ' + (index + 1)}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Video Layout
function renderVideoLayout(slide) {
    return `
        <div style="padding: 40px;">
            <h2 style="text-align: center; margin-bottom: 20px;">Vidéo</h2>
            <div style="margin-bottom: 20px;">
                <label>URL de la vidéo:</label>
                <input type="text" class="form-control" value="${slide.videoUrl || ''}" 
                       onchange="updateSlideProperty('videoUrl', this.value)" 
                       placeholder="https://www.youtube.com/watch?v=...">
            </div>
            <div style="margin-bottom: 20px;">
                <label>Plateforme:</label>
                <select class="form-control" onchange="updateSlideProperty('videoPlatform', this.value)">
                    <option value="youtube" ${slide.videoPlatform === 'youtube' ? 'selected' : ''}>YouTube</option>
                    <option value="vimeo" ${slide.videoPlatform === 'vimeo' ? 'selected' : ''}>Vimeo</option>
                    <option value="dailymotion" ${slide.videoPlatform === 'dailymotion' ? 'selected' : ''}>Dailymotion</option>
                </select>
            </div>
            ${slide.videoUrl ? `
                <div class="video-container" style="margin-top: 20px;">
                    <div class="video-player">
                        ${getVideoEmbed(slide.videoUrl, slide.videoPlatform)}
                    </div>
                </div>
            ` : '<div style="text-align: center; color: #6b7280; margin-top: 20px;">Entrez une URL de vidéo</div>'}
        </div>
    `;
}

// HTML Layout
function renderHtmlLayout(slide) {
    return `
        <div style="padding: 20px; height: 100%; display: flex; flex-direction: column;">
            <h2 style="text-align: center; margin-bottom: 20px;">Éditeur HTML</h2>
            <div style="flex: 1; display: flex; gap: 20px;">
                <div style="flex: 1;">
                    <label>Code HTML:</label>
                    <textarea class="form-control" style="height: calc(100% - 30px); font-family: monospace;" 
                              onchange="updateSlideProperty('htmlCode', this.value)">${slide.htmlCode || ''}</textarea>
                </div>
                <div style="flex: 1; border: 1px solid var(--border-color); border-radius: 8px; overflow: auto; background: white;">
                    <div style="padding: 10px; background: var(--bg-color); border-bottom: 1px solid var(--border-color);">
                        <strong>Prévisualisation:</strong>
                    </div>
                    <div class="html-preview-content">
                        ${slide.htmlCode || '<p style="color: #6b7280; text-align: center; padding: 20px;">Aucun contenu HTML</p>'}
                    </div>
                </div>
            </div>
        </div>
    `;
}
