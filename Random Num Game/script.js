let lives = 3;
let randomNumber = Math.floor(Math.random() *10) +1;

document.getElementById('submit').addEventListener('click', ()=> {
    let guess = parseInt(document.getElementById('inpNum').value);

    if(guess === randomNumber){
        document.getElementById('result').textContent = 
        `Congratulations! You guess the correct number!`;
    }else{
            lives--;
            document.getElementById('lives').textContent = 
            `Lives: ${lives}`;

            if (lives === 0) {
                document.getElementById('result').textContent = 
                `Game Over! The correct Number was ${randomNumber}.`;
            }else if(guess < randomNumber){
                document.getElementById('result').textContent = 
                `Too low! Try Again.`
            }else{
                document.getElementById('result').textContent =
                `Too high! Try Again.`
            }
        }
});