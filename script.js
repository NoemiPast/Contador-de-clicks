class ClickCounter {
    constructor() {
        this.count = 0;
        this.startTime = Date.now();
        this.clicks = [];
        
        this.countElement = document.getElementById('count');
        this.cpsElement = document.getElementById('cps');
        this.incrementBtn = document.getElementById('incrementBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        this.initEventListeners();
        this.updateDisplay();
    }
    
    initEventListeners() {
        this.incrementBtn.addEventListener('click', () => this.increment());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        // Soporte para teclado
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                this.increment();
            } else if (e.code === 'Escape') {
                this.reset();
            }
        });
    }
    
    increment() {
        this.count++;
        this.clicks.push(Date.now());
        
        // Mantener solo los clicks de los últimos 10 segundos para el cálculo de CPS
        const tenSecondsAgo = Date.now() - 10000;
        this.clicks = this.clicks.filter(time => time > tenSecondsAgo);
        
        this.updateDisplay();
        this.animateCounter();
    }
    
    reset() {
        this.count = 0;
        this.clicks = [];
        this.updateDisplay();
        
        // Animación de reset
        this.countElement.style.transform = 'scale(0.8)';
        setTimeout(() => {
            this.countElement.style.transform = 'scale(1)';
        }, 300);
    }
    
    updateDisplay() {
        this.countElement.textContent = this.count.toLocaleString();
        this.cpsElement.textContent = this.calculateCPS().toFixed(1);
    }
    
    calculateCPS() {
        if (this.clicks.length < 2) return 0;
        
        const timeWindow = 10000; // 10 segundos
        const recentClicks = this.clicks.filter(time => 
            time > Date.now() - timeWindow
        );
        
        if (recentClicks.length < 2) return 0;
        
        const oldestClick = Math.min(...recentClicks);
        const newestClick = Math.max(...recentClicks);
        const timeDiff = (newestClick - oldestClick) / 1000;
        
        return timeDiff > 0 ? recentClicks.length / timeDiff : recentClicks.length;
    }
    
    animateCounter() {
        this.countElement.classList.remove('pulse');
        void this.countElement.offsetWidth; // Trigger reflow
        this.countElement.classList.add('pulse');
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ClickCounter();
});

// Service Worker para futuras mejoras (PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Aquí podrías registrar un Service Worker si quisieras hacerlo PWA
    });
}