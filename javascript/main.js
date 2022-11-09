const Hungry_INTERVAL = 2000;
const SAD_INTERVAL = 500;
const LEAVING_INTERVAL = 500;
const FED_INTERVAL = 500;
let score = 0;

const imgList = document.querySelectorAll(".mole");
const gameBody = document.querySelector(".bg");
const wormContainer = document.querySelector(".worm-container");

// create an array of objects in which every object represents a mole
let moles = new Array(10);

// initialize the moles array
for (let i = 0; i < imgList.length; i++) {
  moles[i] = {
    currentStatus: "sad",
    nextUpdateTime: Date.now(),
    isKing: false,
    imgNode: imgList[i],
  };
}

// Methods
function win() {
  gameBody.classList.add("hidden");
  document.querySelector(".win-mole").classList.remove("hidden");
}

function scoreHandler(moleIndex) {
  if (moles[moleIndex].isKing) {
    score += 20;
  } else {
    score += 10;
  }

  wormContainer.style.width = `${score}%`;
  if (score === 100) {
    // end the game
    win();
  }
}

function getRandomNumber() {
  let result = Math.random() * 20 + 2;
  return parseInt(result);
}

function getKingMole() {
  let tmp = Math.random() >= 0.9;
  return tmp;
}

function eventHandler(event) {
  if (
    event.target.tagName === "IMG" &&
    event.target.classList.contains("hungry")
  ) {
    // get fed mole
    getFedMole(event.target.dataset.index);
    scoreHandler(event.target.dataset.index);
  }
}

function getHungryMole(mole) {
  // to determine if the next mole is king or normal mole
  mole.isKing = getKingMole();

  if (mole.isKing) {
    mole.imgNode.src = "../images/king-mole-hungry.png";
  } else {
    mole.imgNode.src = "../images/mole-hungry.png";
  }

  mole.imgNode.classList.add("hungry");

  mole.currentStatus = "hungry";
  mole.nextUpdateTime = Date.now() + Hungry_INTERVAL;
}

function getFedMole(moleIndex) {
  const mole = moles[moleIndex];
  mole.imgNode.classList.remove("hungry");

  if (mole.isKing) {
    mole.imgNode.src = "../images/king-mole-fed.png";
  } else {
    mole.imgNode.src = "../images/mole-fed.png";
  }

  mole.currentStatus = "fed";
  mole.nextUpdateTime = Date.now() + FED_INTERVAL;
}

function getSadMole(mole) {
  mole.imgNode.classList.remove("hungry");

  if (mole.isKing) {
    mole.imgNode.src = "../images/king-mole-sad.png";
  } else {
    mole.imgNode.src = "../images/mole-sad.png";
  }

  mole.currentStatus = "sad";
  mole.nextUpdateTime = Date.now() + SAD_INTERVAL;
}

function getLeavingMole(mole) {
  if (mole.isKing) {
    mole.imgNode.src = "../images/king-mole-leaving.png";
  } else {
    mole.imgNode.src = "../images/mole-leaving.png";
  }

  mole.currentStatus = "leaving";
  mole.nextUpdateTime = Date.now() + LEAVING_INTERVAL;
}

function removeTheMole(mole) {
  mole.imgNode.src = "";

  mole.currentStatus = "gone";
  mole.nextUpdateTime = Date.now() + getRandomNumber() * 1000;
}

function getNextStatus(mole) {
  if (mole.currentStatus === "gone") {
    getHungryMole(mole);
  } else if (mole.currentStatus === "hungry") {
    getSadMole(mole);
  } else if (mole.currentStatus === "sad" || mole.currentStatus === "fed") {
    getLeavingMole(mole);
  } else if (mole.currentStatus === "leaving") {
    removeTheMole(mole);
  }
}

gameBody.addEventListener("click", eventHandler);

let controllerTimer = Date.now();
function controller() {
  let now = Date.now();

  if (now >= controllerTimer) {
    // change game status every 100ms
    for (let i = 0; i < moles.length; i++) {
      // to check if there's a mole is ready for update its status
      if (now >= moles[i].nextUpdateTime) {
        getNextStatus(moles[i]);
      }
    }

    controllerTimer = Date.now() + 100;
  }

  requestAnimationFrame(controller);
}

setTimeout(controller, 1000);
