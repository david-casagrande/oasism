import SoundCloud from 'common-soundcloud';

const url = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/129981973%3Fsecret_token%3Ds-HqXau&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=false';

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

function pauseControl(sc) {
  const pause = document.createElement('div');
  const pauseButton = document.createElement('div');
  pause.classList.add('play-pause');
  pauseButton.classList.add('icono-pause');

  //add pause button
  pause.addEventListener('click', function() {
    sc.player.isPaused(function(paused) {
      if (paused) {
        sc.player.play();
      } else {
        sc.player.pause();
      }
    });
  });

  //bind pause class button to pause/play
  let classList = pauseButton.classList;
  sc.on('pause', () => {
    classList.remove('icono-pause');
    classList.add('icono-play');
  });

  sc.on('play', () => {
    classList.add('icono-pause');
    classList.remove('icono-play');
  });

  pause.appendChild(pauseButton);
  document.body.appendChild(pause);

  return pause;
}

function soundControl(sc) {
  const soundControl = document.createElement('div');
  soundControl.classList.add('sound-control');

  const toggle = document.createElement('div');
  toggle.classList.add('icono-volumeHigh');

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

  soundControl.appendChild(toggle);
  document.body.appendChild(soundControl);

  return soundControl;
}

function currentTrack() {
  const currentTrack = document.createElement('div');
  const currentTrackTitle = document.createElement('div');
  const currentTrackTime = document.createElement('div');
  currentTrack.classList.add('current-track');
  currentTrackTitle.classList.add('title');
  currentTrackTime.classList.add('time');
  currentTrack.appendChild(currentTrackTitle);
  currentTrack.appendChild(currentTrackTime);
  document.body.appendChild(currentTrack);

  return { title: currentTrackTitle, time: currentTrackTime };
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
    soundControl(this.sc);

    //render pause/play control
    pauseControl(this.sc);

    //display current track
    const track = currentTrack();

    //add event handled to display track changes
    this.sc.on('play', () => {
      this.sc.player.getCurrentSound(function(sound) {
        track.title.innerHTML = sound.title;
      });
    });

    this.sc.on('end', (e) => {
      this.sc.player.isPaused((paused) => {
        if(!paused) { return; }
        this.sc.skip(0);
      });

      // this.sc.player.getDuration((duration) => {
      //   console.log(e.currentPosition, duration)
      //   if(e.currentPosition < duration) { return; }
      //   console.log('repeat');
      //   // this.sc.skip(0);
      // });
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
      if(track.time.innerHTML === newTime) { return; }
      track.time.innerHTML = newTime;
    });
  }
}

export default AudioPlayer;
