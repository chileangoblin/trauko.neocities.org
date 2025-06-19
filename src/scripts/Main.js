import WindowManager from "./WindowManager.js";

document.addEventListener('DOMContentLoaded', () => {
    const windowManager = new WindowManager();
    windowManager.registerAllWindows();

    const drawer = document.getElementById('drawer');
    const toggleButton = document.getElementById('drawer-toggle');

    toggleButton.addEventListener('click', () => {
        drawer.classList.toggle('open');
        console.log("Toggling drawer");
    });
})