let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endDisplay = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');


function timer(seconds) {
  // Clear any existing timers
  clearInterval(countdown);

  const now = Date.now();
  const then = now + seconds * 1000; // seconds will be in milliseconds
  displayTimeLeft(seconds); // displays time at beginning, updated later in function
  displayEndTime(then);
  
  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000); // in milliseconds
    // check if we should stop it
    if(secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }
    // display it
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) { // function to run immediately and again after each second above
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${mins}:${secs < 10 ? '0' : ''}${secs}`; // using twice so put in variable

  document.title = display; // update the tab title displayed in the browser
  timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp); // create date object
  const hour = end.getHours();
  const minutes = end.getMinutes();
  endDisplay.textContent = `Be Back At ${hour > 12 ? hour - 12 : hour}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function startTimer() {
  // console.log(this.dataset); // see all data attributes
  const seconds = parseInt(this.dataset.time);
  timer(seconds); // call our function above with the seconds passed in
}

buttons.forEach(button => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const mins = this.minutes.value; // selecting the minutes input in our form ('this')
  console.log(mins);
  timer(mins * 60);
  this.reset(); // clears input field
})