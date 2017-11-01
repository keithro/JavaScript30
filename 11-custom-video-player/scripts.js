// Get elements

const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle'); //play button
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

// Define functions

function togglePlay () {
  // if (video.paused) { // 'paused' property on video. Do no confuse with the events in listeners below. There is no play property
  //   video.play();
  // } else {
  //   video.pause();
  // }
  /* shorter version */
  const method = video.paused ? 'play' : 'pause'; // 'paused' property on video. Do no confuse with the events in listeners below. There is no play property
  video[method]();
}

function updateButton () {
  const icon = this.paused ? '►' : '❚ ❚';
  toggle.textContent = icon;
}

function skip () {
  console.log(this.dataset);
  video.currentTime += parseFloat(this.dataset.skip); // currently a string, need number
}

function handleRangeUpdate () {
  // console.log(this.value);
  // console.log(this.name); // named the same as property so changing them is easy
  video[this.name] = this.value;
}

function handleProgress () {
  const percent = (video.currentTime / video.duration) * 100 // properties on video element
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub (e) {
  // console.log(e); // see offsetX value is how far over progress bar was clicked
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration; // progress is element we selected, offsetWidth is property which tells us the width
  video.currentTime = scrubTime;
}

// Add event listeners
video.addEventListener('click', togglePlay);
toggle.addEventListener('click', togglePlay);

video.addEventListener('play', updateButton); //test with video.play or video.pause
video.addEventListener('pause', updateButton);

video.addEventListener('timeupdate', handleProgress); // event from media element

skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
