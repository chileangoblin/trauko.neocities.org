export default class Window {
  static highestZIndex = 1;

  constructor(element) {
    this.el = element;
    this.id = element.dataset.id;

    this.header = this.el.querySelector('.window-header');
    this.controls = {
      close: this.el.querySelector('.window-control.close'),
      maximize: this.el.querySelector('.window-control.maximize'),
    };

    this.state = {
      minimized: false,
      maximized: false,
      lastPosition: { x: 0, y: 0 },
      lastSize: { width: this.el.offsetWidth, height: this.el.offsetHeight },
    };

    this.el.style.position = 'absolute'; // Ensure the element is positioned

    this.el.addEventListener('mousedown', this._bringToFront);
    this.header.addEventListener('mousedown', this._onHeaderMouseDown);
    this.controls.close.addEventListener('click', () => this.close());
    this.controls.maximize.addEventListener('click', () => this.toggleMaximize());

    // Initialize with a z-index (optional)
    this.el.style.zIndex = Window.highestZIndex;
  }

  _bringToFront = () => {
    Window.highestZIndex += 1;
    this.el.style.zIndex = Window.highestZIndex;
  };

  _onHeaderMouseDown = (e) => {
    e.preventDefault();
    this._bringToFront();  // Also bring to front on drag start
    this.el.classList.add('dragging');

    this._startX = e.clientX;
    this._startY = e.clientY;
    this._startLeft = parseInt(this.el.style.left, 10) || 0;
    this._startTop = parseInt(this.el.style.top, 10) || 0;

    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseup', this._onMouseUp);
  };

  _onMouseMove = (e) => {
    e.preventDefault();

    const parent = this.el.parentElement;
    const maxLeft = parent.clientWidth - this.el.offsetWidth;
    const maxTop = parent.clientHeight - this.el.offsetHeight;

    const newLeft = Math.min(Math.max(this._startLeft + e.clientX - this._startX, 0), maxLeft);
    const newTop = Math.min(Math.max(this._startTop + e.clientY - this._startY, 0), maxTop);

    this.el.style.left = `${newLeft}px`;
    this.el.style.top = `${newTop}px`;

    this.state.lastPosition = { x: newLeft, y: newTop };
  };

  _onMouseUp = () => {
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);
    this.el.classList.remove('dragging');
  };

  close() {
    console.log('Closing!');
  }

  toggleMaximize() {
    if (!this.state.maximized) {
        // Save current position and size
        const rect = this.el.getBoundingClientRect();
        this.state.lastPosition = { x: rect.left, y: rect.top };
        this.state.lastSize = { width: rect.width, height: rect.height };

        // Get parent boundaries
        const parentRect = this.el.parentElement.getBoundingClientRect();

        // Calculate target size (max width 800)
        const maxWidth = 800;
        const maxHeight = parentRect.height * 0.8;

        const targetWidth = Math.min(maxWidth, parentRect.width * 0.9);
        const aspectRatio = this.state.lastSize.width / this.state.lastSize.height;
        let targetHeight = targetWidth / aspectRatio;

        if (targetHeight > maxHeight) {
            targetHeight = maxHeight;
        }

        // Position horizontally centered within parent, top aligned to parent's top
        const targetLeft = parentRect.left + (parentRect.width - targetWidth) / 2;
        const targetTop = parentRect.top;

        // Animate window to top and max size within parent boundaries
        this.el.style.position = 'fixed';
        this.el.style.zIndex = 9999;
        this.el.style.transition = 'all 0.3s ease';
        this.el.style.width = `${targetWidth}px`;
        this.el.style.height = `${targetHeight}px`;
        this.el.style.left = `${targetLeft}px`;
        this.el.style.top = `${targetTop}px`;

        this.state.maximized = true;

    } else {
        // Animate window back to saved size and position
        this.el.style.width = `${this.state.lastSize.width}px`;
        this.el.style.height = `${this.state.lastSize.height}px`;
        this.el.style.left = `${this.state.lastPosition.x}px`;
        this.el.style.top = `${this.state.lastPosition.y}px`;

        // After transition, reset position and z-index styles
        const onRestoreTransitionEnd = () => {
            this.el.removeEventListener('transitionend', onRestoreTransitionEnd);
            if (!this.state.maximized) {
                this.el.style.position = '';
                this.el.style.zIndex = '';
                this.el.style.transition = '';
            }
        };
        this.el.addEventListener('transitionend', onRestoreTransitionEnd);

        this.state.maximized = false;
    }
}


}
