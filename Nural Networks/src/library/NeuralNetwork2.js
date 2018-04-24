import Matrix from './Matrix'
import { Sigmoid } from './ActivationFunctions'

export default class NeuralNetwork {
  /**
   * layers can be defined so we have mulitple layers ( the last is output )
   * must have at least two numbers
   * @param {Number} layers 
   */
  constructor (...layers) {
    if (layers.length < 2) throw new Error('NeuralNetwork must at least have two layers')
    this.weights = []
    this.bias = []

    for (let i=0; i<layers.length-1; i++) {
      let w = new Matrix(layers[i+1], layers[i])
      w.randomize()

      this.weights.push(w)
      this.bias.push(new Matrix(layers[i+1], 1)) // initilized with zeros !
    }

    this.learning_rate = 0.03
  }

  /**
   * Takes input X and outputs yhat
   * 
   * @param {Training} X 
   * @returns {Matrix} 
   */
  Feedforward (X) {
    let a = X

    // store a & z for ease of calculation later
    for (let i=0; i<this.weights.length; i++) {
      let z = Matrix.Product(this.weights[i], a) // maybe take the transpose of w
      z.add(this.bias[i])
      
      a = Matrix.map(z, Sigmoid)
    }

    return a
  }

  Backpropargation (lost) {2

    // w = dw * learning_rate
  }

  /**
   * Takes the guess (yhat) and the real ans (y) and gives the error
   * @returns {Array}
   * 
   * @param {Array} yhat 
   * @param {Array} y 
   */
  Lost (yhat, y) {
    // Logistic Lost function
    let l = []
    for (let i=0; i<y.length; i++)
      l.push(this.LogisticLost(yhat[i], y[i]))

    return l
  }

  /**
   * The logistic lost function return the lost of y and yhat
   * 
   * @returns {Number}
   * @param {Number} yhat 
   * @param {Number} y 
   */
  LogisticLost (yhat, y) {
    return -y*Math.log(yhat) - (1-y)*Math.log(1-yhat)
  }
  
}