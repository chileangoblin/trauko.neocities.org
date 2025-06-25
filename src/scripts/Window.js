import Manager from "./Manager.js";

export default class Window {
    static highestZIndex = 1;
    /**
     * @param {HTMLElement} element - The DOM element representing the window.
     * @param {Manager} manager - The window manager instance to coordinate z-index, visibility, etc.
     */
    constructor(element, manager) {
        this.element = element;
        this.manager = manager;
        this.id = element.dataset.id;
        this.type = element.dataset.type;
        this.parent = element.parentElement;

        this.ui = {
            titlebar: this.element.querySelector('.window-titlebar')
        }

        this.controls = {
            expand: this.ui.titlebar.querySelector('.window-button.expand'),
            close: this.ui.titlebar.querySelector('.window-button.close')
        }
        
        this.state = {
            visible: true,
            expanded: false,
            isDragging: false,
            lastPosition: {
                x: parseInt(this.element.style.left, 10) || this.element.offsetLeft, 
                y: parseInt(this.element.style.top, 10) || this.element.offsetTop
            },
            initialSize: {width: this.element.offsetWidth, height: this.element.offsetHeight}
        }

        this.attachEvents();
    }

    attachEvents() {
        this.element.addEventListener('mousedown', () => this.manager.bringToFront(this));
        this.ui.titlebar.addEventListener('mousedown', this.onTitlebarDragStart);
        this.controls.expand.addEventListener('click', () => this.toggleExpand());
        this.controls.close.addEventListener('click', () => this.toggleVisible());
    }

    toggleVisible() {
        this.state.visible = !this.state.visible;
        this.element.style.display = this.state.visible ? 'block' : 'none';

        if (this.state.visible) {
            this.manager.bringToFront(this);
        }

        this.manager.updateToggleState(this.id, this.state.visible);
    }

    toggleExpand() {
        if (!this.state.expanded) {
            this.state.initialSize = {
                width: this.element.offsetWidth,
                height: this.element.offsetHeight
            };
            this.state.lastPosition = {
                x: this.element.offsetLeft,
                y: this.element.offsetTop
            };

            this.element.style.left = '0px';
            this.element.style.top = '0px';
            this.element.style.width = `${this.parent.clientWidth}px`;
            this.element.style.height = `${this.parent.clientHeight}px`;
            this.state.expanded = true;
            
        } else {
                this.element.style.left = `${this.state.lastPosition.x}px`;
                this.element.style.top = `${this.state.lastPosition.y}px`;
                this.element.style.width = `${this.state.initialSize.width}px`;
                this.element.style.height = `${this.state.initialSize.height}px`;
                this.state.expanded = false;
        }
    }

    hide() {
        this.state.visible = false;
        console.log(`Hiding ${this.id}`);
    }

    show() {
        this.state.visible = true;
        console.log(`Showing ${this.id}`);
    }

    reposition() {
        const currentLeft = this.state.lastPosition.x ?? this.element.offsetLeft;
        const currentTop = this.state.lastPosition.y ?? this.element.offsetTop;
        const { left, top } = this.clampPosition(currentLeft, currentTop);

        this.element.style.left = left + 'px';
        this.element.style.top = top + 'px';

        this.state.lastPosition = { x: left, y: top };
    }

    clampPosition(proposedLeft, proposedTop) {
        const parentWidth = this.parent.clientWidth;
        const parentHeight = this.parent.clientHeight;

        const elementWidth = this.element.offsetWidth;
        const elementHeight = this.element.offsetHeight;

        const clampedLeft = Math.min(Math.max(proposedLeft, 0), parentWidth - elementWidth);
        const clampedTop = Math.min(Math.max(proposedTop, 0), parentHeight - elementHeight);

        return { left: clampedLeft, top: clampedTop };
    }

    startDrag(startX, startY) {
        this.state.isDragging = true;

        this.dragStart = {
            mouseX: startX,
            mouseY: startY,
            windowX: this.element.offsetLeft,
            windowY: this.element.offsetTop
        };
        this.element.style.transition = 'transform 0.1s ease';
        this.element.style.transform = 'scale(1.05)';
        this.element.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
    }

    onTitlebarDragStart = (e) => {
        e.preventDefault();
        
        if (e.target.closest('.window-button')) {
            return;
        }

        if (this.state.expanded) {
            return;
        }

        this.startDrag(e.clientX, e.clientY);
        document.addEventListener('mousemove', this.onTitlebarDragMove);
        document.addEventListener('mouseup', this.onTitlebarDragEnd);
    }

    onTitlebarDragMove = (e) => {
        if (!this.state.isDragging) return;

        e.preventDefault();

        const clientX = e.clientX;
        const clientY = e.clientY;

        if (clientX === undefined || clientY === undefined) return;

        let newLeft = this.dragStart.windowX + (clientX - this.dragStart.mouseX);
        let newTop = this.dragStart.windowY + (clientY - this.dragStart.mouseY);

        const { left, top } = this.clampPosition(newLeft, newTop);

        this.element.style.left = left + 'px';
        this.element.style.top = top + 'px';
    }

    onTitlebarDragEnd = (e) => {
        if (!this.state.isDragging) return;
        this.state.isDragging = false;

        document.removeEventListener('mousemove', this.onTitlebarDragMove);
        document.removeEventListener('mouseup', this.onTitlebarDragEnd);

        this.element.style.transform = '';
        this.element.style.boxShadow = '';
        this.element.style.transition = 'all 0.3s ease';

        this.state.lastPosition = {
        x: this.element.offsetLeft,
        y: this.element.offsetTop
        };
    }
}