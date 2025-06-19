import Window from "./Window.js";

export default class WindowManager {
    constructor() {
        this.windows = new Map();
    }

    /**
   * @param {HTMLElement} element
   */
    registerWindow(element) {
        const win = new Window(element);
        this.windows.set(win.id, win);
        console.log("Registered window!")
    }

    registerAllWindows() {
        /** @type {NodeListOf<HTMLElement>} */
        const windows = document.querySelectorAll('.window');
        windows.forEach(window => {
            this.registerWindow(window);
        });
    }

    toggleWindowVisibility(id, isVisible) {
        const win = this.windows.get(id);
        if (win) {
            win.toggleVisibility(isVisible);
        }
    }

    bindCheckboxes() {

    }
}