import './css/style.scss'
import NeuralNetwork from './library/NeuralNetwork'

const nn = new NeuralNetwork(3, 6, 7, 9, 2)
nn.learningRate = .5

let color = [100, 149, 237]
let colorElm = null
let aiElm = null 


window.onload = function () {
  colorElm = document.querySelector('.color')
  aiElm = document.querySelector('.ai')
  let blackelm = colorElm.querySelector('.black')
  let whiteelm = colorElm.querySelector('.white')

  blackelm.onclick = click
  whiteelm.onclick = click

  predict()
}


function predict () {
  let x = color.map(v => v / 255)
  let guess = nn.Feedforward(x)
  console.log(guess.map(v => Math.round(v * 100) / 100))
  if (guess[1] > guess[0]) {
    console.log('guess white')
    aiElm.classList.add('white')
    // aiElm.classList.remove('white')
  } else {
    console.log('guess black')
    aiElm.classList.remove('white')
  }

  // console.log(aiElm.classList)
}
function click (e) {
  // console.log(color, this.classList)
  let y = [1, 0] 
  if (this.classList[0] === 'white') {
    y = [0, 1]
  }

  let x = color.map(v => v / 255)
  nn.Train(x, y)
  

  color = color.map(v => Math.round(Math.random() * 255))
  colorElm.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`

  predict()
}

