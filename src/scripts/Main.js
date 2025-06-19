import WindowManager from "./WindowManager.js";

document.addEventListener('DOMContentLoaded', () => {
    const windowManager = new WindowManager();
    windowManager.registerAllWindows();
})