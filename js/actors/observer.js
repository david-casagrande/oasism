const urls = [
  'images/walk-1.png',
  'images/walk-2.png',
  'images/walk-3.png',
  'images/walk-4.png'
];

class Observer {
  constructor(opts = {}) {
    this.resources = opts.resources;
    this.x = 325;
    this.y = 151;
    this.scale = 1;
    this.walking = false;

    opts.eventEmitter.on('up', () => this._moveVertical(-1, -0.01));
    opts.eventEmitter.on('down', () => this._moveVertical(1, 0.01));
    opts.eventEmitter.on('right', () => this._moveHorizontal(1));
    opts.eventEmitter.on('left', () => this._moveHorizontal(-1));
    opts.eventEmitter.on('none', () => this._stopWalking());
  }

  update(tickCount) {
    const walkImage = this._walkImage(tickCount);
    const img = this.resources.get(walkImage);
    return [
      img,
      this.x,
      this.y,
      img.width * this.scale,
      img.height * this.scale
    ];
  }

  _walkImage(tickCount) {
    if(!this.walking) { return urls[0]; }

    if(tickCount < 15) {
      return urls[0];
    } else if(tickCount >= 15 && tickCount < 30) {
      return urls[1];
    } else if(tickCount >= 30 && tickCount < 45) {
      return urls[2];
    } else {
      return urls[3];
    }
  }

  _moveVertical(step, scale) {
    this.walking = true;
    this.y += step;
    this.scale += scale;
  }

  _moveHorizontal(step) {
    this.walking = true;
    this.x += step;
  }

  _stopWalking() {
    this.walking = false;
  }
}

export default Observer;
