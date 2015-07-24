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
    //render modal for iframe
    const modal = document.createElement('div');
    modal.classList.add('modal');

    modal.appendChild(this.iframe);
    document.body.appendChild(modal);

    //atached sound cloud wrapper
    this.sc = soundcloudWrapper(this.iframe.id);

    //render controls for showing/hiding modal
    const controls = soundControl(this.sc);
    document.body.appendChild(controls);

    //display current track
    const currentTrack = document.createElement('div');
    const currentTrackTitle = document.createElement('div');
    const currentTrackTime = document.createElement('div');
    currentTrack.classList.add('current-track');
    currentTrackTitle.classList.add('title');
    currentTrackTime.classList.add('time');
    currentTrack.appendChild(currentTrackTitle);
    currentTrack.appendChild(currentTrackTime);
    document.body.appendChild(currentTrack);

    //add event handled to display track changes
    this.sc.on('play', () => {
      this.sc.player.getCurrentSound(function(sound) {
        currentTrackTitle.innerHTML = sound.title;
      });
    });

    this.sc.on('playProgress', (e) => {
      const date = new Date(e.currentPosition);
      const minutes = date.getUTCMinutes();
      let seconds = date.getUTCSeconds();

      if(seconds < 10) {
        seconds = '0' + seconds;
      }

      const newTime = `  ${minutes}:${seconds}`;
      //DOMs the bottleneck right?!
      if(currentTrackTime.innerHTML === newTime) { return; }
      currentTrackTime.innerHTML = newTime;
    });
  }
}

export default AudioPlayer;
