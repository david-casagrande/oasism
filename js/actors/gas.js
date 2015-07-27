const urls = [
  'images/gas_1.png',
  'images/gas_2.png',
  'images/gas_3.png',
  'images/gas_4.png',
  'images/gas_5.png',
  'images/gas_6.png'
];

class Gas {
  constructor(opts = {}) {
    this.resources = opts.resources;
    this.x = opts.x || 0;
    this.y = opts.y || -30;
    this.counter = 0;
    this.visible = false;
  }

  update(ctx, tickCount) {
    var img = null;

    var pace = this.counter += 0.75;

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

    if(this.counter > 70) {
      this.counter = 0;
    }

    return [
      img,
      this.x,
      this.y
    ];
  }

  render(ctx, tickCount) {
    if(!this.visible) { return; }
    var updated = this.update(ctx, tickCount);

    if(updated[0] === null) { return; }
    ctx.drawImage(...updated);
  }
}

export default Gas;
