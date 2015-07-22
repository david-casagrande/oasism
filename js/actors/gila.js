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
    this.eventEmitter = opts.eventEmitter;
    this.x = opts.x || 0;
    this.y = opts.y || 0;
    this.counter = 0;
  }

  update(ctx, tickCount) {
    var img = null;

    var pace = this.counter += 1;

    if(pace > 0 && pace < 11) {
      img = this.resources.get('images/gila_entrance_1.png');
    } else if(pace >= 11 && pace < 22) {
      img = this.resources.get('images/gila_entrance_2.png');
    } else if(pace >= 22 && pace < 33) {
      img = this.resources.get('images/gila_entrance_3.png');
    } else if(pace >= 33 && pace < 44) {
      img = this.resources.get('images/gila_entrance_4.png');
    } else if (pace >= 44 && pace < 55) {
      img = this.resources.get('images/gila_entrance_5.png');
    } else if(pace >= 55 && pace < 66) {
      img = this.resources.get('images/gila_lookright.png');
    } else if(pace >= 66 && pace < 77) {
      img = this.resources.get('images/gila_lookaround_1.png');
    } else if(pace >= 77 && pace < 88) {
      img = this.resources.get('images/gila_lookaround_2.png');
    } else if(pace >= 88 && pace < 99) {
      img = this.resources.get('images/gila_lookaround_3.png');
    } else if(pace >= 99 && pace < 110) {
      img = this.resources.get('images/gila_exit_1.png');
    } else if(pace >= 110 && pace < 121) {
      img = this.resources.get('images/gila_exit_2.png');
    } else if(pace >= 121 && pace < 132) {
      img = this.resources.get('images/gila_exit_3.png');
    } else {
      img = this.resources.get('images/gila_exit_4.png');
    }



    if(this.counter >= 130) {
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
