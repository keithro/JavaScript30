const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      console.log(localMediaStream);
      video.src = window.URL.createObjectURL(localMediaStream); // converts media stream to something the player can understand
      video.play(); 
    })
    .catch(err => {
      console.error('Sorry but we need access to your webcam if you want to take part in the fun.', err);
    });
}

function paintToCanvas() {
   // set size of canvas to size of video stream
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  // Paint image to canvas
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height); // start top left to size of video
    
    // Take pixels
    let pixels = ctx.getImageData(0, 0, width, height); // rgba data representation of video
    
    // Adjust them (choose effect)
    // pixels = redEffect(pixels);
    // pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.1;
    pixels = greenScreen(pixels);
    
    // Add them back
    ctx.putImageData(pixels, 0, 0);

  }, 16); // every 16 milliseconds
}

function takePhoto() {
  // play sound
  snap.currentTime = 0; // resets audio(?)
  snap.play();

  // take the data from canvas
  const data = canvas.toDataURL('image/jpeg'); // text representation of image (console.log to see)

  // add photo to page
  const link = document.createElement('a'); // creating ancor link
  link.href = data; // set href
  link.setAttribute('download', 'handsome'); // set name of downloaded image
  link.textContent = 'Download Image'; // set text of link
  link.innerHTML = `<img src="${data}" alt="Handsome Man" />`; // create HTML img
  strip.insertBefore(link, strip.firstChild); // add to photo strip
}

function redEffect(pixels) {
  for(let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 150; // red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for(let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // red
    pixels.data[i + 100] = pixels.data[i + 1]; // green
    pixels.data[i - 150] = pixels.data[i + 2]; // blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  console.log(levels); // rgb levels from inputs

  for (i = 0; i < pixels.data.length; i = i + 4) {
    // get rgba valuse from array
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    // if between min and max range we remove color
    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
