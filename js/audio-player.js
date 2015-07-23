import SoundCloud from 'common-soundcloud';

const url = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/122749373%3Fsecret_token%3Ds-2mkWN&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=false';

function buildIframe() {
  const iframe = document.createElement('iframe');
  iframe.width = '70%'; //0;
  iframe.height = 450; //0;
  iframe.src = url;
  iframe.scrolling = 'no';
  iframe.frameBorder = 'no';
  iframe.id = 'usf-soundcloud';
  return iframe;
}

function soundcloudWrapper(id) {
  const sc = new SoundCloud(id);
  sc.on('ready', function() {
    sc.play();
  });
  return sc;
}

function soundControl(sc) {
  const soundControl = document.createElement('div');
  soundControl.classList.add('sound-control');

  const pause = document.createElement('div');
  pause.classList.add('icono-pause');

  const toggle = document.createElement('div');
  toggle.classList.add('icono-volumeHigh');

  pause.addEventListener('click', function() {
    sc.player.isPaused(function(paused) {

      let classList = pause.classList;

      if (paused) {
        sc.player.play();
        classList.add('icono-pause');
        classList.remove('icono-play');
      } else {
        sc.player.pause();
        classList.remove('icono-pause');
        classList.add('icono-play');
      }
    });
  });

  soundControl.addEventListener('click', function() {
    const modal = document.querySelector('.modal');
    if(modal.classList.contains('open')) {
      modal.classList.remove('open');
      toggle.classList.add('icono-volumeHigh');
      toggle.classList.remove('icono-cross');
    } else {
      modal.classList.add('open');
      toggle.classList.remove('icono-volumeHigh');
      toggle.classList.add('icono-cross');
    }
  });

  // soundControl.appendChild(pause);
  soundControl.appendChild(toggle);

  return soundControl;
}

class AudioPlayer {
  constructor(opts = {}) {
    this.iframe = buildIframe();
  }

  render() {
    const div = document.createElement('div');
    div.classList.add('modal');

    div.appendChild(this.iframe);
    document.body.appendChild(div);

    this.sc = soundcloudWrapper(this.iframe.id);
    let controls = soundControl(this.sc);
    document.body.appendChild(controls);
  }
}

export default AudioPlayer;
