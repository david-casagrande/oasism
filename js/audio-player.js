import SoundCloud from 'common-soundcloud';

const url = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/40436547&amp;&amp;hide_related=false&amp;show_comments=false&amp;show_user=false&amp;show_reposts=false&amp;visual=false';

function buildIframe() {
  const iframe = document.createElement('iframe');
  iframe.width = 0;
  iframe.height = 0;
  iframe.src = url;
  iframe.scrolling = 'no';
  iframe.frameborder = 'no';
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
  toggle.classList.add('icono-smile');

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

  soundControl.appendChild(pause);
  //soundControl.appendChild(toggle);

  return soundControl;
}

class AudioPlayer {
  constructor(opts = {}) {
    this.iframe = buildIframe();
  }

  render() {
    document.body.appendChild(this.iframe);
    this.sc = soundcloudWrapper(this.iframe.id);
    let controls = soundControl(this.sc);
    document.body.appendChild(controls);
  }
}

export default AudioPlayer;
