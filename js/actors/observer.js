import { checkCollisions } from '../utils/collision';
import Rectangle from './rectangle';
import Walls from '../walls';

const urls = [
  'images/walk_1.png',
  'images/walk_2.png',
  'images/walk_3.png',
  'images/walk_4.png',
  'images/walk_5.png',
  'images/walk_6.png',
  'images/observer_pack_1.png',
  'images/observer_pack_2.png',
  'images/observer_pack_3.png',
  'images/observer_pack_4.png',
  'images/observer_pack_rummage_1.png',
  'images/observer_pack_rummage_2.png',
  'images/observer_gun_aim_left.png',
  'images/observer_gun_aim_right.png',
  'images/observer_gunarm_left.png',
  'images/observer_gunarm_right.png'
];
const defaultX = 325;
const defaultY = 151;
const width = 40;
const height = 90;
const kneelingWidth = 300;
const kneelingHeight = 300;
const kneelingWidthOffset = kneelingWidth/2.5;
const kneelingHeightOffset = kneelingHeight/2.9;

class Observer {
  constructor(opts = {}) {
    this.resources = opts.resources;
    this.x = defaultX;
    this.y = defaultY;
    this.newX = 0;
    this.newY = 0;
    this.scale = 1;
    this.walking = false;
    this.kneeling = false;
    this.rotate = false;
    this.imgCounter = 0;
    this.timer = [];
    this._registerEvents(opts.eventEmitter);
    this.width = width;
    this.height = height;
    this.kneelingCounter = 0;
  }

  update() {
    const walkImage = this._walkImage();
    const img = this.resources.get(walkImage);
    this._updatePosition();
    // console.log(this.rotate);
    return [
      img,
      this.rotate ? -(this.x) - (width*this.scale) : this.x,
      this.y,
      this.width * this.scale,
      this.height * this.scale
    ];
  }

  render(ctx, tickCount) {
    ctx.save();
    ctx.scale(this.rotate ? -1 : 1, 1);
    const updated = this.update();
    ctx.drawImage(...updated);
    ctx.restore();
  }

  _registerEvents(eventEmitter) {
    const verticalSpeed = 0.16;//0.00275;
    const horizontalSpeed = 0.16;
    // eventEmitter.on('up', () => this._moveVertical(-verticalSpeed, -verticalSpeed));
    // eventEmitter.on('down', () => this._moveVertical(verticalSpeed, verticalSpeed));
    // eventEmitter.on('right', () => this._moveHorizontal(horizontalSpeed));
    // eventEmitter.on('left', () => this._moveHorizontal(-horizontalSpeed));
    // eventEmitter.on('none', () => this._stopWalking());
    eventEmitter.on('click', (x, y) =>  {
      this.imgCounter = 0;
      this._handleClick(x,y);
    });
  }

  _handleClick(x, y) {
    // TODO: refactor
    if(this.walking) {
      this.walking = false;
      return;
    } else {
      this.walking = true;
    }

    //check if user has clicked on the observer
    const diffX = this.kneeling ? (this.x + (this.rotate ? -kneelingWidthOffset : kneelingWidthOffset)) : this.x;
    let diff;

    if(diffX < x) {
      diff = x - diffX;
    } else {
      diff = (diffX + width) - x;
    }

    //if user has clicked observer make him kneel or stand up
    if(diff <= width + 10) {
      if(this.kneeling) {
        this.kneelingCounter = 0;
      }

      this.walking = false;
      if(this.rotate) {
        this.x += this.kneeling ? -kneelingWidthOffset : kneelingWidthOffset;
      } else {
        this.x -= this.kneeling ? -kneelingWidthOffset : kneelingWidthOffset;
      }

      this.y -= this.kneeling ? -kneelingHeightOffset : kneelingHeightOffset;
      this.width = this.kneeling ? width : kneelingWidth;
      this.height = this.kneeling ? height : kneelingHeight;
      this.kneeling = !this.kneeling;

      return;
    }

    //if observer is kneeling we dont need to adjust the x/y position
    if(this.kneeling) { return; }

    this.newX =  Math.floor(x - (width/2));
    this.newY = Math.floor(y - (height));
  }

  _walkImage() {
    if(this.kneeling) {
      return this._kneelingImg();
    }

    if(!this.walking) { return urls[0]; }

    this.imgCounter += 1;
    var img;

    if(this.imgCounter < 15) {
      img = urls[0];
    } else if(this.imgCounter >= 15 && this.imgCounter < 30) {
      img = urls[1];
    } else if(this.imgCounter >= 30 && this.imgCounter < 45) {
      img = urls[2];
    } else if(this.imgCounter >= 45 && this.imgCounter < 60) {
      img = urls[3];
    } else if(this.imgCounter >= 60 && this.imgCounter < 75) {
      img = urls[4];
    } else if(this.imgCounter >= 75 && this.imgCounter <= 90) {
      img = urls[5];
    } else {
      img = urls[0];
    }

    if(this.imgCounter >= 90) {
      this.imgCounter = 0;
    }

    return img;
  }

  _kneelingImg() {
    this.kneelingCounter += 1;
    var img;

    if(this.kneelingCounter < 15) {
      img = urls[6];
    } else if(this.kneelingCounter >= 15 && this.kneelingCounter < 30) {
      img = urls[7];
    } else if(this.kneelingCounter >= 30 && this.kneelingCounter < 45) {
      img = urls[8];
    } else if(this.kneelingCounter >= 45 && this.kneelingCounter < 60) {
      img = urls[9];
    } else if(this.kneelingCounter >= 60 && this.kneelingCounter < 75) {
      img = urls[10];
    } else if(this.kneelingCounter >= 75 && this.kneelingCounter <= 90) {
      img = urls[11];
    } else {
      img = urls[12];
    }
// console.log(this.kneelingCounter);
    if(this.kneelingCounter >= 90) {
      // this.kneelingCounter = 0;
      // this.width = width;
      // this.height = height;
      // this.x += kneelingWidthOffset;
      // this.y += kneelingHeightOffset;
      // this.kneeling = false;
    }

    return img;
  }

  _updatePosition() {
    if(!this.walking || this.kneeling) { return; }
    let xDiff = Math.floor(this.x - this.newX);
    let yDiff = Math.floor(this.y - this.newY);

    if(xDiff === 0 /*&& yDiff <= 0*/) {
      this.walking = false;
      return;
    }

    let moveXNeg = false;
    let moveYNeg = false;

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

    var xStep = moveXNeg ? -0.25 : 0.25;
    var yStep = moveYNeg ? -0.25 : 0.25;

    this._moveHorizontal(xStep, xStep);
    // this._moveVertical(yStep, yStep);
  }

  _moveVertical(step, scale) {
    // this.walking = true;
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
    // this.walking = true;
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
