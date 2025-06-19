import WindowManager from "./WindowManager.js";
import Drawer from "./Drawer.js";

document.addEventListener('DOMContentLoaded', () => {
    const windowManager = new WindowManager();
    windowManager.registerAllWindows();

    const drawerElement = document.querySelector("#drawer");
    const drawer = new Drawer(drawerElement);
});