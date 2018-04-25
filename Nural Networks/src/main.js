import Matrix from './library/Matrix'
import NeuralNetwork from './library/NeuralNetwork'

let nn = new NeuralNetwork(2, 2, 1)
nn.learningRate = 0.3

let X = [
  [1, 0],
  [0, 1],
  [1, 1],
  [0, 0]
]

let y = [[1], [0], [0], [1]]

for (let i=0; i<10000; i++) {
  nn.Train(X[i % 4], y[i % 4])
}

console.log(Math.round(nn.Feedforward(X[0])))
console.log(Math.round(nn.Feedforward(X[1])))
console.log(Math.round(nn.Feedforward(X[2])))
console.log(Math.round(nn.Feedforward(X[3])))
