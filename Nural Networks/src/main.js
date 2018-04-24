import Matrix from './library/Matrix'
import NeuralNetwork from './library/NeuralNetwork2'

let nn = new NeuralNetwork(2, 2, 1)

let x = [2, 1]

let guess = nn.Feedforward(Matrix.FromArray(x))
console.log(guess, 2) 