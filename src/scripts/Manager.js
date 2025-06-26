// import Window from "./Window.js";

// export default class Manager {
//     constructor() {
//         this.windows = new Map();

//         this.highestZIndex = 1;
//     }

//     init() {
//         const windows = document.querySelectorAll('.window-container');
//         windows.forEach(window => this.addWindow(window));
//         this.repositionAll();

//         const toggles = document.querySelectorAll('.toggle');
//         toggles.forEach(toggle => this.addToggle(toggle));

//         window.addEventListener('resize', () => this.repositionAll());
//     }

//     addWindow(element) {
//         const win = new Window(element, this);
//         this.windows.set(win.id, win);
//     }

//     addToggle(element) {
//         const windowId = element.dataset.id;
//         const win = this.windows.get(windowId);

//         if (win.state.visible) {
//             element.classList.add('active');
//         } else {
//             element.classList.remove('active');
//         }

//         element.addEventListener('click', () => {
//             win.toggleVisible();
//             this.bringToFront(win);

//             if (win.state.visible) {
//                 element.classList.add('active');
//             } else {
//                 element.classList.remove('active');
//             }
//         });
//     }

//     updateToggleState(id, visible) {
//         const toggle = document.querySelector(`.toggle[data-id="${id}"]`);
//         if (toggle) {
//             toggle.classList.toggle('active', visible);
//         }
//     }

//     bringToFront(windowInstance) {
//         this.highestZIndex++;
//         windowInstance.element.style.zIndex = this.highestZIndex;
//         console.log("Bringing to front!");
//     }

//     hideAll() {
//         this.windows.forEach(win => win.hide());
//     }

//     showAll() {
//         this.windows.forEach(win => win.show());
//     }

//     repositionAll() {
//         this.windows.forEach(win => win.reposition());
//     }

//     getWindows() {
//         console.log(this.windows);
//     }
// }

export default class Manager {
    constructor() {
        this.windows = new Map();
        this.dragging = null;

        document.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
        document.addEventListener('click', this.onClick.bind(this));
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    init() {
        const windowElements = document.querySelectorAll('.window-container');
        windowElements.forEach(el => this.registerWindow(el));
    }

    registerWindow(element) {
        const id = element.dataset.id;

        if (id) {
            this.windows.set(id, {
                element,
                isVisible: false,
                lastPosition: { x: element.offsetLeft, y: element.offsetTop },
                anchor: { left: false, right: false, top: false, bottom: false }
            });
        };
    }
    
    hideWindow(id) {
        console.log("Hiding Window");
    }

    showWindow(id) {
        console.log("Showing Window");
    }

    onMouseDown(e) {
        const titlebar = e.target.closest('.window-titlebar');
        if (!titlebar) return;
        
        const window = e.target.closest('.window-container');
        if (!window) return;
        
        console.log("Mouse down!");

        this.dragging = {
            window,
            startX: e.clientX,
            startY: e.clientY,
            origX: window.offsetLeft,
            origY: window.offsetTop
        }
        // this.bringToFront(window);
    }

    onMouseMove(e) {
        if (!this.dragging) return;

        const dx = e.clientX - this.dragging.startX;
        const dy = e.clientY - this.dragging.startY;

        let newLeftPx = this.dragging.origX + dx;
        let newTopPx = this.dragging.origY + dy;

        const parent = this.dragging.window.parentElement;

        const maxLeftPx = parent.clientWidth - this.dragging.window.offsetWidth;
        const maxTopPx = parent.clientHeight - this.dragging.window.offsetHeight;

        // Clamp the pixel positions
        newLeftPx = Math.max(0, Math.min(newLeftPx, maxLeftPx));
        newTopPx = Math.max(0, Math.min(newTopPx, maxTopPx));

        // Convert pixel positions to percentage relative to parent
        const newLeftPercent = (newLeftPx / parent.clientWidth) * 100;
        const newTopPercent = (newTopPx / parent.clientHeight) * 100;

        // Set the style using %
        this.dragging.window.style.left = `${newLeftPercent}%`;
        this.dragging.window.style.top = `${newTopPercent}%`;
    }

    onMouseUp() {
        if (this.dragging) {
            const { window } = this.dragging;
            const id = window.dataset.id;
            const parent = window.parentElement;

            const margin = 10; // how close to edge counts as 'anchored'

            const left = window.offsetLeft;
            const top = window.offsetTop;
            const right = parent.clientWidth - (left + window.offsetWidth);
            const bottom = parent.clientHeight - (top + window.offsetHeight);

            const anchor = {
                left: left <= margin,
                right: right <= margin,
                top: top <= margin,
                bottom: bottom <= margin,
            };

            if (id && this.windows.has(id)) {
                this.windows.get(id).anchor = anchor;
            }

            this.dragging = null;
        }
    }

    onClick(e) {
        console.log("clicking");
        const element = e.target.closest(`[data-action]`);

        if (!element) return;

        const action = element.dataset.action;

        switch (action) {
            case 'close':
                this.hideWindow();
        }
    }

    onWindowResize() {
        this.windows.forEach(({ element, anchor }) => {
            const parent = element.parentElement;

            let leftPx = element.offsetLeft;
            let topPx = element.offsetTop;

            // If anchored to right or bottom, recalculate position accordingly
            if (anchor.right) {
                leftPx = parent.clientWidth - element.offsetWidth;
            } else if (anchor.left) {
                leftPx = 0;
            }

            if (anchor.bottom) {
                topPx = parent.clientHeight - element.offsetHeight;
            } else if (anchor.top) {
                topPx = 0;
            }

            // Convert to percentages
            const leftPercent = (leftPx / parent.clientWidth) * 100;
            const topPercent = (topPx / parent.clientHeight) * 100;

            element.style.left = `${leftPercent}%`;
            element.style.top = `${topPercent}%`;
        });
    }
}