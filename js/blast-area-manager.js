import BlastAreas from './blast-areas';

const startX = 0;
const startY = -29;

class BlastAreaManager {
  constructor(opts = {}) {
    this.resources = opts.resources;
    this.eventEmitter = opts.eventEmitter;
    this.gas = opts.gas;
    this._registerEvents(opts.eventEmitter);
  }

  render(ctx, tickCount) {
    BlastAreas.forEach((rect, idx) => {
      this._renderBlastArea(rect, ctx, idx);

      // if(idx === 17 && rect.blasted) {
        //need to emit this as an event to the gas pod
        // gas.visible = true;
      // }

      // ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      // ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    });
  }

  _registerEvents(eventEmitter) {

  }

  _renderBlastArea(rock, ctx, idx) {
    // const img = rect.falling ? rect.imgOl : rect.img;
    // ctx.drawImage(this.resources.get(img), startX, startY);

    //draw the rockOL
    this._drawRockOL(rock, ctx);

    //draw the rock
    // this._drawRock(rock, ctx);

    //check for gas rendering
    this._drawGas(rock, idx);
  }

  _drawRock(rock, ctx) {
    // if(rock.falling) {
    //   rock.fallingY += 5;
    //
    //   if(rock.fallingY >= rock.fallingYStop) {
    //     rock.falling = false;
    //   }
    // }
    //
    // ctx.drawImage(this.resources.get(rock.img), startX, rock.fallingY);
    if(rock.blasted || rock.falling) { return; }
    ctx.drawImage(this.resources.get(rock.img), startX, rock.fallingY);
  }

  _drawRockOL(rock, ctx) {
    //if rock has been blasted or is falling draw it
    if(!rock.blasted && !rock.falling) { return; }
    ctx.drawImage(this.resources.get(rock.imgOl), startX, startY);
  }

  _drawGas(rock, idx) {
    if(idx === 17 && rock.blasted) {
      // need to emit this as an event to the gas pod
      this.gas.visible = true;
    }
  }
}

export default BlastAreaManager;
