import Preloader from "./Preloader.js";
import Manager from "./Manager.js";
import Taskbar from "./Taskbar.js";

export default class App {
    constructor() {
        this.preloader = new Preloader();
        this.manager = new Manager();
        this.taskbar = new Taskbar();
    }

    init = async () => {
        this.preloader.init();
        this.manager.init();
    }
}