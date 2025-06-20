export default class Window {

  static highestZIndex = 1;
  /**
   * @param {HTMLElement} element
   */
  constructor(element) {
    this.element = element;
    this.id = element.dataset.id;
    this.parent = element.parentElement;
    this.overlay = document.querySelector('#overlay');
    this.header = this.element.querySelector('.window-header');
    this.controls = {
      close: this.element.querySelector('.window-control.close'),
      expand: this.element.querySelector('.window-control.expand')
    }
    this.state = {
      hidden: false,
      expanded: false,
      lastPosition: {x: 0, y: 0},
      lastSize: {width: this.element.offsetWidth, height: this.element.offsetHeight}
    }
    this.element.addEventListener('mousedown', this.bringToFront.bind(this));
    this.header.addEventListener('mousedown', this.onHeaderMouseDown);
    this.controls.close.addEventListener('click', this.handleCloseButton);
    this.controls.expand.addEventListener('click', this.handleExpandButton);
  }

  onHeaderMouseDown = (e) => {
    e.preventDefault();
    if (e.target.closest('.window-control')) {
      return;
    }

    if (this.state.expanded == true) {
      return;
    }
    this.bringToFront();
    this.element.classList.add('dragging');
    document.addEventListener('mousemove', this.onHeaderMouseMove);
    document.addEventListener('mouseup', this.onHeaderMouseUp);
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startLeft = parseInt(this.element.style.left, 10) || 0;
    this.startTop = parseInt(this.element.style.top, 10) || 0;
  }

  onHeaderMouseMove = (e) => {
    const maxLeft = this.parent.clientWidth  - this.element.offsetWidth;
    const maxTop = this.parent.clientHeight - this.element.offsetHeight;
    const newLeft = Math.min(Math.max(this.startLeft + e.clientX - this.startX, 0), maxLeft);
    const newTop = Math.min(Math.max(this.startTop + e.clientY - this.startY, 0), maxTop);
    this.element.style.left = `${newLeft}px`;
    this.element.style.top = `${newTop}px`;
    this.state.lastPosition = { x: newLeft, y: newTop };
  }

  onHeaderMouseUp = (e) => {
    this.element.classList.remove('dragging');
    document.removeEventListener('mousemove', this.onHeaderMouseMove);
    document.removeEventListener('mouseup', this.onHeaderMouseUp);
  }

  handleCloseButton = (e) => {
    e.preventDefault();
    // TODO
    console.log("Handling Close");
  }

  handleExpandButton = (e) => {
    e.preventDefault();
    
    if (!this.state.expanded) {
      this.expand();
    } else {
      this.minimize();
    }
  }

  expand = () => {
    const parentRect = this.parent.getBoundingClientRect();
    const elementRect = this.element.getBoundingClientRect();

    this.state.lastPosition = {
      x: this.element.offsetLeft,
      y: this.element.offsetTop
    };
    this.state.lastSize = {
      width: this.element.offsetWidth,
      height: this.element.offsetHeight
    };

    const maxWidth = 700;
    const targetWidth = Math.min(maxWidth, parentRect.width * 0.9);

    const targetLeft = (this.parent.clientWidth - targetWidth) / 2;
    const targetTop = 20;

    this.element.style.transition = 'all 0.3s ease';
    this.element.style.width = `${targetWidth}px`;
    this.element.style.left = `${targetLeft}px`;
    this.element.style.top = `${targetTop}px`;
    this.overlay.style.opacity = '1';
    this.overlay.style.pointerEvents = 'auto';
    this.overlay.style.zIndex = (Window.highestZIndex - 1).toString();
    this.state.expanded = true;
  }

  minimize = () => {
    this.element.style.width = `${this.state.lastSize.width}px`;
    this.element.style.height = `${this.state.lastSize.height}px`;
    this.element.style.left = `${this.state.lastPosition.x}px`;
    this.element.style.top = `${this.state.lastPosition.y}px`;

    // After transition, reset position and z-index styles
    const onRestoreTransitionEnd = () => {
        this.element.removeEventListener('transitionend', onRestoreTransitionEnd);
        if (!this.state.maximized) {
            this.element.style.position = '';
            this.element.style.zIndex = '';
            this.element.style.transition = '';
        }
    };
    this.element.addEventListener('transitionend', onRestoreTransitionEnd);
    this.overlay.style.opacity = '0';
    this.overlay.style.pointerEvents = 'none';
    this.state.expanded = false;
  }

  bringToFront = () => {
    Window.highestZIndex += 1;
    this.element.style.zIndex = Window.highestZIndex.toString();
  }

  toggleVisibility = () => {
    
  }
}
