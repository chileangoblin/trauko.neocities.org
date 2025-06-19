export default class Drawer {

    constructor(element) {
        this.drawer = element;
        this.controls = {
            drawerButton: document.querySelector('.drawer-toggle'),
            drawerCloseButton: this.drawer.querySelector('.drawer-control.close')
        }
        this.state = {
            isOpen: false
        }

        this.controls.drawerButton.addEventListener('click', this.open);
        this.controls.drawerCloseButton.addEventListener('click', this.close);
    }

    open = () => {
        this.drawer.classList.add("open");
    }

    close = () => {
        this.drawer.classList.remove("open");
    }

    toggle = () => {
        if (this.state.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
}