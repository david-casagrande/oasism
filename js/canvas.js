const width = 600;
const height = 300;

class Canvas {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.classList.add('centered');
  }

  render(el) {
    el.appendChild(this.canvas);
  }
}

export default Canvas;
