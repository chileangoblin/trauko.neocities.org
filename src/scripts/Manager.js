import Window from "./Window.js";

export default class Manager {
    constructor() {
        this.windows = new Map();
        this.highestZIndex = 1;
    }

    init() {
        const windows = document.querySelectorAll('.window-container');
        windows.forEach(window => this.addWindow(window));
        this.showAll();
        this.repositionAll();

        window.addEventListener('resize', () => this.repositionAll());
    }

    addWindow(element) {
        const win = new Window(element, this);
        this.windows.set(win.id, win);
    }

    bringToFront(windowInstance) {
        this.highestZIndex++;
        windowInstance.element.style.zIndex = this.highestZIndex;
        console.log("Bringing to front!");
    }

    hideAll() {
        this.windows.forEach(win => win.hide());
    }

    showAll() {
        this.windows.forEach(win => win.show());
    }

    repositionAll() {
        this.windows.forEach(win => win.reposition());
    }

    getWindows() {
        console.log(this.windows);
    }
}