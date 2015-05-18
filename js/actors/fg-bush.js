class FGBush {
  constructor(opts = {}) {
    this.x = opts.x || 0;
    this.y = opts.x || 0;
    this.resources = opts.resources;
    this.counter = 0;
    this.totalCounter = 0;
    this.eventEmitter = opts.eventEmitter;
    this.active = false;
    this._registerEvents(opts.eventEmitter);

  }

  update(ctx, tickCount) {
    if(!this.active) {
      return [
        this.resources.get('images/fgbush.png'),
        this.x,
        this.y
      ];
    }

    var img;
    var pace = this.counter += 1;
    this.totalCounter += 1;

    if(pace > 0 && pace < 15) {
      img = this.resources.get('images/fgbush.png');
    } else if(pace >= 15 && pace < 30) {
      img = this.resources.get('images/fgbush_2.png');
    } else if(pace >= 30 && pace < 45) {
      img = this.resources.get('images/fgbush.png');
    } else if(pace >= 45 && pace < 60) {
      img = this.resources.get('images/fgbush_2.png');
    } else {
      img = this.resources.get('images/fgbush.png');
    }

    if(this.counter === 60) {
      this.counter = 0;
    }

    if(this.totalCounter === 180) {
      this.counter = 0;
      this.totalCounter = 0;
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

export default FGBush;
