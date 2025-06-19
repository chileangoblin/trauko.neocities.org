import Window from "./Window.js";

class WindowManager {
    static windows = new Map();

    static init(selector = '.window') {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            const win = new Window(el);
            WindowManager.windows.set(win.id, win);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
  WindowManager.init();
});