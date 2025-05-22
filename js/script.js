// js/script.js

// Register the datalabels plugin globally
Chart.register(ChartDataLabels);

// Helper function to process labels for multi-line display
function processLabels(labels, maxLength = 16) {
    return labels.map(label => {
        if (typeof label === 'string' && label.length > maxLength) {
            const words = label.split(' ');
            const newLabel = [];
            let currentLine = '';
            words.forEach(word => {
                if ((currentLine + word).length > maxLength && currentLine.length > 0) {
                    newLabel.push(currentLine.trim());
                    currentLine = word + ' ';
                } else {
                    currentLine += word + ' ';
                }
            });
            newLabel.push(currentLine.trim());
            return newLabel.filter(line => line.length > 0);
        }
        return label;
    });
}

// Descriptions for each statistical area, used in tooltips
const tooltipDescriptions = {
    'Fundamentos y Descriptiva': 'Base y resumen de datos',
    'Teoría de la Probabilidad': 'Incertidumbre y modelado de eventos',
    'Estadística Inferencial': 'Generalización y pruebas de hipótesis',
    'Análisis de Asociación y Correlación': 'Relaciones entre variables'
};

// Callback for tooltip title, ensures correct label display
const tooltipTitleCallback = (tooltipItems) => {
    const item = tooltipItems[0];
    if (!item || typeof item.dataIndex === 'undefined' || !item.chart.data.labels) return '';
    let label = item.chart.data.labels[item.dataIndex];
    if (Array.isArray(label)) {
        label = label.join(' '); // Rejoin label parts for lookup
    }
    return label;
};

// Callback for tooltip label, combines description and percentage
const tooltipLabelCallback = (tooltipItem) => {
    let label = tooltipItem.label || '';
    if (Array.isArray(label)) {
        label = label.join(' ');
    }
    const description = tooltipDescriptions[label] || label;
    const percentage = tooltipItem.formattedValue + '%'; // Get the percentage value
    return `${description} (${percentage})`; // Combine description and percentage
};

// Common options for Chart.js, including responsive settings and plugin configurations
const commonChartOptions = (customOptions = {}) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0,0,0,0.7)',
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 4,
            callbacks: {
                title: tooltipTitleCallback,
                label: tooltipLabelCallback
            }
        },
        legend: {
            position: 'bottom',
            labels: {
                color: '#374151',
                font: { size: 12 },
                padding: 15
            }
        }
    },
    animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
    },
    ...customOptions
});

// Initialize the statistical areas doughnut chart
const statisticalAreasCtx = document.getElementById('statisticalAreasChart')?.getContext('2d');
if (statisticalAreasCtx) {
    new Chart(statisticalAreasCtx, {
        type: 'doughnut',
        data: {
            labels: processLabels([
                'Fundamentos y Descriptiva',
                'Teoría de la Probabilidad',
                'Estadística Inferencial',
                'Análisis de Asociación y Correlación'
            ]),
            datasets: [{
                label: 'Foco del Curso',
                data: [30, 20, 25, 25],
                backgroundColor: ['#005691', '#00A8E8', '#8BC34A', '#66BB6A'], // Adjusted colors
                borderColor: '#FFFFFF',
                borderWidth: 3,
                hoverOffset: 8,
                hoverBorderColor: '#FFFFFF'
            }]
        },
        options: commonChartOptions({
             plugins: {
                legend: { position: 'right' },
                datalabels: {
                    color: '#fff',
                    font: {
                        weight: 'bold',
                        size: 14
                    },
                    formatter: (value, context) => {
                        return value + '%';
                    }
                }
             },
             cutout: '60%'
        })
    });
}

// Function to toggle explanation visibility for timeline items
function toggleExplanation(explanationId) {
    const explanationDiv = document.getElementById(explanationId);
    if (explanationDiv) {
        explanationDiv.classList.toggle('hidden');
    }
}

// Smooth scroll for navigation links, considering sticky header offset
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        const headerOffset = document.getElementById('sticky-nav').offsetHeight;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    });
});
