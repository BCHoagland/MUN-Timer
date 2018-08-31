var timers = [0, 0];
var masterMaxTimes = [0, 0];
var masterTimeTypes = [1, 60];        //1 means seconds, 60 means mintutes
var masterTimeIndicators;
var masterNumTimers;
var masterType;
var masterTimer;

function animateOffToLeft(str) {
  var e = document.getElementById(str);
  e.classList.add("off-screen-to-left");
  e.addEventListener('webkitAnimationEnd',function( event ) {hide(str);e.classList.remove("off-screen-to-left")}, false);
}

function animateOffToRight(str) {
  var e = document.getElementById(str);
  e.classList.add("off-screen-to-right");
  e.addEventListener('webkitAnimationEnd',function( event ) {hide(str);e.classList.remove("off-screen-to-right")}, false);
}

function animateOnFromLeft(str) {
  var e = document.getElementById(str);
  show(str);
  e.classList.add("on-screen-from-left");
  e.addEventListener('webkitAnimationEnd',function( event ) {show(str);e.classList.remove("on-screen-from-left")}, false);
}

function animateOnFromRight(str) {
  var e = document.getElementById(str);
  show(str);
  e.classList.add("on-screen-from-right");
  e.addEventListener('webkitAnimationEnd',function( event ) {show(str);e.classList.remove("on-screen-from-right")}, false);
}

function show(str) {
  var e = document.getElementById(str).style;
  e.display = "block";
}

function hide(str) {
  var e = document.getElementById(str).style;
  e.display = "none";
}

function animateOnTypes(n, dir) {
  animateOffInputsToRight();
  animateOffTimers();
  animateOnFromLeft("types-container");
}

function showTypes() {
  hideAll();
  show("types-container");
}

function animateOffTypes() {
  animateOffToLeft("types-container");
}

function hideTypes() {
  hide("types-container");
}

function animateOnInputs(n) {
  masterNumTimers = n;
  animateOffTypes();
  for (var i = 0; i < n; i++) {
    document.getElementById("input" + i).placeholder = masterTimeIndicators[i];
    show("input" + i);
  }
  show("input-enter");
  show("input-exit");
  animateOnFromRight("inputs-container");
}

function showInputs(n) {
  masterNumTimers = n;
  hideTypes();
  for (var i = 0; i < n; i++) {
    document.getElementById("input" + i).placeholder = masterTimeIndicators[i];
    show("input" + i);
  }
  show("input-enter");
  show("input-exit");
  show("inputs-container");
}

function animateOffInputs() {
  animateOffToLeft("inputs-container");
  setTimeout(function() {
    for (var i = 0; i < 2; i++) {
      hide("input" + i);
    }
    hide("input-enter");
    hide("input-exit");
  }, 1000);
}

function animateOffInputsToRight() {
  animateOffToRight("inputs-container");
  setTimeout(function() {
    for (var i = 0; i < 2; i++) {
      hide("input" + i);
    }
    hide("input-enter");
    hide("input-exit");
  }, 1000);
}

function hideInputs() {
  hide("inputs-container");
  for (var i = 0; i < 2; i++) {
    hide("input" + i);
  }
  hide("input-enter");
  hide("input-exit");
}

function animateOnTimers(str, n) {
  animateOffInputs();
  for (var i = 0; i < n; i++) {
    setTimer(i, masterMaxTimes[i]);
    show("timer" + i);
  }
  document.getElementById("timer-title").innerHTML = str;
  show("timer-title");
  show("start");
  show("reset");
  show("timer-exit");
  animateOnFromRight("timers-container");
}

function showTimers(str, n) {
  hideInputs();
  for (var i = 0; i < n; i++) {
    setTimer(i, masterMaxTimes[i]);
    show("timer" + i);
  }
  document.getElementById("timer-title").innerHTML = str;
  show("timer-title");
  show("start");
  show("timer-exit");
  show("timers-container");
}

function animateOffTimers() {
  animateOffToRight("timers-container");
  setTimeout(function() {
    for (var i = 0; i < 2; i++) {
      hide("timer" + i);
    }
    hide("timer-title");
    hide("timer-exit");
    hide("start");
    hide("pause");
    hide("continue");
    hide("reset");
  }, 1000);
}

function hideTimers() {
  hide("timers-container");
  for (var i = 0; i < 2; i++) {
    hide("timer" + i);
  }
  hide("timer-title");
  hide("timer-exit");
  hide("start");
  hide("pause");
  hide("continue");
  hide("reset");
}

function hideAll() {
  hideTypes();
  hideInputs();
  hideTimers();
}

function selectType(n) {
  document.getElementById("input0").value = "";
  document.getElementById("input1").value = "";
  switch (n) {
    case 0:
    masterType = "Moderated Caucus";
    masterTimeTypes = [60, 1];
    masterTimeIndicators = ["Total Time (min)", "Speaking Time (sec)"];
    animateOnInputs(2);
    break;
    case 1:
    masterType = "Unmoderated Caucus";
    masterTimeTypes = [60];
    masterTimeIndicators = ["Total Time (min)"];
    animateOnInputs(1);
    break;
    case 2:
    masterType = "Round Robin";
    masterTimeTypes = [1];
    masterTimeIndicators = ["Speaking Time (sec)"];
    animateOnInputs(1);
    break;
  }
}

function enterInputs() {
  for (var i = 0; i < masterNumTimers; i++) {
    var value = parseInt(document.getElementById("input" + i).value);
    if (isNaN(value)) value = 0;
    masterMaxTimes[i] = value * masterTimeTypes[i];
  }
  animateOnTimers(masterType, masterNumTimers);
}

function startMasterTimer() {
  clearInterval(masterTimer);
  masterTimer = setInterval(function() {decrementTimers()}, 1000);
}

function stopMasterTimer() {
  clearInterval(masterTimer);
}

function decrementTimers() {
  for (var i = 0; i < masterNumTimers; i++) {
    if (timers[i] >= 1) {
      timers[i] -= 1;
      updateTimerView();
    }
    if (timers[i] <= 0) {
      if (masterType != "Moderated Caucus" || i == 1) {
        timeExpired();
        return;
      }
    }
  }
}

function updateTimerView() {
  for (var i = 0; i < masterNumTimers; i++) {
    document.getElementById("timer" + i).innerHTML = timers[i];
  }
}

function setTimer(n, time) {
  timers[n] = time;
  updateTimerView();
}

function resetTimer(n) {
  stopMasterTimer();
  setTimer(n, masterMaxTimes[n]);
}

function timeExpired() {
  stopMasterTimer();
  hide("pause");
  hide("continue");
  show("reset");
}

function start() {
  startMasterTimer();
  hide("start");
  show("pause");
  show("reset");
}

function pause() {
  if (timers[0] <= 0) return;
  clearInterval(masterTimer);
  hide("pause");
  show("continue");
}

function cont() {
  if (timers[0] <= 0) return;
  startMasterTimer();
  hide("continue");
  show("pause");
}

function reset() {
  if (document.getElementById("timer1").style.display != "none") {
    setTimer(0, masterMaxTimes[0]);
    setTimer(1, masterMaxTimes[1]);
  } else {
    setTimer(0, masterMaxTimes[0]);
  }
  pause();
  hide("continue");
  show("start");
}

function exit() {
  stopMasterTimer();
  animateOnTypes();
}

showTypes();
