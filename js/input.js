let pressedKeys = {};

function setKey(event, status) {
  const code = event.keyCode;
  let key;

  switch(code) {
  case 32:
    key = 'SPACE'; break;
  case 37:
    key = 'LEFT'; break;
  case 38:
    key = 'UP'; break;
  case 39:
    key = 'RIGHT'; break;
  case 40:
    key = 'DOWN'; break;
  default:
      // Convert ASCII codes to letters
    key = String.fromCharCode(code);
  }

  pressedKeys[key] = status;
}

function targetOffsets(e) {
  const target = e.target || e.srcElement;
  const rect = target.getBoundingClientRect();
  return {
    offsetX: e.clientX - rect.left,
    offsetY: e.clientY - rect.top
  };
}

function isDown(key) {
  return pressedKeys[key.toUpperCase()];
}

class InputManager {
  constructor(opts = {}) {
    this.emitter = opts.emitter;
    this._setupListeners();
  }

  _setupListeners() {
    const emitter = this.emitter;

    document.addEventListener('keydown', function(e) {
      setKey(e, true);
    });

    document.addEventListener('keyup', function(e) {
      setKey(e, false);
    });

    document.addEventListener('click', function(e) {
      if(e.target.tagName.toLowerCase() !== 'canvas') { return; }
      const target = targetOffsets(e);
      emitter.emit('click', target.offsetX, target.offsetY);
    });

    document.addEventListener('mousemove', function(e) {
      if(e.target.tagName.toLowerCase() !== 'canvas') { return; }
      const target = targetOffsets(e);
      emitter.emit('mousemove', target.offsetX, target.offsetY);
    });

    window.addEventListener('blur', function() {
      pressedKeys = {};
    });
  }

  handleInput() {
    const emitter = this.emitter;

    if(isDown('DOWN')) {
      emitter.emit('down');
    }

    if(isDown('UP')) {
      emitter.emit('up');
    }

    if(isDown('LEFT')) {
      emitter.emit('left');
    }

    if(isDown('RIGHT')) {
      emitter.emit('right');
    }

    if(!isDown('DOWN') && !isDown('UP') && !isDown('LEFT') && !isDown('RIGHT')) {
      emitter.emit('none');
    }

    if(isDown('SPACE')) {
      console.log('space');
    }
  }

}

export default InputManager;
