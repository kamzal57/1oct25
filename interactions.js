// interactions.js - Fonctions d'interaction avancées

// Team Member Management
function openTeamMemberModal(memberId = null) {
    appState.editingTeamMember = memberId;
    const modal = document.getElementById('teamMemberModal');
    
    const slide = appState.slides[appState.currentSlideIndex];
    const teamMembers = slide.teamMembers || [];
    
    let managerOptions = '<option value="">Aucun (CEO)</option>';
    teamMembers.forEach(member => {
        if (member.id !== memberId) {
            managerOptions += `<option value="${member.id}">${member.name}</option>`;
        }
    });
    
    let formValues = {
        name: '',
        role: '',
        level: 'employee',
        avatar: '👤',
        manager: ''
    };
    
    if (memberId) {
        const member = teamMembers.find(m => m.id === memberId);
        if (member) formValues = member;
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${memberId ? 'Modifier' : 'Ajouter'} un membre d'équipe</h2>
                <button class="modal-close" onclick="closeTeamMemberModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="form-group">
                <label class="form-label">Nom</label>
                <input type="text" class="form-input" id="teamMemberName" value="${formValues.name}" placeholder="Nom du membre">
            </div>
            <div class="form-group">
                <label class="form-label">Rôle</label>
                <input type="text" class="form-input" id="teamMemberRole" value="${formValues.role}" placeholder="Rôle dans l'équipe">
            </div>
            <div class="form-group">
                <label class="form-label">Niveau hiérarchique</label>
                <select class="form-select" id="teamMemberLevel">
                    <option value="ceo" ${formValues.level === 'ceo' ? 'selected' : ''}>CEO/Directeur</option>
                    <option value="director" ${formValues.level === 'director' ? 'selected' : ''}>Directeur</option>
                    <option value="manager" ${formValues.level === 'manager' ? 'selected' : ''}>Manager</option>
                    <option value="employee" ${formValues.level === 'employee' ? 'selected' : ''}>Employé</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Avatar (emoji)</label>
                <input type="text" class="form-input" id="teamMemberAvatar" value="${formValues.avatar}" placeholder="👤">
            </div>
            <div class="form-group">
                <label class="form-label">Supérieur hiérarchique</label>
                <select class="form-select" id="teamMemberManager">
                    ${managerOptions}
                </select>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button class="btn btn-secondary" onclick="closeTeamMemberModal()">Annuler</button>
                <button class="btn btn-primary" onclick="saveTeamMember()">
                    <i class="fas fa-save"></i> Enregistrer
                </button>
            </div>
        </div>
    `;
    
    if (memberId) {
        document.getElementById('teamMemberManager').value = formValues.manager || '';
    }
    
    modal.classList.add('active');
}

function closeTeamMemberModal() {
    document.getElementById('teamMemberModal').classList.remove('active');
    appState.editingTeamMember = null;
}

function saveTeamMember() {
    const name = document.getElementById('teamMemberName').value;
    const role = document.getElementById('teamMemberRole').value;
    const level = document.getElementById('teamMemberLevel').value;
    const avatar = document.getElementById('teamMemberAvatar').value;
    const manager = document.getElementById('teamMemberManager').value;
    
    if (!name) {
        showToast('Veuillez entrer un nom', 'error');
        return;
    }
    
    const slide = appState.slides[appState.currentSlideIndex];
    if (!slide.teamMembers) slide.teamMembers = [];
    
    if (appState.editingTeamMember) {
        const member = slide.teamMembers.find(m => m.id === appState.editingTeamMember);
        if (member) {
            member.name = name;
            member.role = role;
            member.level = level;
            member.avatar = avatar;
            member.manager = manager;
        }
    } else {
        slide.teamMembers.push({
            id: Date.now(),
            name, role, level, avatar, manager
        });
    }
    
    saveToHistory();
    loadSlide(appState.currentSlideIndex);
    closeTeamMemberModal();
    showToast(appState.editingTeamMember ? 'Membre mis à jour' : 'Membre ajouté', 'success');
}

function editTeamMember(memberId) {
    openTeamMemberModal(memberId);
}

function deleteTeamMember(memberId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce membre?')) {
        const slide = appState.slides[appState.currentSlideIndex];
        slide.teamMembers = slide.teamMembers.filter(m => m.id !== memberId);
        
        slide.teamMembers.forEach(member => {
            if (member.manager === memberId.toString()) {
                member.manager = '';
            }
        });
        
        saveToHistory();
        loadSlide(appState.currentSlideIndex);
        showToast('Membre supprimé', 'success');
    }
}

function updateTeamMember(memberId, field, value) {
    const slide = appState.slides[appState.currentSlideIndex];
    const member = slide.teamMembers.find(m => m.id === memberId);
    if (member) {
        member[field] = value;
        saveToHistory();
    }
}

// Chart Management
function changeChartType(type) {
    const slide = appState.slides[appState.currentSlideIndex];
    slide.chartType = type;
    saveToHistory();
    loadSlide(appState.currentSlideIndex);
}

function updateChartData(index, field, value) {
    const slide = appState.slides[appState.currentSlideIndex];
    if (!slide.chartData) slide.chartData = [];
    slide.chartData[index][field] = field === 'value' ? parseFloat(value) : value;
    saveToHistory();
    loadSlide(appState.currentSlideIndex);
}

function addChartData() {
    const slide = appState.slides[appState.currentSlideIndex];
    if (!slide.chartData) slide.chartData = [];
    slide.chartData.push({
        label: `Item ${slide.chartData.length + 1}`,
        value: 50
    });
    saveToHistory();
    loadSlide(appState.currentSlideIndex);
}

function removeChartData(index) {
    const slide = appState.slides[appState.currentSlideIndex];
    if (slide.chartData && slide.chartData.length > 1) {
        slide.chartData.splice(index, 1);
        saveToHistory();
        loadSlide(appState.currentSlideIndex);
    }
}

// QCM Management
function openQcmModal() {
    const slide = appState.slides[appState.currentSlideIndex];
    const modal = document.getElementById('qcmModal');
    
    const options = slide.qcmOptions || ['Option A', 'Option B', 'Option C', 'Option D'];
    const correctAnswer = slide.qcmCorrectAnswer || 0;
    
    let optionsHtml = '';
    options.forEach((option, index) => {
        optionsHtml += `
            <div class="data-row">
                <input type="text" class="data-input qcm-option-input" value="${option}" placeholder="Option ${String.fromCharCode(65 + index)}">
                <input type="radio" name="correctAnswer" value="${index}" ${index === correctAnswer ? 'checked' : ''}>
            </div>
        `;
    });
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Paramètres QCM</h2>
                <button class="modal-close" onclick="closeQcmModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="form-group">
                <label class="form-label">Question</label>
                <input type="text" class="form-input" id="qcmQuestion" value="${slide.qcmQuestion || ''}" placeholder="Entrez votre question">
            </div>
            <div class="form-group">
                <label class="form-label">Options (cochez la bonne réponse)</label>
                <div id="qcmOptions">
                    ${optionsHtml}
                </div>
                <button class="add-data-row" onclick="addQcmOption()">
                    <i class="fas fa-plus"></i> Ajouter une option
                </button>
            </div>
            <div class="form-group">
                <label class="form-label">Feedback (optionnel)</label>
                <textarea class="form-textarea" id="qcmFeedback" placeholder="Message après la réponse">${slide.qcmFeedback || ''}</textarea>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button class="btn btn-secondary" onclick="closeQcmModal()">Annuler</button>
                <button class="btn btn-primary" onclick="saveQcmSettings()">
                    <i class="fas fa-save"></i> Enregistrer
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeQcmModal() {
    document.getElementById('qcmModal').classList.remove('active');
}

function saveQcmSettings() {
    const slide = appState.slides[appState.currentSlideIndex];
    
    slide.qcmQuestion = document.getElementById('qcmQuestion').value;
    slide.qcmFeedback = document.getElementById('qcmFeedback').value;
    
    const correctAnswerRadio = document.querySelector('input[name="correctAnswer"]:checked');
    if (correctAnswerRadio) {
        slide.qcmCorrectAnswer = parseInt(correctAnswerRadio.value);
    }
    
    const optionInputs = document.querySelectorAll('.qcm-option-input');
    slide.qcmOptions = Array.from(optionInputs).map(input => input.value);
    
    saveToHistory();
    loadSlide(appState.currentSlideIndex);
    closeQcmModal();
    showToast('Paramètres QCM enregistrés', 'success');
}

function addQcmOption() {
    const qcmOptionsContainer = document.getElementById('qcmOptions');
    const optionCount = qcmOptionsContainer.children.length;
    
    const optionRow = document.createElement('div');
    optionRow.className = 'data-row';
    optionRow.innerHTML = `
        <input type="text" class="data-input qcm-option-input" value="Option ${String.fromCharCode(65 + optionCount)}" placeholder="Option ${String.fromCharCode(65 + optionCount)}">
        <input type="radio" name="correctAnswer" value="${optionCount}">
    `;
    
    qcmOptionsContainer.appendChild(optionRow);
}

function selectQcmOption(index) {
    if (appState.isPresentationMode) {
        const slide = appState.slides[appState.presentationIndex];
        const options = document.querySelectorAll('.qcm-option');
        
        options.forEach((option, i) => {
            option.classList.remove('selected', 'correct', 'incorrect');
            
            if (i === index) {
                option.classList.add('selected');
            }
            
            if (i === slide.qcmCorrectAnswer) {
                option.classList.add('correct');
            } else if (i === index && i !== slide.qcmCorrectAnswer) {
                option.classList.add('incorrect');
            }
        });
        
        const feedbackElement = document.getElementById('qcmFeedback');
        if (feedbackElement) {
            feedbackElement.textContent = slide.qcmFeedback || (index === slide.qcmCorrectAnswer ? 'Correct!' : 'Incorrect!');
            feedbackElement.className = `qcm-feedback ${index === slide.qcmCorrectAnswer ? 'correct' : 'incorrect'}`;
            feedbackElement.style.display = 'block';
        }
    }
}

function updateQcmOption(index, value) {
    const slide = appState.slides[appState.currentSlideIndex];
    if (!slide.qcmOptions) slide.qcmOptions = [];
    slide.qcmOptions[index] = value;
    saveToHistory();
}

// Timeline Management
function updateTimelineItem(index, field, value) {
    const slide = appState.slides[appState.currentSlideIndex];
    if (!slide.timelineItems) slide.timelineItems = [];
    slide.timelineItems[index][field] = value;
    saveToHistory();
}

function addTimelineItem() {
    const slide = appState.slides[appState.currentSlideIndex];
    if (!slide.timelineItems) slide.timelineItems = [];
    slide.timelineItems.push({
        date: 'Date',
        title: 'Nouvel événement',
        description: 'Description de l\'événement'
    });
    saveToHistory();
    loadSlide(appState.currentSlideIndex);
}

// Process Management
function updateProcessStep(index, field, value) {
    const slide = appState.slides[appState.currentSlideIndex];
    if (!slide.processSteps) slide.processSteps = [];
    slide.processSteps[index][field] = value;
    saveToHistory();
}

function addProcessStep() {
    const slide = appState.slides[appState.currentSlideIndex];
    if (!slide.processSteps) slide.processSteps = [];
    slide.processSteps.push({
        number: slide.processSteps.length + 1,
        title: 'Nouvelle étape',
        description: 'Description de l\'étape'
    });
    saveToHistory();
    loadSlide(appState.currentSlideIndex);
}

// SWOT Management
function updateSwotItem(category, index, value) {
    const slide = appState.slides[appState.currentSlideIndex];
    const field = `swot${category.charAt(0).toUpperCase() + category.slice(1)}`;
    if (!slide[field]) slide[field] = [];
    slide[field][index] = value;
    saveToHistory();
}

function addSwotItem(category) {
    const slide = appState.slides[appState.currentSlideIndex];
    const field = `swot${category.charAt(0).toUpperCase() + category.slice(1)}`;
    if (!slide[field]) slide[field] = [];
    slide[field].push('Nouvel élément');
    saveToHistory();
    loadSlide(appState.currentSlideIndex);
}

// Video Management
function updateVideo() {
    const url = document.getElementById('videoUrlInput').value;
    if (!url) {
        showToast('Veuillez entrer une URL de vidéo', 'error');
        return;
    }
    
    const slide = appState.slides[appState.currentSlideIndex];
    slide.videoUrl = url;
    saveToHistory();
    loadSlide(appState.currentSlideIndex);
    showToast('Vidéo chargée avec succès', 'success');
}

// HTML Management
function switchHtmlMode(mode) {
    const slide = appState.slides[appState.currentSlideIndex];
    slide.htmlMode = mode;
    saveToHistory();
    loadSlide(appState.currentSlideIndex);
}

function updateHtmlCode() {
    const code = document.getElementById('htmlCodeEditor').value;
    const slide = appState.slides[appState.currentSlideIndex];
    slide.htmlCode = code;
    updateHtmlPreview();
}

function updateHtmlPreview() {
    const code = document.getElementById('htmlCodeEditor')?.value || '';
    const previewContent = document.getElementById('htmlPreviewContent');
    
    if (previewContent) {
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px';
        
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { 
                        margin: 0; 
                        padding: 20px; 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background: white;
                    }
                </style>
            </head>
            <body>
                ${code}
            </body>
            </html>
        `;
        
        iframe.srcdoc = html;
        previewContent.innerHTML = '';
        previewContent.appendChild(iframe);
        
        const slide = appState.slides[appState.currentSlideIndex];
        slide.htmlPreview = code;
    }
}
