export default class Preloader {
    constructor(delay = 500) {
        this.preloader = document.querySelector('#preloader');
        this.loadingText = this.preloader.querySelector('.loading-text');
        this.startButton = this.preloader.querySelector('#start-button');
        this.delay = delay;
        
        this.startButton.addEventListener('click', () => this.start());
    }

    async init() {
        await this.loadResources();
        this.showStartButton();
    };

    start() {
        this.preloader.style.display = 'none';
    }

    show() {
        this.preloader.style.display = 'flex';
    }

    hide() {
        this.preloader.style.display = 'none';
    }

    async loadResources() {
        const imagePaths = ['/assets/images/bg.gif'];
        const modulePaths = ['./App.js', './main.js', './Manager.js', './Window.js'];
        const totalResources = imagePaths.length + modulePaths.length;
        let loadedCount = 0;

        const miniDelay = 1000; // ← You can tweak this

        const updateProgress = () => {
            loadedCount++;
            const percentage = loadedCount / totalResources;
            this.updateProgressBar(percentage);
        };

        const sleep = (ms) => new Promise(res => setTimeout(res, ms));

        const loadImage = (src) => new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                console.info(`Image loaded: ${src}`);
                updateProgress();
                resolve(src);
            };
            img.onerror = (e) => {
                console.error(`Failed to load image: ${src}`, e);
                reject(e);
            };
        });

        const loadModule = async (path) => {
            try {
                const module = await import(path);
                console.info(`Module loaded: ${path}`);
                updateProgress();
                return module;
            } catch (e) {
                console.error(`Failed to load module ${path}`, e);
                throw e;
            }
        };

        // Load modules with mini delay
        this.loadedModules = [];
        for (const path of modulePaths) {
            const mod = await loadModule(path);
            this.loadedModules.push(mod);
            await sleep(miniDelay);
        }

        // Load images with mini delay
        for (const src of imagePaths) {
            await loadImage(src);
            await sleep(miniDelay);
        }

        // Optional overall boot screen delay
        await sleep(this.delay);
    };

    updateProgressBar = (percentage) => {
        const shrooms = Array.from(this.preloader.querySelectorAll('.shroom'));
        const stepsToActivate = Math.floor(percentage * shrooms.length);

        shrooms.forEach((shroom, index) => {
            if (index < stepsToActivate) {
                shroom.classList.add('active');
            } else {
                shroom.classList.remove('active');
            }
        });
    }

    showStartButton() {
        this.loadingText.style.display = 'none';
        this.preloader.querySelector('.loading-bar').style.display = 'none';
        this.startButton.style.visibility = 'visible';
    }
}