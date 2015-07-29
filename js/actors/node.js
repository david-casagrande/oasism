import BlastAreas from '../blast-areas';

const urls = [
  'images/node_shooting.png',
  'images/node_lightning_1.png',
  'images/node_lightning_2.png',
  'images/node_lightning_3.png',
  'images/node_light_1.png',
  'images/node_light_2.png',
  'images/node_light_3.png',
  'images/node_light_4.png'
];


class Node {
  constructor(opts = {}) {
    this.resources = opts.resources;
    this.x = 0;
    this.y = 0;
    this.newX = 0;
    this.newY = 0;
    this.shooting = false;
    this.lightning = false;
    this.lightningCount = 0;
    this.lightningCycle = 0;
    this.width = 25;
    this.height = 23;
    this.kneelingLeft = false;
    this.showNodeLight = false;
    this.nodeLightCount = 0;
    this.lightX = 0;
    this.lightY = 0;
  }

  shoot(x, y, originX, originY, radian, kneelingLeft) {
    if(this.shooting) { return; }
    this.showNodeLight = false;
    this.newX = x;
    this.newY = y;
    this.x = originX;
    this.y = originY;
    this.radian = radian;
    this.kneelingLeft = kneelingLeft;
    this.shooting = true;
    this.lightning = true;

    // this._updatePosition(x, y);
    BlastAreas.forEach((area) => {
      if(x > area.x && x < area.x + area.width && y > area.y && y < area.y + area.height) {
        area.blasted = true;
      }
    });
  }

  showLight(x, y) {
    this.showNodeLight = true;
    this.lightX = x;
    this.lightY = y;
  }

  hideLight() {
    this.showNodeLight = false;
  }

  render(ctx, tickCount) {
    // this._updatePosition();
    // const radian = this.radian;
    // const speed = 3.0; // pixels per tick
    // const xVelocity = speed * Math.cos(radian);
    // const yVelocity = speed * Math.sin(radian);
    // console.log(xVelocity, yVelocity);

    // ctx.save();
    // ctx.translate(this.x, this.y);
    // ctx.translate(this.width/2, this.height/2);
    // ctx.rotate(radian);
    // ctx.drawImage(...[
    //   this.resources.get(urls[0]),
    //   -(this.width/2),
    //   -(this.height/2),
    //   this.width,
    //   this.height
    // ]);
    // ctx.restore();
    if(this.shooting) {
      ctx.drawImage(...this.nodeLightningArgs);
    }

    if(this.showNodeLight) {
      ctx.drawImage(...this.nodeLightArgs);
    }

    // ctx.drawImage(...this.nodeArgs);
  }

  get nodeArgs() {
    return [
      this.resources.get(urls[0]),
      this.x,
      this.y,
      this.width,
      this.height
    ];
  }

  get nodeLightningArgs() {
    return [
      this.resources.get(this._nodeLightningImage()),
      this.newX - (this.width/2),
      this.newY - (this.height/2),
      this.width,
      this.height
    ];
  }

  get nodeLightArgs() {
    return [
      this.resources.get(this._nodeLightImage()),
      this.lightX - (this.width * 1.2),
      this.lightY - (this.height * 1.5),
      this.width * 2.5,
      this.height * 2.5
    ];
  }

  _nodeLightningImage() {
    let img;

    let pace = this.lightningCount += 0.85;

    if(pace >= 0 && pace < 10) {
      img = urls[1];
    } else if(pace >= 10 && pace < 20) {
      img = urls[2];
    } else {
      img = urls[3];
    }

    if(this.lightningCount >= 30) {
      this.lightningCycle += 1;
      this.lightningCount = 0;

      if(this.lightningCycle >= 4) {
        this.lightningCount = 0;
        this.lightningCycle = 0;
        this.shooting = false;
      }
    }

    return img;
  }

  _nodeLightImage() {
    let img;

    let pace = this.nodeLightCount += 0.5;

    if(pace >= 0 && pace < 10) {
      img = urls[4];
    } else if(pace >= 10 && pace < 20) {
      img = urls[5];
    } else if(pace >= 20 && pace < 30) {
      img = urls[6];
    } else {
      img = urls[7];
    }

    if(this.nodeLightCount >= 40) {
      this.nodeLightCount = 0;
    }

    return img;

  }

  _updatePosition(x, y) {
    let xDiff = Math.floor(this.x - this.newX);
    let yDiff = Math.floor(this.y - this.newY);

    if(xDiff === 0 /*&& yDiff <= 0*/) {
      this.shooting = false;
      this.lightning = true;
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

    const pace = 1;
    const xStep = moveXNeg ? -pace : pace;
    const yStep = moveYNeg ? -pace :pace;

    this.x += xStep;
    this.y += yStep;
  }
}

export default Node;
