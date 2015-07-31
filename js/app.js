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
import BlastAreas from './blast-areas';
import Gas from './actors/gas';
import Node from './actors/node';
import GunArm from './actors/gun-arm';
import BlastAreaManager from './blast-area-manager';
import MDGManager from './mdg-manager';

(function() {
  const canvas = new Canvas();
  const ctx = canvas.ctx;
  const emitter = ee();
  const inputManager = new InputManager({ emitter: emitter });
  const audioPlayer = new AudioPlayer();

  const oasism = document.createElement('div');
  oasism.classList.add('oasism', 'centered');

  const instructions = document.createElement('div');
  instructions.classList.add('instructions');
  instructions.innerHTML = 'Welcome to the desert. Move your avatar by clicking on a point inside the frame. Click on the avatar to activate your tools.<br />Explore your surroundings. USF <em>OASISM</em> EP out now on <a href="https://usftheband.bandcamp.com/album/oasism" target="_BLANK">Ceremony.</a>';

  const title = document.createElement('h1');
  title.innerHTML = 'OASISM';

  const artist = document.createElement('h1');
  artist.classList.add('artist');
  artist.innerHTML = 'USF';

  const purchaseLink = document.createElement('div');
  purchaseLink.classList.add('purchase');
  purchaseLink.innerHTML = '<strong>USF <em>OASISM</em></strong><br /><span>AVAILABLE NOW</span><br /><a href="https://usftheband.bandcamp.com/album/oasism" target="_BLANK">PURCHASE</a>';
  document.body.appendChild(purchaseLink);

  const credits = document.createElement('div');
  credits.classList.add('credits');
  credits.innerHTML = '<span>design: </span><strong href="#" target="_BLANK">Dan Miller</strong> | <span>code: </span><a href="http://davidcasagrande.com" target="_BLANK">David Casagrande</a>';
  document.body.appendChild(credits);

  const logo = document.createElement('a');
  logo.classList.add('ceremony-logo');
  logo.href = 'http://ceremonyrecordings.com';
  logo.target = '_BLANK';
  logo.innerHTML = '<img src="./images/ceremony-logo.png" alt="Ceremony Records"/>';
  document.body.appendChild(logo);

  //oasism.appendChild(artist);

  canvas.render(oasism);

  // oasism.appendChild(title);
  oasism.appendChild(instructions);
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

  let node = new Node({ resources: resources, eventEmitter: emitter });
  let gunArm = new GunArm({ resources: resources, eventEmitter: emitter });
  let observer = new Observer({ resources: resources, eventEmitter: emitter, node: node, gunArm: gunArm });
  let fgCloud = new Cloud({ resources: resources, image: 'images/clouds-fg.png', step: 0.2 });
  let mdgCloud = new Cloud({ resources: resources, image: 'images/clouds-mdg.png', step: 0.4, y: -1 });
  let bgCloud = new Cloud({ resources: resources, image: 'images/clouds-bg.png', step: 0.6 });
  let fgLeaves = new FGLeaves({ resources: resources, eventEmitter: emitter });
  let fgBush = new FGBush({ resources: resources, eventEmitter: emitter });
  let mdgBush = new MDGBush({ resources: resources, eventEmitter: emitter });
  let mdgLeaves = new MDGLeaves({ resources: resources, eventEmitter: emitter });
  let mdgTree = new MDGTree({ resources: resources, eventEmitter: emitter });
  let gila = new Gila({ resources: resources, eventEmitter: emitter });
  let gas = new Gas({ resources: resources, eventEmitter: emitter });
  let blastAreaManager = new BlastAreaManager({ resources: resources, eventEmitter: emitter, gas: gas });
  let mdgManager = new MDGManager({ resources: resources });

  function init() {
    audioPlayer.render();
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

    mdgManager.render(ctx, tickCount);

    mdgBush.render(ctx, tickCount);
    mdgLeaves.render(ctx, tickCount);
    mdgTree.render(ctx, tickCount);

    fgLeaves.render(ctx, tickCount);

    blastAreaManager.render(ctx, tickCount);

    gas.render(ctx, tickCount);
    observer.render(ctx, tickCount);
    // gunArm.render(ctx, tickCount);

    fgBush.render(ctx, tickCount);
    ctx.drawImage(resources.get('images/fg.png'), startX - 1, startY - 1);
    gila.render(ctx, tickCount);

    node.render(ctx, tickCount);
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
