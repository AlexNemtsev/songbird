class CustomPlayer {
  audio = new Audio();

  constructor() {
    this.audio.addEventListener('ended', () => {
      this.audio.currentTime = 0;
      this.audio.play();
    });
  }

  isPlay = false;

  setAudioSource(audioPath) {
    this.isPlay = false;

    this.audio.src = audioPath;
  }

  play() {
    this.audio.play();
    this.isPlay = true;
  }

  pause() {
    this.audio.pause();
    this.isPlay = false;
  }

  createCustomPlayer() {
    this.isPlay = false;

    const player = document.createElement('div');

    player.className = 'question__player';

    const playBtn = document.createElement('div');
    playBtn.className = 'question__play-btn';

    const volumeSlider = document.createElement('input');
    volumeSlider.setAttribute('type', 'range');
    volumeSlider.setAttribute('min', 0);
    volumeSlider.setAttribute('max', 1);
    volumeSlider.setAttribute('step', 0.01);
    volumeSlider.setAttribute('value', 1);
    volumeSlider.className = 'question__slider';

    const icon = document.createElement('div');
    icon.className = 'question__icon';

    playBtn.classList.remove('question__play-btn_on-play');
    playBtn.classList.add('question__play-btn_on-pause');

    playBtn.addEventListener('click', () => {
      if (this.isPlay) {
        playBtn.classList.remove('question__play-btn_on-play');
        playBtn.classList.add('question__play-btn_on-pause');
        this.pause();
      } else {
        playBtn.classList.remove('question__play-btn_on-pause');
        playBtn.classList.add('question__play-btn_on-play');
        this.play();
      }
    });

    volumeSlider.addEventListener('change', (event) => {
      this.audio.volume = event.target.value;
    });

    player.append(playBtn);
    player.append(volumeSlider);
    player.append(icon);

    return player;
  }
}

export default CustomPlayer;
