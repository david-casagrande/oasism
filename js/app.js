import rsvp from 'rsvp';
import raf from 'raf';
import resources from './resources';
import input from './input';

(function() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 600;
  canvas.height = 300;

  document.body.appendChild(canvas);

  resources.load([
    'images/mdg.png',
    'images/sky.png',
    'images/fg.png',
    'images/fg-bush.png',
    'images/rocks-and-gila.png',
    'images/mdg-tree.png',
    'images/mdg-bush.png',
    'images/bg-trees.png',
    'images/gila-look-right.png'
  ]);
  resources.onReady(init);

  // The main game loop
  var lastTime;
  var startX = -1;
  var startY = -1;
  var tickCount = 0;
  var ticksPerFrame = ticksPerFrame || 0;
  var gilaX = startX;
  var gilaY = startY;

  function main() {
      var now = Date.now();
      var dt = (now - lastTime) / 1000.0;

      ctx.drawImage(resources.get('images/sky.png'), startX, startY);
      ctx.drawImage(resources.get('images/mdg.png'), startX, startY);
      ctx.drawImage(resources.get('images/mdg-bush.png'), startX, startY);
      ctx.drawImage(resources.get('images/bg-trees.png'), startX, startY);
      ctx.drawImage(resources.get('images/rocks-and-gila.png'), startX, startY);
      ctx.drawImage(resources.get('images/mdg-tree.png'), startX, startY);
      ctx.drawImage(resources.get('images/fg-bush.png'), startX, startY);
      ctx.drawImage(resources.get('images/fg.png'), startX, startY);

      handleInput();

      lastTime = now;
      raf(main);
  };

  function init() {
      // reset();
      lastTime = Date.now();
      main();
  };



  function handleInput(dt) {
    if(input.isDown('DOWN')) {
      ctx.drawImage(resources.get('images/gila-look-right.png'), gilaX, gilaY += 0.5);
    }

    if(input.isDown('UP')) {
      ctx.drawImage(resources.get('images/gila-look-right.png'), gilaX, gilaY -= 0.5);
    }

    if(input.isDown('LEFT')) {
      ctx.drawImage(resources.get('images/gila-look-right.png'), gilaX -= 0.5, gilaY);
    }

    if(input.isDown('RIGHT')) {
      ctx.drawImage(resources.get('images/gila-look-right.png'), gilaX += 0.5, gilaY);
    }

    if(!input.isDown('DOWN') && !input.isDown('UP') && !input.isDown('LEFT') && !input.isDown('RIGHT')) {
      ctx.drawImage(resources.get('images/gila-look-right.png'), gilaX, gilaY);
    }

    if(input.isDown('SPACE')) {
      console.log('space');
    }
}


})();
