const character = document.getElementById("character");
const goal = document.getElementById("goal");
const levelText = document.getElementById("level-text");
const bonusScreen = document.getElementById("bonus-screen");
const joystick = document.getElementById("joystick");
const joystickContainer = document.getElementById("joystick-container");

// Popup Elements
const questionPopup = document.getElementById("question-popup");
const questionText = document.getElementById("question-text");
const answerButtons = document.querySelectorAll(".answer-button");

// Audio and Video Elements
const successSound = document.getElementById("success-sound");
const videoContainer = document.getElementById("video-container");
const celebrationVideo = document.getElementById("celebration-video");

// Levels with questions and answers
const levels = [
  {
    goalX: 700,
    goalY: 500,
    question: "chno aklat minoch mofadala",
    answers: ["djaj", "patata", "hamos"],
    correctAnswer: "hamos"
  },
  {
    goalX: 100,
    goalY: 400,
    question: "chno li minoch ky3jbo fi minocha ",
    answers: ["3iniha", "khdidat", "zoko zoko wal 3iyado bilah"],
    correctAnswer: "khdidat"
  },
  {
    goalX: 400,
    goalY: 100,
    question: "chno smiya li ghadi khtar minoch o minocha wliyd momo dylhom",
    answers: ["mohamed", "driss", "rayan"],
    correctAnswer: "mohamed"
  },
  {
    goalX: 300,
    goalY: 400,
    question: "chno afdal chakhs 3nd minoch",
    answers: ["minocha", "minocha", "minocha"],
    correctAnswer: "minocha"
  }
];

let currentLevel = 0;
let characterX = 50;
let characterY = 50;
const speed = 5;

// Update character position
function updatePosition() {
  character.style.left = `${characterX}px`;
  character.style.top = `${characterY}px`;
}

// Check if character reaches the goal
function checkGoal() {
  const goalRect = goal.getBoundingClientRect();
  const characterRect = character.getBoundingClientRect();

  if (
    characterRect.left < goalRect.right &&
    characterRect.right > goalRect.left &&
    characterRect.top < goalRect.bottom &&
    characterRect.bottom > goalRect.top
  ) {
    // Show the question popup
    questionText.textContent = levels[currentLevel].question;
    const answers = levels[currentLevel].answers;
    answerButtons.forEach((button, index) => {
      button.textContent = answers[index];
    });
    questionPopup.classList.add("visible");
  }
}

// Handle answer selection
answerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedAnswer = button.textContent;
    const correctAnswer = levels[currentLevel].correctAnswer;

    if (selectedAnswer === correctAnswer) {
      // Correct answer
      successSound.play();
      questionPopup.classList.remove("visible");

      currentLevel++;
      if (currentLevel < levels.length) {
        levelText.textContent = `Level ${currentLevel + 1}: Reach the goal!`;
        characterX = 50; // Reset character position
        characterY = 50;
        goal.style.left = `${levels[currentLevel].goalX}px`;
        goal.style.top = `${levels[currentLevel].goalY}px`;
      } else {
        // All levels completed
        levelText.textContent = "You completed all levels!";
        bonusScreen.classList.add("visible");

        // Show and play the celebration video
        videoContainer.classList.add("visible");
        celebrationVideo.play();
      }
    } else {
      // Wrong answer
      alert("Wrong answer! Try again.");
    }
  });
});

// Handle keyboard input
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      characterY -= speed;
      break;
    case "ArrowDown":
      characterY += speed;
      break;
    case "ArrowLeft":
      characterX -= speed;
      break;
    case "ArrowRight":
      characterX += speed;
      break;
  }
  updatePosition();
  checkGoal();
});

// Handle joystick movement (for touch and mouse)
let isJoystickActive = false;

function startJoystick(event) {
  isJoystickActive = true;
  moveJoystick(event);
}

function moveJoystick(event) {
  if (!isJoystickActive) return;

  const rect = joystickContainer.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  // Get input position (touch or mouse)
  let clientX, clientY;
  if (event.touches) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  const deltaX = clientX - rect.left - centerX;
  const deltaY = clientY - rect.top - centerY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const maxDistance = centerX;

  if (distance > maxDistance) {
    const angle = Math.atan2(deltaY, deltaX);
    const limitedX = Math.cos(angle) * maxDistance;
    const limitedY = Math.sin(angle) * maxDistance;
    joystick.style.transform = `translate(${limitedX}px, ${limitedY}px)`;
    characterX += limitedX / maxDistance * speed;
    characterY += limitedY / maxDistance * speed;
  } else {
    joystick.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    characterX += deltaX / maxDistance * speed;
    characterY += deltaY / maxDistance * speed;
  }

  updatePosition();
  checkGoal();
}

function stopJoystick() {
  isJoystickActive = false;
  joystick.style.transform = "translate(0, 0)";
}

// Add event listeners for touch
joystickContainer.addEventListener("touchstart", startJoystick);
joystickContainer.addEventListener("touchmove", moveJoystick);
joystickContainer.addEventListener("touchend", stopJoystick);

// Add event listeners for mouse
joystickContainer.addEventListener("mousedown", startJoystick);
joystickContainer.addEventListener("mousemove", moveJoystick);
joystickContainer.addEventListener("mouseup", stopJoystick);
joystickContainer.addEventListener("mouseleave", stopJoystick);

// Initialize first level
goal.style.left = `${levels[currentLevel].goalX}px`;
goal.style.top = `${levels[currentLevel].goalY}px`;