class MDGBush {
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
        this.resources.get('images/mdgbush.png'),
        this.x,
        this.y
      ];
    }

    var img;
    var pace = this.counter += 1;
    this.totalCounter += 1;

    if(pace > 0 && pace < 13) {
      img = this.resources.get('images/mdgbush_2.png');
    } else if(pace >= 13 && pace < 26) {
      img = this.resources.get('images/mdgbush.png');
    } else if(pace >= 26 && pace < 39) {
      img = this.resources.get('images/mdgbush_2.png');
    } else if(pace >= 39 && pace < 52) {
      img = this.resources.get('images/mdgbush.png');
    } else {
      img = this.resources.get('images/mdgbush.png');
    }

    if(this.totalCounter > 52) {
      // this.eventEmitter.emit('fg-leaves-shake');
    }

    if(this.counter >= 52) {
      this.counter = 0;
    }

    if(this.totalCounter === 104) {
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
    eventEmitter.on('mdg-bush', () => {
      if(this.active) { return; }
      this.active = true;
    });
  }
}

export default MDGBush;
