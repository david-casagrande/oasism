import { checkCollisions } from '../utils/collision';
import Rectangle from './rectangle';
import Walls from '../walls';

const urls = [
  'images/walk-1.png',
  'images/walk-2.png',
  'images/walk-3.png',
  'images/walk-4.png',
  'images/walk-5.png',
  'images/walk-6.png'
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
    this.rotate = false;
    this.timer = [];
    this._registerEvents(opts.eventEmitter);
  }

  update(tickCount) {
    const walkImage = this._walkImage(tickCount);
    const img = this.resources.get(walkImage);
    // console.log(tickCount);
    return [
      img,
      this.rotate ? -(this.x) - (width*this.scale) : this.x,
      this.y,
      width * this.scale,
      height * this.scale
    ];
  }

  render(ctx, tickCount) {
    ctx.save();
    ctx.scale(this.rotate ? -1 : 1, 1);
    const updated = this.update(tickCount);
    ctx.drawImage(...updated);
    ctx.restore();
  }

  _registerEvents(eventEmitter) {
    const verticalSpeed = 0.16;//0.00275;
    const horizontalSpeed = 0.16;
    eventEmitter.on('up', () => this._moveVertical(-verticalSpeed, -verticalSpeed));
    eventEmitter.on('down', () => this._moveVertical(verticalSpeed, verticalSpeed));
    eventEmitter.on('right', () => this._moveHorizontal(horizontalSpeed));
    eventEmitter.on('left', () => this._moveHorizontal(-horizontalSpeed));
    // eventEmitter.on('none', () => this._stopWalking());
    eventEmitter.on('click', (x, y) => this._handleClick(x,y));
  }

  _handleClick(x, y) {
    // TODO: refactor
    let xDiff = Math.floor(this.x - (x - (width/2)));
    let yDiff = Math.floor(this.y - (y - (height/2)));

    let moveXNeg = false;
    let moveYNeg = false;
    // this.x = x - (width/2);
    if(xDiff > 0) {
      moveXNeg = true;
    } else {
      xDiff = -(xDiff);
    }

    if(yDiff > 0) {
      moveYNeg = true;
    } else {
      yDiff = -(yDiff);
    }

    if(this.timer.length > 0) {
      this.timer.forEach((timer) => {
        clearTimeout(timer);
      });
      this.timer = [];
    }

    for(let x = 0; x < xDiff; x++) {
      const step = moveXNeg ? -1 : 1;

      let timer = setTimeout(() => {
        this._moveHorizontal(step);
        if(x === xDiff - 1) {
          this.walking = false;
        }
      }, 50*x);
      this.timer.push(timer);
    }

    for(let y = 0; y < yDiff; y++) {
      const step = moveYNeg ? -1 : 1;

      let timer = setTimeout(() => {
        this._moveVertical(step, step);
        if(y === yDiff - 1) {
          this.walking = false;
        }
      }, 50*y);
      this.timer.push(timer);
    }

    console.log(50*xDiff, 50*yDiff);
  }

  _walkImage(tickCount) {
    if(!this.walking) { return urls[0]; }

    if(tickCount < 10) {
      return urls[0];
    } else if(tickCount >= 10 && tickCount < 20) {
      return urls[1];
    } else if(tickCount >= 20 && tickCount < 30) {
      return urls[2];
    } else if(tickCount >= 30 && tickCount < 40) {
      return urls[3];
    } else if(tickCount >= 50 && tickCount < 50) {
      return urls[4];
    } else {
      return urls[5];
    }
  }

  _moveVertical(step, scale) {
    this.walking = true;
    this.y += step;
    // this.scale += scale;

    let dontMove = false;
    const bottom = this.y + (height * this.scale);
    if(bottom > 305) { dontMove = true; }
    if(this.scale < 0) { dontMove = true; }

    if(!dontMove) {
      dontMove = checkCollisions(Walls, this.asRectangle);
    }

    if(dontMove) {
      this.y -= step;
      // this.scale -= scale;
    }
  }

  _moveHorizontal(step) {
    this.walking = true;
    this.x += step;

    if(step > 0) {
      this.rotate = true;
    } else {
      this.rotate = false;
    }

    let dontMove = false;
    const left = this.x + (width * this.scale);
    if(left < 0) { dontMove = true; }
    if(this.x > 600) { dontMove = true; }

    if(!dontMove) {
      dontMove = checkCollisions(Walls, this.asRectangle);
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
