class FGLeaves {
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
    var total = 160;
    var pace = total/7;

    if(this.counter > 0 && this.counter < pace) {
      img = this.resources.get('images/fgbush_leaves_1.png');
    } else if(this.counter >= pace && this.counter < pace*2) {
      img = this.resources.get('images/fgbush_leaves_2.png');
    } else if(this.counter >= pace*2 && this.counter < pace*3) {
      img = this.resources.get('images/fgbush_leaves_3.png');
    } else if(this.counter >= pace*3 && this.counter < pace*4) {
      img = this.resources.get('images/fgbush_leaves_4.png');
    } else if(this.counter >= pace*4 && this.counter < pace*5) {
      img = this.resources.get('images/fgbush_leaves_5.png');
    } else if(this.counter >= pace*5 && this.counter < pace*6) {
      img = this.resources.get('images/fgbush_leaves_6.png');
    } else if(this.counter >= pace*6 && this.counter < pace*7) {
      img = this.resources.get('images/fgbush_leaves_7.png');
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
    eventEmitter.on('click', () => {
      this.active = true;
    });
  }
}

export default FGLeaves;
