// let initialRound = 0;

// function generateRandom(){
//     let hexColor = Math.random().toString(16).slice(2, 8).padEnd(6, 0)
//     let body = document.querySelector('body')
//     let hexField = document.querySelector('#hex-code')
//     let generatedCode = `#${hexColor}`

//     hexField.innerHTML = generatedCode;

//     body.style.backgroundColor = generatedCode;

//     var box = document.querySelector('#box');
//     var hexBox = Math.random().toString(16).slice(2, 8).padEnd(6, 0)

//     var round = initialRound += 25;
//     box.style.rotate = `${round}deg`
//     box.style.backgroundColor = `#${hexBox}`
//     let boxbgCode = document.getElementById('boxbgCode')

//     boxbgCode.innerHTML = `(#${hexBox})<br>bxClr`;
// }

//setInterval(generateRandom, 200);

let initialRound = 0;

function generateRandom() {
  const hexColor = Math.random().toString(16).slice(2, 8).padEnd(6, "0");
  const generatedCode = `#${hexColor}`;
  document.body.style.backgroundColor = generatedCode;
  document.getElementById("hex-code").innerHTML = generatedCode;

  const box = document.getElementById("box");
  const hexBox = Math.random().toString(16).slice(2, 8).padEnd(6, "0");
  const round = initialRound += 45;

  box.style.transform = `rotate(${round}deg)`;
  box.style.backgroundColor = `#${hexBox}`;
  document.getElementById("boxbgCode").innerHTML = `(#${hexBox})<br>bxClr`;
}
