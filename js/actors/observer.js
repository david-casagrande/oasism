import { checkCollisions } from '../utils/collision';
import Rectangle from './rectangle';

const urls = [
  'images/walk-1.png',
  'images/walk-2.png',
  'images/walk-3.png',
  'images/walk-4.png'
];
const defaultX = 325;
const defaultY = 151;
const width = 54;
const height = 105;

class Observer {
  constructor(opts = {}) {
    this.resources = opts.resources;
    this.x = defaultX;
    this.y = defaultY;
    this.scale = 1;
    this.walking = false;
    this.rects = opts.rects;
    this._registerEvents(opts.eventEmitter);
  }

  update(tickCount) {
    const walkImage = this._walkImage(tickCount);
    const img = this.resources.get(walkImage);
    return [
      img,
      this.x,
      this.y,
      width * this.scale,
      height * this.scale
    ];
  }

  render(ctx, tickCount) {
    const updated = this.update(tickCount);
    ctx.drawImage(...updated);
  }

  _registerEvents(eventEmitter) {
    const verticalSpeed = 0.00275;
    const horizontalSpeed = 0.5;
    eventEmitter.on('up', () => this._moveVertical(-verticalSpeed, -verticalSpeed));
    eventEmitter.on('down', () => this._moveVertical(verticalSpeed, verticalSpeed));
    eventEmitter.on('right', () => this._moveHorizontal(horizontalSpeed));
    eventEmitter.on('left', () => this._moveHorizontal(-horizontalSpeed));
    eventEmitter.on('none', () => this._stopWalking());
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

    let dontMove = false;
    const bottom = this.y + (height * this.scale);
    if(bottom > 305) { dontMove = true; }
    if(this.scale < 0) { dontMove = true; }

    if(!dontMove) {
      dontMove = checkCollisions(this.rects, this.asRectangle);
    }

    if(dontMove) {
      this.y -= step;
      this.scale -= scale;
    }
  }

  _moveHorizontal(step) {
    this.walking = true;
    this.x += step;

    let dontMove = false;
    const left = this.x + (width * this.scale);
    if(left < 0) { dontMove = true; }
    if(this.x > 600) { dontMove = true; }

    if(!dontMove) {
      dontMove = checkCollisions(this.rects, this.asRectangle);
    }

    if(dontMove) {
      this.x -= step;
    }
  }

  _stopWalking() {
    this.walking = false;
  }

  get asRectangle() {
    return new Rectangle(width*this.scale, height*this.scale, this.x, this.y);
  }
}

export default Observer;
