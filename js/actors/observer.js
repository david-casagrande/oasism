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
    this.walkingCounter = 0;
    this.timer = [];
    this._registerEvents(opts.eventEmitter);
    this.width = width;
    this.height = height;
    this.kneelingCounter = 0;
    this.kneelingLeft = true;
  }

  render(ctx, tickCount) {
    this._updatePosition();

    ctx.save();
    ctx.scale(this.rotate ? -1 : 1, 1);

    //draw observer walking/kneeling
    const observerArgs = this.kneeling ? this.kneelingObserverArgs : this.walkingObserverArgs;
    ctx.drawImage(...observerArgs);

    //if observer is kneeling and not in the process of kneeling then draw the gun
    if(this.kneeling && this.kneelingCounter > 90) {
      ctx.drawImage(...this.gunArmArgs);
    }

    ctx.restore();
  }

  _rotateX(x, objWidth) {
    return this.rotate ? -(x) - objWidth : x;
  }

  _registerEvents(eventEmitter) {
    eventEmitter.on('click', (x, y) =>  {
      this.walkingCounter = 0;
      this._handleClick(x, y);
    });

    eventEmitter.on('mousemove', (x, y) =>  {
      if(!this.kneeling) { return; };
      this._handleMouseMove(x, y);
    });
  }

  _handleClick(x, y) {
    //always stop walking
    if(this.walking) {
      this.walking = false;
      return;
    }

    //detect click is on observer or outside of observer
    if(x > this.x && x < (this.x + width) && y > this.y && y < (this.y + height)) {
      //set kneeling to its inverse and reset the counter
      this.kneelingCounter = 0;
      this.kneeling = !this.kneeling;
    } else {
      //get observer walking
      this.walking = true;
      this.newX =  Math.floor(x - (width/2));
      this.newY = Math.floor(y - (height));
    }
  }

  _handleMouseMove(x, y) {
    //left side of observer
    this.kneelingLeft = x - (width/2) < this.x;
  }

  _walkingImage() {
    if(!this.walking) { return urls[0]; }

    this.walkingCounter += 1;
    let img;

    if(this.walkingCounter < 15) {
      img = urls[0];
    } else if(this.walkingCounter >= 15 && this.walkingCounter < 30) {
      img = urls[1];
    } else if(this.walkingCounter >= 30 && this.walkingCounter < 45) {
      img = urls[2];
    } else if(this.walkingCounter >= 45 && this.walkingCounter < 60) {
      img = urls[3];
    } else if(this.walkingCounter >= 60 && this.walkingCounter < 75) {
      img = urls[4];
    } else if(this.walkingCounter >= 75 && this.walkingCounter <= 90) {
      img = urls[5];
    } else {
      img = urls[0];
    }

    if(this.walkingCounter >= 90) {
      this.walkingCounter = 0;
    }

    return img;
  }

  _kneelingImage() {
    this.kneelingCounter += 1;
    let img;

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
      if(this.rotate) {
        img = this.kneelingLeft ? urls[13] : urls[12];
      } else {
        img = this.kneelingLeft ? urls[12] : urls[13];
      }
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
    this._moveVertical(yStep, yStep);
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

  get kneelingX() {
    return this.x - kneelingWidthOffset;
  }

  get kneelingY() {
    return this.y - kneelingHeightOffset;
  }

  get walkingObserverArgs() {
    return [
      this.resources.get(this._walkingImage()),
      this._rotateX(this.x, width),
      this.y,
      this.width,
      this.height
    ];
  }

  get kneelingObserverArgs() {
    return [
      this.resources.get(this._kneelingImage()),
      this._rotateX(this.kneelingX, kneelingWidth - 10),
      this.kneelingY,
      kneelingWidth,
      kneelingHeight
    ];
  }

  get gunArmArgs() {
    let img;
    if(this.rotate) {
      img = this.kneelingLeft ? urls[15] : urls[14];
    } else {
      img = this.kneelingLeft ? urls[14] : urls[15];
    }

    let _kneelingX;
    if(this.rotate) {
      _kneelingX = this.kneelingLeft ? this.kneelingX - 14 : this.kneelingX - 6;
    } else {
      _kneelingX = this.kneelingLeft ? this.kneelingX : this.kneelingX + 6;
    }

    return [
      this.resources.get(img),
      this._rotateX(_kneelingX, kneelingWidth),
      this.kneelingY,
      kneelingWidth,
      kneelingHeight
    ];
  }
}

export default Observer;
