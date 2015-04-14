import rsvp from 'rsvp';
import raf from 'raf';
import resources from './resources';
import SoundCloud from 'common-soundcloud';
import ee from 'event-emitter';
import Observer from './actors/observer';
import Cloud from './actors/cloud';
import Rectanlge from './actors/rectangle';
import Canvas from './canvas';
import Walls from './walls';
import InputManager from './input';

(function() {
  const canvas = new Canvas();
  const ctx = canvas.ctx;
  const emitter = ee();
  const inputManager = new InputManager({ emitter: emitter });

  canvas.render();

  resources.load([
    'images/mdg.png',
    'images/sky.png',
    'images/fg.png',
    'images/fg-bush.png',
    'images/rocks-and-gila.png',
    'images/mdg-tree.png',
    'images/mdg-bush.png',
    'images/bg-trees.png',
    'images/gila-look-right.png',
    'images/walk-1.png',
    'images/walk-2.png',
    'images/walk-3.png',
    'images/walk-4.png',
    'images/case.png',
    'images/clouds-fg.png',
    'images/clouds-mdg.png',
    'images/clouds-bg.png'
  ]);
  resources.onReady(init);

  // The main game loop
  let lastTime;
  let startX = -1;
  let startY = -1;
  let tickCount = 0;
  let ticksPerFrame = ticksPerFrame || 0;
  let gilaX = startX;
  let gilaY = startY;

  let observer = new Observer({ resources: resources, eventEmitter: emitter });
  let fgCloud = new Cloud({ resources: resources, image: 'images/clouds-fg.png', step: 0.2 });
  let mdgCloud = new Cloud({ resources: resources, image: 'images/clouds-mdg.png', step: 0.4, y: -1 });
  let bgCloud = new Cloud({ resources: resources, image: 'images/clouds-bg.png', step: 0.6 });
  let scPlayer;

  function init() {
    lastTime = Date.now();
    main();

    scPlayer = new SoundCloud('usf-soundcloud');
    scPlayer.on('ready', function() {
      scPlayer.play();
    });

    const soundControl = document.querySelector('.sound-control');
    const icon = soundControl.querySelector('div');

    soundControl.addEventListener('click', function() {
      scPlayer.player.isPaused(function(paused) {

        let classList = icon.classList;

        if (paused) {
          scPlayer.play();
          classList.add('icono-pause');
          classList.remove('icono-play');
        } else {
          scPlayer.pause();
          classList.remove('icono-pause');
          classList.add('icono-play');
        }

      });
    })
  };

  function main() {
    let now = Date.now();
    let dt = (now - lastTime) / 1000.0;

    tickCount += 1;

    inputManager.handleInput();
    //handleInput();

    ctx.drawImage(resources.get('images/sky.png'), startX, startY);

    bgCloud.render(ctx);
    mdgCloud.render(ctx);

    ctx.drawImage(resources.get('images/mdg.png'), startX, startY);
    ctx.drawImage(resources.get('images/bg-trees.png'), startX, startY);

    fgCloud.render(ctx);

    ctx.drawImage(resources.get('images/mdg-bush.png'), startX, startY);
    ctx.drawImage(resources.get('images/rocks-and-gila.png'), startX, startY);
    ctx.drawImage(resources.get('images/mdg-tree.png'), startX, startY);

    observer.render(ctx, tickCount);

    ctx.drawImage(resources.get('images/fg-bush.png'), startX, startY);
    ctx.drawImage(resources.get('images/fg.png'), startX, startY);
    ctx.drawImage(resources.get('images/gila-look-right.png'), gilaX, gilaY);
    // ctx.drawImage(resources.get('images/case.png'), startX, startY);

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
