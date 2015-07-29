const urls = [
  'images/observer_gunarm_left.png',
  'images/observer_gunarm_right.png'
];

class GunArm {
  constructor(opts = {}) {
    this.resources = opts.resources;
    this.x = 0;
    this.y = 0;

    this.width = 300;
    this.height = 300;
    this.kneelingLeft = false;

    this.show = false
  }

  draw(ctx, kneelingLeft, kneelingX, kneelingY) {
    this.kneelingLeft = kneelingLeft;
    this.x = kneelingX;
    this.y = kneelingY;

    this.render(ctx);
  }

  hide() {
    this.show = false;
  }

  render(ctx) {
    const img = this.kneelingLeft ? urls[0] : urls[1];
    ctx.drawImage(...[
      this.resources.get(img),
      this.x,
      this.y,
      this.width,
      this.height
    ]);
    // this._drawGunArm(ctx);
  }

  _drawGunArm(ctx) {
    // ctx.save();
    // if(this.rotate) {
    //   if(this.kneelingLeft) {
    //     ctx.translate(this._rotateX(this.gunArmArgs[1], this.kneelingWidth + 9), this.gunArmArgs[2] - 2);
    //   } else {
    //     ctx.translate(this._rotateX(this.gunArmArgs[1], this.kneelingWidth + 8), this.gunArmArgs[2] + 4);
    //   }
    // } else {
    //   ctx.translate(this.gunArmArgs[1], this.gunArmArgs[2]);
    // }
    //
    // ctx.translate(this.gunArmArgs[3]/2, this.gunArmArgs[4]/2);
    //
    // ctx.rotate(this.mouseMoveRad);
    // ctx.drawImage(...[
    //   this.gunArmArgs[0],
    //   -(this.gunArmArgs[3]/2),
    //   -(this.gunArmArgs[4]/2),
    //   this.gunArmArgs[3],
    //   this.gunArmArgs[4]
    // ]);
    // ctx.restore();
  }

  _handleMouseMove(x, y) {
    //left side of observer
    // this.kneelingLeft = x - (width/2) < this.x;
    //
    // // get angle
    // let deltaX;
    // let deltaY;
    // if(this.kneelingLeft) {
    //   deltaX = this.x - x;
    //   deltaY = this.y - y;
    // } else {
    //   deltaX = (x - this.x);
    //   deltaY = -(this.y - y);
    // }
    // this.mouseMoveRad = Math.atan2(deltaY, deltaX);
  }

  get gunArmArgs() {
    // let img;
    // if(this.rotate) {
    //   // img = this.kneelingLeft ? urls[15] : urls[14];
    //   img = this.kneelingLeft ? urls[14] : urls[15];
    // } else {
    //   img = this.kneelingLeft ? urls[14] : urls[15];
    // }
    //
    // let _kneelingX;
    // if(this.rotate) {
    //   _kneelingX = this.kneelingLeft ? this.kneelingX - 14 : this.kneelingX - 6;
    // } else {
    //   _kneelingX = this.kneelingLeft ? this.kneelingX : this.kneelingX + 6;
    // }
    //
    // return [
    //   this.resources.get(img),
    //   this._rotateX(_kneelingX, this.kneelingWidth),
    //   this.kneelingY,
    //   this.kneelingWidth,
    //   kneelingHeight
    // ];
    return [];
  }

  set mouseMoveRad(newValue) {
    // this._mouseMoveRad = newValue;
  }

  get mouseMoveRad() {
    // const radian = this._mouseMoveRad;
    // const lowerLimit = this.kneelingLeft ? -0.25 : -0.6;
    // const upperLimit = this.kneelingLeft ? 0.8 : 0.5;
    // if(radian < lowerLimit) {
    //   return lowerLimit;
    // } else if(radian > upperLimit) {
    //   return upperLimit;
    // } else {
    //   return radian;
    // }
  }
}

export default GunArm;
