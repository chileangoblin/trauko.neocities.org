import Window from "./Window.js";

export default class Manager {
    constructor() {
        this.windows = new Map();

        this.highestZIndex = 1;
    }

    init() {
        const windows = document.querySelectorAll('.window-container');
        windows.forEach(window => this.addWindow(window));
        this.repositionAll();

        const toggles = document.querySelectorAll('.toggle');
        toggles.forEach(toggle => this.addToggle(toggle));

        window.addEventListener('resize', () => this.repositionAll());
    }

    addWindow(element) {
        const win = new Window(element, this);
        this.windows.set(win.id, win);
    }

    addToggle(element) {
        const windowId = element.dataset.id;
        const win = this.windows.get(windowId);

        if (win.state.visible) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }

        element.addEventListener('click', () => {
            win.toggleVisible();
            this.bringToFront(win);

            if (win.state.visible) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });
    }

    updateToggleState(id, visible) {
        const toggle = document.querySelector(`.toggle[data-id="${id}"]`);
        if (toggle) {
            toggle.classList.toggle('active', visible);
        }
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