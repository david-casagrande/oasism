import { checkCollisions } from '../utils/collision';
import Rectangle from './rectangle';
import Walls from '../walls';

const urls = [
  'images/gila_entrance_1.png',
  'images/gila_entrance_2.png',
  'images/gila_entrance_3.png',
  'images/gila_entrance_4.png',
  'images/gila_entrance_5.png',
  'images/gila_exit_1.png',
  'images/gila_exit_2.png',
  'images/gila_exit_3.png',
  'images/gila_exit_4.png',
  'images/gila_lookaround_1.png',
  'images/gila_lookaround_2.png',
  'images/gila_lookaround_3.png',
  'images/gila_lookright.png'
];

class Observer {
  constructor(opts = {}) {
    this.resources = opts.resources;
    this.x = opts.x || 0;
    this.y = opts.y || 0;
    this.counter = 0;
    this.visible = false;
    this.totalTimer = 0;
  }

  update(ctx, tickCount) {
    this.totalTimer += 1;

    if(this.totalTimer % 1200 === 0) {
      this.visible = true;
    }

    if(!this.visible) {
      return [
        this.resources.get('images/gila_entrance_1.png'),
        this.x,
        this.y
      ];
    }

    var img = null;

    var pace = this.counter += 1;

    if(pace > 0 && pace < 10) {
      img = this.resources.get('images/gila_entrance_1.png');
    } else if(pace >= 10 && pace < 20) {
      img = this.resources.get('images/gila_entrance_2.png');
    } else if(pace >= 20 && pace < 30) {
      img = this.resources.get('images/gila_entrance_3.png');
    } else if(pace >= 30 && pace < 40) {
      img = this.resources.get('images/gila_entrance_4.png');
    } else if (pace >= 40 && pace < 50) {
      img = this.resources.get('images/gila_entrance_5.png');
    } else if(pace >= 50 && pace < 90) {
      img = this.resources.get('images/gila_lookaround_1.png');
    } else if(pace >= 90 && pace < 120) {
      img = this.resources.get('images/gila_lookright.png');
    } else if(pace >= 120 && pace < 150) {
      img = this.resources.get('images/gila_lookaround_1.png');
    } else if(pace >= 150 && pace < 180) {
      img = this.resources.get('images/gila_lookaround_2.png');
    } else if(pace >= 180 && pace < 210) {
      img = this.resources.get('images/gila_lookaround_3.png');
    } else if(pace >= 210 && pace < 220) {
      img = this.resources.get('images/gila_exit_1.png');
    } else if(pace >= 220 && pace < 230) {
      img = this.resources.get('images/gila_exit_2.png');
    } else if(pace >= 230 && pace < 240) {
      img = this.resources.get('images/gila_exit_3.png');
    } else {
      img = this.resources.get('images/gila_exit_4.png');
    }

    if(this.counter >= 250) {
      this.visible = false;
      this.counter = 0;
    }

    return [
      img,
      this.x,
      this.y
    ];
  }

  render(ctx, tickCount) {
    var updated = this.update(ctx, tickCount);
    ctx.drawImage(...updated);
  }
}

export default Observer;
