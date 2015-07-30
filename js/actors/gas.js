const urls = [
  'images/gas_1.png',
  'images/gas_2.png',
  'images/gas_3.png',
  'images/gas_4.png',
  'images/gas_5.png',
  'images/gas_6.png',
  'images/gas_2_1.png',
  'images/gas_2_2.png',
  'images/gas_2_3.png',
  'images/gas_2_4.png',
  'images/gas_2_5.png'
];

class Gas {
  constructor(opts = {}) {
    this.resources = opts.resources;
    this.x = opts.x || 0;
    this.y = opts.y || -30;
    this.counter = 0;
    this.visible = false;
  }

  render(ctx, tickCount) {
    if(!this.visible) { return; }
    this.counter += 1;

    this._drawGas1(ctx);
    this._drawGas2(ctx);

    if(this.counter > 120) {
      this.counter = 0;
    }
  }

  _drawGas1(ctx) {
    const gasArgs = this.gas1Args;
    if(gasArgs[0] === null) { return; }
    ctx.drawImage(...gasArgs);
  }

  _drawGas2(ctx) {
    const gasArgs = this.gas2Args;
    if(gasArgs[0] === null) { return; }
    ctx.drawImage(...gasArgs);
  }

  _gas1Image() {
    var img = null;

    var pace = this.counter;

    if(pace > 0 && pace < 10) {
      img = null;
    } else if(pace >= 10 && pace < 20) {
      img = this.resources.get(urls[0]);
    } else if(pace >= 20 && pace < 30) {
      img = this.resources.get(urls[1]);
    } else if(pace >= 30 && pace < 40) {
      img = this.resources.get(urls[2]);
    } else if(pace >= 40 && pace < 50) {
      img = this.resources.get(urls[3]);
    } else if(pace >= 50 && pace < 60) {
      img = this.resources.get(urls[4]);
    } else if(pace >= 60 && pace < 70) {
      img = this.resources.get(urls[5]);
    }

    return img;
  }

  get gas1Args() {
    return [
      this._gas1Image(),
      this.x,
      this.y
    ];
  }

  _gas2Image() {
    var img = null;

    var pace = this.counter;

    if(pace > 0 && pace < 60) {
      img = null;
    } else if(pace >= 60 && pace < 70) {
      img = this.resources.get(urls[6]);
    } else if(pace >= 70 && pace < 80) {
      img = this.resources.get(urls[7]);
    } else if(pace >= 80 && pace < 90) {
      img = this.resources.get(urls[8]);
    } else if(pace >= 90 && pace < 100) {
      img = this.resources.get(urls[9]);
    } else if(pace >= 110 && pace < 120) {
      img = this.resources.get(urls[10]);
    }

    return img;
  }

  get gas2Args() {
    return [
      this._gas2Image(),
      this.x,
      this.y + 1
    ];
  }
}

export default Gas;
