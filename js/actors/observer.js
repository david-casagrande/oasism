import { checkCollisions } from '../utils/collision';
import Rectangle from './rectangle';
import Walls from '../walls';
import BlastAreas from '../blast-areas';

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
  'images/observer_gunarm_right.png',
  'images/observer.png'
];
const defaultX = 325;
const defaultY = 151;
const width = 40;
const height = 90;
const kneelingWidth = 300;
const kneelingHeight = 300;
const kneelingWidthOffset = kneelingWidth/2.5;
const kneelingHeightOffset = kneelingHeight/2.9;
const TO_RADIANS = Math.PI/180;

class Observer {
  constructor(opts = {}) {
    this.resources = opts.resources;
    this.x = defaultX;
    this.y = defaultY;
    this.newX = 0;
    this.newY = 0;
    this.scale = 1;
    this.walking = false;
    this.rotate = false;
    this.walkingCounter = 0;
    this.timer = [];
    this._registerEvents(opts.eventEmitter);
    this.width = width;
    this.height = height;
    this.kneeling = false;
    this.kneelingCounter = 0;
    this.kneelingLeft = true;
    this.standup = false;
    this.standupCounter = 0;
    this._mouseMoveRad = 0;
    this.node = opts.node;
  }

  render(ctx, tickCount) {
    this._updatePosition();

    //if observer is kneeling and not in the process of kneeling then draw the gun
    const drawGun = this.kneeling && this.kneelingCounter > 90;

    //draw arm behind observer if kneeling right
    if(drawGun && !this.kneelingLeft) {
      this._drawGunArm(ctx);
    }

    this._drawObserver(ctx);

    //draw arm in front of observer if kneeling left
    if(drawGun && this.kneelingLeft) {
      this._drawGunArm(ctx);
    }
  }

  _drawObserver(ctx) {
    ctx.save();
    ctx.scale(this.rotate ? -1 : 1, 1);

    //draw observer walking/kneeling/standingup
    // const observerArgs = this.kneeling ? this.kneelingObserverArgs : this.walkingObserverArgs;
    let observerArgs;
    if(this.standup) {
      observerArgs = this.standupObserverArgs;
    } else if(this.kneeling) {
      observerArgs = this.kneelingObserverArgs
    } else if(this.walking) {
      observerArgs = this.walkingObserverArgs;
    } else {
      observerArgs = this.stationaryObserverArgs;
    }

    ctx.drawImage(...observerArgs);

    ctx.restore();
  }

  _drawGunArm(ctx) {
    ctx.save();
    if(this.rotate) {
      if(this.kneelingLeft) {
        ctx.translate(this._rotateX(this.gunArmArgs[1], kneelingWidth + 9), this.gunArmArgs[2] - 2);
      } else {
        ctx.translate(this._rotateX(this.gunArmArgs[1], kneelingWidth + 8), this.gunArmArgs[2] + 4);
      }
    } else {
      ctx.translate(this.gunArmArgs[1], this.gunArmArgs[2]);
    }

    ctx.translate(this.gunArmArgs[3]/2, this.gunArmArgs[4]/2);

    ctx.rotate(this.mouseMoveRad);
    ctx.drawImage(...[
      this.gunArmArgs[0],
      -(this.gunArmArgs[3]/2),
      -(this.gunArmArgs[4]/2),
      this.gunArmArgs[3],
      this.gunArmArgs[4]
    ]);
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
      if(this.kneeling) {
        this.standup = true;
        this.kneeling = false;
      } else {
        this.standup = false;
        this.kneeling = true;
      }
    } else {
      //shoot the gun
      if(this.kneeling) {
        this.node.shoot(x, y, this.x, this.y);
        // BlastAreas.forEach((area) => {
        //   if(x > area.x && x < area.x + area.width && y > area.y && y < area.y + area.height) {
        //     area.blasted = true;
        //   }
        // });
      } else {
        //get observer walking
        this.walking = true;
        this.newX =  Math.floor(x - (width/2));
        this.newY = Math.floor(y - (height));
      }
    }
  }

  _handleMouseMove(x, y) {
    //left side of observer
    this.kneelingLeft = x - (width/2) < this.x;

    // get angle
    let deltaX;
    let deltaY;
    if(this.kneelingLeft) {
      deltaX = this.x - x;
      deltaY = this.y - y + 35;
    } else {
      deltaX = (x - this.x);
      deltaY = -(this.y - y + 55);
    }
    this.mouseMoveRad = Math.atan2(deltaY, deltaX);
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

  _standupImage() {
    this.standupCounter += 1;
    let img;

    if(this.standupCounter < 15) {
      img = urls[9];
    } else if(this.standupCounter >= 15 && this.standupCounter < 30) {
      img = urls[8];
    } else if(this.standupCounter >= 30 && this.standupCounter < 45) {
      img = urls[7];
    }  else {
      img = urls[6];
    }

    if(this.standupCounter >= 60) {
      this.standup = false;
      this.standupCounter = 0;
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

  get standupObserverArgs() {
    return [
      this.resources.get(this._standupImage()),
      this._rotateX(this.kneelingX, kneelingWidth - 10),
      this.kneelingY,
      kneelingWidth,
      kneelingHeight
    ];
  }

  get stationaryObserverArgs() {
    return [
      this.resources.get(urls[16]),
      this._rotateX(this.kneelingX, kneelingWidth - 10),
      this.kneelingY,
      kneelingWidth,
      kneelingHeight
    ];
  }

  get gunArmArgs() {
    let img;
    if(this.rotate) {
      // img = this.kneelingLeft ? urls[15] : urls[14];
      img = this.kneelingLeft ? urls[14] : urls[15];
    } else {
      img = this.kneelingLeft ? urls[14] : urls[15];
    }

    let _kneelingX;
    if(this.rotate) {
      _kneelingX = this.kneelingLeft ? this.kneelingX - 14 : this.kneelingX - 6;
    } else {
      _kneelingX = this.kneelingLeft ? this.kneelingX : this.kneelingX;// + 6;
    }

    return [
      this.resources.get(img),
      this._rotateX(_kneelingX, kneelingWidth),
      this.kneelingY,
      kneelingWidth,
      kneelingHeight
    ];
  }

  set mouseMoveRad(newValue) {
    this._mouseMoveRad = newValue;
  }

  get mouseMoveRad() {
    const radian = this._mouseMoveRad;
    const lowerLimit = this.kneelingLeft ? -0.15 : -0.35;
    const upperLimit = this.kneelingLeft ? 0.5 : 0.175;
    if(radian < lowerLimit) {
      return lowerLimit;
    } else if(radian > upperLimit) {
      return upperLimit;
    } else {
      return radian;
    }
  }
}

export default Observer;
