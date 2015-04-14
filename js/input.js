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

function isDown(key) {
  return pressedKeys[key.toUpperCase()];
}

class InputManager {
  constructor(opts = {}) {
    this.emitter = opts.emitter;
    this._setupListeners();
  }

  _setupListeners() {
    document.addEventListener('keydown', function(e) {
      setKey(e, true);
    });

    document.addEventListener('keyup', function(e) {
      setKey(e, false);
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
