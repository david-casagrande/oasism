class MDGLeaves {
  constructor(opts = {}) {
    this.x = opts.x || 0;
    this.y = opts.x || 0;
    this.resources = opts.resources;
    this.counter = 0;
    this.active = false;
    this._registerEvents(opts.eventEmitter);
  }

  update(ctx, tickCount) {
    if(!this.active) { return; }
    var img;
    this.counter += 1;
    var total = 60;

    if(this.counter > 0 && this.counter < 20) {
      img = this.resources.get('images/mdgleaves_1.png');
    } else if(this.counter >= 20 && this.counter < 40) {
      img = this.resources.get('images/mdgleaves_2.png');
    } else if(this.counter >= 40 && this.counter < 60) {
      img = this.resources.get('images/mdgleaves_3.png');
    } else {
      img = null;
    }

    if(this.counter === total) {
      this.counter = 0;
      this.active = false;
    }

    return [
      img,
      this.x,
      this.y
    ];
  }

  render(ctx, tickCount) {
    var updated = this.update(ctx, tickCount);
    if(updated && updated[0]) {
      ctx.drawImage(...updated);
    }
  }

  _registerEvents(eventEmitter) {
    eventEmitter.on('mdg-tree', () => {
      if(this.active) { return; }
      this.active = true;
    });
  }
}

export default MDGLeaves;
