let lives = 3;
let randomNumber = Math.floor(Math.random() * 10) + 1;
const input = document.getElementById('inpNum');
const result = document.getElementById('result');
const livesDisplay = document.getElementById('lives');
const submitBtn = document.getElementById('submit');

submitBtn.addEventListener('click', () => {
  const guess = parseInt(input.value);

  if (isNaN(guess) || guess < 1 || guess > 10) {
    result.textContent = "⚠️ Enter a number between 1 and 10!";
    result.style.color = "#cc0000";
    return;
  }

  if (guess === randomNumber) {
    result.textContent = "🎉 Congratulations! You guessed it!";
    result.style.color = "green";
    endGame();
  } else {
    lives--;
    livesDisplay.textContent = `❤️ Lives: ${lives}`;
    result.style.color = "#cc0000";

    if (lives === 0) {
      result.textContent = `💀 Game Over! The number was ${randomNumber}.`;
      endGame();
    } else if (guess < randomNumber) {
      result.textContent = "📉 Too low! Try again.";
    } else {
      result.textContent = "📈 Too high! Try again.";
    }
  }

  input.value = "";
});

function endGame() {
  input.disabled = true;
  submitBtn.disabled = true;
  input.classList.add('disabled');
  submitBtn.style.opacity = 0.6;
}
