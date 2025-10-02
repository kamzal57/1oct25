// Interaction Handlers for Advanced Layouts

// Team Member Management
function addTeamMember() {
    const slide = appState.slides[appState.currentSlideIndex];
    if (!slide.teamMembers) {
        slide.teamMembers = [];
    }
    
    const newMember = {
        id: Date.now(),
        name: 'Nouveau Membre',
        role: 'Rôle',
        avatar: '👤',
        level: 'member'
    };
    
    slide.teamMembers.push(newMember);
    saveToHistory();
    loadSlide(appState.currentSlideIndex);
    showToast('Membre ajouté', 'success');
}

// Timeline Management
function addTimelineItem() {
    const slide = appState.slides[appState.currentSlideIndex];
    if (!slide.timelineItems) {
        slide.timelineItems = [];
    }
    
    const newItem = {
        date: new Date().getFullYear().toString(),
        title: 'Nouvel événement',
        description: 'Description de l\'événement'
    };
    
    slide.timelineItems.push(newItem);
    saveToHistory();
    loadSlide(appState.currentSlideIndex);
    showToast('Événement ajouté', 'success');
}

// Process Step Management
function addProcessStep() {
    const slide = appState.slides[appState.currentSlideIndex];
    if (!slide.processSteps) {
        slide.processSteps = [];
    }
    
    const newStep = {
        number: slide.processSteps.length + 1,
        title: 'Nouvelle étape',
        description: 'Description de l\'étape'
    };
    
    slide.processSteps.push(newStep);
    saveToHistory();
    loadSlide(appState.currentSlideIndex);
    showToast('Étape ajoutée', 'success');
}

// Chart Editor
function openChartEditor() {
    const slide = appState.slides[appState.currentSlideIndex];
    
    // Simple prompt-based editor for demo
    const dataCount = prompt('Combien de données voulez-vous?', '4');
    if (!dataCount) return;
    
    const chartData = [];
    for (let i = 0; i < parseInt(dataCount); i++) {
        const label = prompt(`Label ${i + 1}:`, `Item ${i + 1}`);
        const value = prompt(`Valeur ${i + 1}:`, '50');
        if (label && value) {
            chartData.push({ label, value: parseInt(value) });
        }
    }
    
    slide.chartData = chartData;
    saveToHistory();
    loadSlide(appState.currentSlideIndex);
    showToast('Données du graphique mises à jour', 'success');
}

// QCM Option Update
function updateQCMOption(index, value) {
    const slide = appState.slides[appState.currentSlideIndex];
    if (!slide.qcmOptions) {
        slide.qcmOptions = [];
    }
    slide.qcmOptions[index] = value;
    saveToHistory();
}

// Initialize Chart
function initializeChartInCanvas() {
    const slide = appState.slides[appState.currentSlideIndex];
    if (slide.layout !== 'chart') return;
    
    const canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    
    const chartData = slide.chartData || [];
    if (chartData.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if any
    if (window.currentChart) {
        window.currentChart.destroy();
    }
    
    window.currentChart = new Chart(ctx, {
        type: slide.chartType || 'bar',
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
                    'rgba(251, 146, 60, 0.7)',
                    'rgba(59, 130, 246, 0.7)'
                ],
                borderColor: [
                    'rgb(99, 102, 241)',
                    'rgb(139, 92, 246)',
                    'rgb(34, 197, 94)',
                    'rgb(239, 68, 68)',
                    'rgb(251, 146, 60)',
                    'rgb(59, 130, 246)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: slide.chartType === 'pie'
                }
            },
            scales: slide.chartType !== 'pie' ? {
                y: {
                    beginAtZero: true
                }
            } : {}
        }
    });
}

// Call this after rendering a chart layout
document.addEventListener('DOMContentLoaded', () => {
    // Observer to initialize charts when they appear
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                const canvas = document.getElementById('chartCanvas');
                if (canvas) {
                    setTimeout(initializeChartInCanvas, 100);
                }
            }
        });
    });
    
    const canvas = document.getElementById('canvas');
    if (canvas) {
        observer.observe(canvas, { childList: true, subtree: true });
    }
});
