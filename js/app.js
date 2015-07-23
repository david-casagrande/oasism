import rsvp from 'rsvp';
import raf from 'raf';
import ee from 'event-emitter';
import resources from './resources';

import Assets from './assets';
import AudioPlayer from './audio-player';
import Canvas from './canvas';
import Cloud from './actors/cloud';
import InputManager from './input';
import Observer from './actors/observer';
import Walls from './walls';
import FGLeaves from './actors/fg-leaves';
import FGBush from './actors/fg-bush';
import MDGBush from './actors/mdg-bush';
import MDGLeaves from './actors/mdg-leaves';
import MDGTree from './actors/mdg-tree';
import Gila from './actors/gila';

(function() {
  const canvas = new Canvas();
  const ctx = canvas.ctx;
  const emitter = ee();
  const inputManager = new InputManager({ emitter: emitter });
  const audioPlayer = new AudioPlayer();

  const oasism = document.createElement('div');
  oasism.classList.add('oasism', 'centered');

  const title = document.createElement('h1');
  title.innerHTML = 'OASISM';

  const artist = document.createElement('h1');
  artist.classList.add('artist');
  artist.innerHTML = 'USF';

  //oasism.appendChild(artist);

  canvas.render(oasism);
  // audioPlayer.render();

  // oasism.appendChild(title);
  document.body.appendChild(oasism);

  resources.load(Assets);
  resources.onReady(init);

  // The main game loop
  let lastTime;
  let startX = 0;
  let startY = 0;
  let tickCount = 0;
  let ticksPerFrame = ticksPerFrame || 0;
  let gilaX = startX;
  let gilaY = startY;

  let observer = new Observer({ resources: resources, eventEmitter: emitter });
  let fgCloud = new Cloud({ resources: resources, image: 'images/clouds-fg.png', step: 0.2 });
  let mdgCloud = new Cloud({ resources: resources, image: 'images/clouds-mdg.png', step: 0.4, y: -1 });
  let bgCloud = new Cloud({ resources: resources, image: 'images/clouds-bg.png', step: 0.6 });
  let fgLeaves = new FGLeaves({ resources: resources, eventEmitter: emitter });
  let fgBush = new FGBush({ resources: resources, eventEmitter: emitter });
  let mdgBush = new MDGBush({ resources: resources, eventEmitter: emitter });
  let mdgLeaves = new MDGLeaves({ resources: resources, eventEmitter: emitter });
  let mdgTree = new MDGTree({ resources: resources, eventEmitter: emitter });
  let gila = new Gila({ resources: resources, eventEmitter: emitter });

  function init() {
    lastTime = Date.now();
    main();
  };

  function main() {
    let now = Date.now();
    let dt = (now - lastTime) / 1000.0;

    tickCount += 1;
    inputManager.handleInput();

    ctx.drawImage(resources.get('images/sky.png'), startX, startY);

    bgCloud.render(ctx);
    mdgCloud.render(ctx);

    ctx.drawImage(resources.get('images/mdg.png'), startX, startY);
    ctx.drawImage(resources.get('images/bg-trees.png'), startX, startY);

    fgCloud.render(ctx);

    ctx.drawImage(resources.get('images/rocks-and-gila.png'), startX, startY);
    mdgBush.render(ctx, tickCount);
    mdgLeaves.render(ctx, tickCount);
    mdgTree.render(ctx, tickCount);

    fgLeaves.render(ctx, tickCount);
    observer.render(ctx, tickCount);

    fgBush.render(ctx, tickCount);
    ctx.drawImage(resources.get('images/fg.png'), startX, startY);
    gila.render(ctx, tickCount);

    // Walls.forEach(function(rect) {
    //   ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    //   ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    // });

    if(tickCount >= 60) {
      tickCount = 0;
    }

    lastTime = now;
    raf(main);
  };

})();
