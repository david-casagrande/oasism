import BlastAreas from './blast-areas';

const startX = 0;
const startY = -29;

class MDGManager {
  constructor(opts = {}) {
    this.resources = opts.resources;
  }

  render(ctx, tickCount) {
    // ctx.drawImage(this.resources.get('images/mdg_rocks.png'), 0, 0);

    ctx.drawImage(this.resources.get('images/mdgrocks_new_01.png'), 1, -29);
    ctx.drawImage(this.resources.get('images/mdgrocks_new_02.png'), 1, 138);
    ctx.drawImage(this.resources.get('images/mdgrocks_new_03.png'), 306, 138);
    ctx.drawImage(this.resources.get('images/mdgrocks_new_04.png'), 346, 138);
    // ctx.drawImage(this.resources.get('images/mdgrocks_new_05.png'), 0, 0);
    // ctx.drawImage(this.resources.get('images/rock_16.png'), 0, 0);
    // ctx.drawImage(this.resources.get('images/rock_17.png'), 0, 0);

    if(!BlastAreas[15].blasted) {
      ctx.drawImage(this.resources.get('images/rock_16.png'), -1, -29);
      ctx.drawImage(this.resources.get('images/1stwave_rock_16_01.png'), -1, -29);
    }

    if(!BlastAreas[16].blasted) {
      ctx.drawImage(this.resources.get('images/rock_17.png'), -1, -29);
      ctx.drawImage(this.resources.get('images/1stwave_rock_17_01.png'), -1, -29);
    }

    if(!BlastAreas[17].blasted) {
      ctx.drawImage(this.resources.get('images/rock_18.png'), -1, -29);
    }

    if(!BlastAreas[3].blasted) {
      ctx.drawImage(this.resources.get('images/rock_4.png'), -1, -29);
    }

    if(!BlastAreas[13].blasted) {
      ctx.drawImage(this.resources.get('images/1stwave_rock_14.png'), -1, -29);
    }

    if(!BlastAreas[9].blasted) {
      ctx.drawImage(this.resources.get('images/1stwave_rock_10.png'), -1, -29);
    }


    ctx.drawImage(this.resources.get('images/bones.png'), 1, -29);
    // ctx.drawImage(this.resources.get('images/skull.png'), startX, startY);


    ctx.save();
    ctx.globalAlpha = 0.4;
    // ctx.drawImage(this.resources.get('images/rocks-and-gila.png'), startX, startY);
    ctx.restore();
  }
}

export default MDGManager;
