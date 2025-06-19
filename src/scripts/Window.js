export default class Window {

  static highestZIndex = 1;
  /**
   * @param {HTMLElement} element
   */
  constructor(element) {
    this.element = element;
    this.id = element.dataset.id;
    this.parent = element.parentElement;
    this.header = this.element.querySelector('.window-header');
    this.controls = {
      close: this.element.querySelector('.window-control.close'),
      resize: this.element.querySelector('.window-control.resize')
    }
    this.state = {
      minimized: false,
      maximized: false,
      lastPosition: {x: 0, y: 0},
      lastSize: {width: this.element.offsetWidth, height: this.element.offsetHeight}
    }
    this.element.addEventListener('mousedown', this.bringToFront.bind(this));
    this.header.addEventListener('mousedown', this.onHeaderMouseDown);
  }

  onHeaderMouseDown = (e) => {
    console.log("Header mouse down!");
    e.preventDefault();
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

  handleCloseButton = () => {
    // TODO
  }

  handleResizeButton = () => {
    // TODO
  }

  bringToFront = () => {
    Window.highestZIndex += 1;
    this.element.style.zIndex = Window.highestZIndex.toString();
    console.log("Bringing to front!");
  }
}

