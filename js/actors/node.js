import BlastAreas from '../blast-areas';

const urls = [
  'images/node_shooting.png'
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
  }

  shoot(x, y, originX, originY) {
    if(this.shooting) { return; }

    this.newX = x;
    this.newY = y;
    this.x = originX;
    this.y = originY;
    this.shooting = true;
    this._updatePosition(x, y);
    // BlastAreas.forEach((area) => {
    //   if(x > area.x && x < area.x + area.width && y > area.y && y < area.y + area.height) {
    //     area.blasted = true;
    //   }
    // });
  }

  render(ctx, tickCount) {
    if(!this.shooting) { return; }

    this._updatePosition();
    ctx.drawImage(...this.nodeArgs);
  }

  get nodeArgs() {
    return [
      this.resources.get(urls[0]),
      this.x,
      this.y,
      25,
      23
    ];
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
