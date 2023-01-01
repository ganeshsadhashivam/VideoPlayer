const container = document.querySelector(".container"),
  mainVideo = container.querySelector("video"),
  videoTimeline = container.querySelector(".video-timeline"),
  progressBar = container.querySelector(".progress-bar"),
  volumeBtn = container.querySelector(".volume i"),
  volumeSlider = container.querySelector(".left input"),
  currentVidTime = container.querySelector(".current-time"),
  videoDuration = container.querySelector(".video-duration"),
  skipBackward = container.querySelector(".skip-backward i"),
  skipForward = container.querySelector(".skip-forward i"),
  playPauseBtn = container.querySelector(".play-pause i"),
  speedBtn = container.querySelector(".playback-speed span"),
  speedOptions = container.querySelector(".speed-options"),
  picInPicBtn = container.querySelector(".pic-in-pic span"),
  fullScreenBtn = container.querySelector(".fullscreen i");
let timer;

//hide controls

const hideControls = () => {
  //if video is paused return
  if (mainVideo.paused) return;
  // remove show-controls class after 3
  timer = setTimeout(() => {
    container.classList.remove("show-controls");
  }, 3000);
};

hideControls();

container.addEventListener("mousemove", () => {
  // add show-controls class on mousemove
  container.classList.add("show-controls");
  //clear timer
  clearTimeout(timer);
  //calling hidecontrols
  hideControls();
});

const formatTime = (time) => {
  // getting seconds, minutes, hours

  let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

  // adding 0 at the beginning if the particular value is less than 1el
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  hours = hours < 10 ? `0${hours}` : hours;

  if (hours == 0) {
    // if hours is 0 return mirutes & seconds only else return all

    return `${minutes}:${seconds}`;
  }
  return `${hours}:${minutes}:${seconds}`;
};

mainVideo.addEventListener("timeupdate", (e) => {
  // getting currentTime & duration of the video
  let { currentTime, duration } = e.target;
  //getting percent
  let percent = (currentTime / duration) * 100;
  //passing percent as progressbar width
  progressBar.style.width = `${percent}%`;
  currentVidTime.innerText = formatTime(currentTime);
  console.log(currentTime, duration);
});

mainVideo.addEventListener("loadeddata", (e) => {
  // passing video duration as videoDuration innertext

  videoDuration.innerText = formatTime(e.target.duration);
});

//video based on slider

videoTimeline.addEventListener("click", (e) => {
  // getting videoTimeline width
  let timelineWidth = videoTimeline.clientWidth;
  //updating video currentTime
  mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
});

//draggable progress bar

const draggableProgressBar = () => {
  // getting videoTimeline width
  let timelineWidth = videoTimeline.clientWidth;
  // passing offsetX value as progressbar width
  progressBar.style.width = `${e.offsetX}px`;
  //updating video currentTime
  mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
  // passing video current time as currentVidTime innertext

  currentVidTime.innerText = formatTime(mainVideo.currentTime);
};

videoTimeline.addEventListener("mousedown", () => {
  // calling draggableProgress function on mousemove event
  videoTimeline.addEventListener("mousemove", draggableProgressBar);
});

document.addEventListener("mouseup", () => {
  // removing mousemove listener on mouseup event
  videoTimeline.removeEventListener("mousemove", draggableProgressBar);
});

//updating progress bar based on slide

videoTimeline.addEventListener("mousemove", (e) => {
  const progressTime = videoTimeline.querySelector("span");
  // getting mouseX position
  let offsetX = e.offsetX;
  //passing offsetX value as progressTime left value
  progressTime.style.left = `${offsetX}px`;
  // getting videoTimeline width
  let timelineWidth = videoTimeline.clientWidth;
  //getting percent
  let percent = (e.offsetX / timelineWidth) * mainVideo.duration;
  //passing percent as progressilime innerText
  progressTime.innerText = formatTime(percent);
  console.log(formatTime(percent));
});

//volume mute & unmute
volumeBtn.addEventListener("click", () => {
  // if volume icon isn't volume high icon
  if (!volumeBtn.classList.contains("fa-volume-high")) {
    // Passing 0.5 value as the video volume
    mainVideo.volume = 0.5;
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
  } else {
    // Passing 0.0 value as the video volume so the video mute
    mainVideo.volume = 0.0;
    volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
  }
  // update slider value according to the video volume
  volumeSlider.value = mainVideo.volume;
});

//volume slider
volumeSlider.addEventListener("input", (e) => {
  //passing slider value as video volume
  mainVideo.volume = e.target.value;
  if (e.target.value === 0) {
    // if slider value is 0, change icon to mute icon

    volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
  } else {
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
  }
  console.log(mainVideo.volume);
});

//play back speed

speedBtn.addEventListener("click", () => {
  //toggle show class
  speedOptions.classList.toggle("show");
});

speedOptions.querySelectorAll("li").forEach((option) => {
  // adding click event on all speed option
  option.addEventListener("click", () => {
    //passing option dataset value as video playback value
    mainVideo.playbackRate = option.dataset.speed;
    //removing active class
    speedOptions.querySelector(".active").classList.remove("active");
    // adding active class on the selected option
    option.classList.add("active");
  });
  console.log(option);
});

document.addEventListener("click", (e) => {
  if (
    e.target.tagName !== "SPAN" ||
    e.target.className !== "material-symbols-rounded"
  ) {
    //hide speed options on document click
    speedOptions.classList.remove("show");
  }
});

//picture
picInPicBtn.addEventListener("click", () => {
  // changing video mode to picture in picture
  mainVideo.requestPictureInPicture();
});

//full screen
fullScreenBtn.addEventListener("click", () => {
  container.classList.toggle("fullscreen");
  if (document.fullscreenElement) {
    // if video is already in fullscreen mode
    fullScreenBtn.classList.replace("fa-compress", "fa-expand");
    // exit from fullscreen mode and return

    return document.exitFullscreen();
  }
  fullScreenBtn.classList.replace("fa-expand", "fa-compress");
  //go to full screen mode
  container.requestFullscreen();
});

//backward

skipBackward.addEventListener("click", () => {
  // subract 5 seconds from the current video time
  mainVideo.currentTime -= 5;
});

//forward
skipForward.addEventListener("click", () => {
  // Adds5 seconds to the current video time
  mainVideo.currentTime += 5;
});

playPauseBtn.addEventListener("click", () => {
  // if video is paused, play the video else pause the video
  mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

mainVideo.addEventListener("play", () => {
  // if video is play, change icon to pause
  playPauseBtn.classList.replace("fa-play", "fa-pause");
});

mainVideo.addEventListener("pause", () => {
  // if video is pause, change icon to play
  playPauseBtn.classList.replace("fa-pause", "fa-play");
});
