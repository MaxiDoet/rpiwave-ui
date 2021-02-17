class AudioPlayer {
    constructor(playerContainerId) {
      this.playerContainer = document.getElementById(playerContainerId);
      //this.audio = new Audio(src);
  
      anime({
        targets: "#" + playerContainerId,
        duration: 750,
        translateY: [-20, 0]
      });
  
      this.seekBarRange = this.playerContainer.getElementsByClassName(
        "audio-player-seekbar__range"
      )[0];
  
      this.seekBarTimeText = this.playerContainer.getElementsByClassName(
        "audio-player-seekbar__time"
      )[0];
  
      this.seekBarDurationText = this.playerContainer.getElementsByClassName(
        "audio-player-seekbar__end"
      )[0];
  
      this.playButton = this.playerContainer.getElementsByClassName(
        "audio-player-play"
      )[0];
  
      // Add button eventlisteners
      this.playButton.addEventListener(
        "click",
        this._playerOnPlayButtonClick.bind(this)
      );
    }
  
    setSource(src) {
      try {
        this.audio.pause();
      } catch {}
  
      this.audio = new Audio(src);
  
      // Add eventlisteners
      this.audio.addEventListener(
        "loadedmetadata",
        this._playerOnloadedmetadata.bind(this)
      );
  
      this.audio.addEventListener(
        "timeupdate",
        this._updateSeekBarTime.bind(this)
      );
  
      this.seekBarRange.addEventListener("input", this._updateTime.bind(this));
    }
    
    play() {
        this.audio.pause();

        if (this.playButton.classList.contains("play")) {
            this.playButton.classList.remove("play");
            this.playButton.classList.add("pause");
      
            // Play audio
            this.audio.play();
          } else {

        }
    }

    pause() {
      this.audio.pause();
      this.playButton.classList.remove("pause");
      this.playButton.classList.add("play");
    }
    _playerOnloadedmetadata(event) {
      this.seekBarRange.setAttribute("max", this.audio.duration);
  
      // Convert time
      var durationHour = parseInt(this.audio.duration / 3600) % 24;
      var durationMinute = parseInt(this.audio.duration / 60) % 60;
      var durationSecondsLong = this.audio.duration % 60;
      var durationSeconds = durationSecondsLong.toFixed();
      var durationTime =
        (durationMinute < 10 ? "0" + durationMinute : durationMinute) +
        ":" +
        (durationSeconds < 10 ? "0" + durationSeconds : durationSeconds);
  
      this.seekBarDurationText.textContent = durationTime;
      this.seekBarTimeText.textContent = "0:00:00";
    }
  
    _playerOnPlayButtonClick(event) {
      event.preventDefault();
  
      if (this.playButton.classList.contains("play")) {
        this.playButton.classList.remove("play");
        this.playButton.classList.add("pause");
  
        // Play audio
        this.audio.play();
      } else {
        this.playButton.classList.remove("pause");
        this.playButton.classList.add("play");
  
        // Pause audio
        this.audio.pause();
      }
    }
  
    _updateSeekBarTime(event) {
      this.seekBarRange.value = this.audio.currentTime;
  
      /* https://gist.github.com/lukewduncan/3e041e4b22a50855f9faaf01dec40137#file-audio-player-js */
  
      // Convert time
      var currentHour = parseInt(this.audio.currentTime / 3600) % 24;
      var currentMinute = parseInt(this.audio.currentTime / 60) % 60;
      var currentSecondsLong = this.audio.currentTime % 60;
      var currentSeconds = currentSecondsLong.toFixed();
      var currentTime =
        (currentMinute < 10 ? "0" + currentMinute : currentMinute) +
        ":" +
        (currentSeconds < 10 ? "0" + currentSeconds : currentSeconds);
  
      this.seekBarTimeText.textContent = currentTime;
  
      // This is also a loop for checking things
      if (this.audio.ended) {
        if (this.playButton.classList.contains("pause")) {
          this.playButton.classList.remove("pause");
          this.playButton.classList.add("play");
        }
      }
    }
  
    _updateTime(event) {
      this.audio.currentTime = this.seekBarRange.value;
    }
  
    _playerOnEnded(event) {}
  }
  