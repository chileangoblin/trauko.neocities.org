export default class Preloader {
    constructor(delay = 3000) {
        this.preloader = document.querySelector('#preloader');
        this.loadingText = this.preloader.querySelector('.loading-text');
        this.startButton = this.preloader.querySelector('#start-button');
        this.delay = delay;
        
        this.startButton.addEventListener('click', () => this.start());
    }

    init = async () => {
        await this.loadResources();
        this.showStartButton();
    };

    start = () => {
        this.preloader.style.display = 'none';
    }

    show = () => {
        this.preloader.style.display = 'flex';
    }

    hide = () => {
        this.preloader.style.display = 'none';
    }

    loadResources = async () => {
        const imagePaths = [
            '/assets/images/bg.gif',
        ];

        const modulePaths = [
            './App.js',
            './main.js',
            './Manager.js',
            './Window.js'
        ]

        const loadImage = (src) => new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = () => {
                    console.info(`Image loaded: ${src}`);
                    resolve(src);
                };
                img.onerror = (e) => {
                    console.error(`Failed to load image: ${src}`, e);
                    reject(e);
                }
        });

        const loadModule = async (path) => {
            try {
                const module = await import(path);
                console.info(`Module loaded: ${path}`);
                return module;
            } catch (e) {
                console.error(`Failed to load module ${path}`, e);
                throw e;
            }
        };

        const imagePromises = imagePaths.map(src => loadImage(src));
        const modulePromises = modulePaths.map(path => loadModule(path));
        this.loadedModules = await Promise.all(modulePromises);

        await Promise.all([
            Promise.all(imagePromises),
            new Promise(res => setTimeout(res, this.delay))
        ]);
    }

    showStartButton = () => {
        this.loadingText.style.display = 'none';
        this.startButton.style.visibility = 'visible';
    }
}