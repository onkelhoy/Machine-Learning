import Matrix from './Matrix'
import { Sigmoid, SigmoidPrime, dsigmoid } from './ActivationFunctions'

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

    this.params = {
      a: [],
      loss: [],
      learning_rate: 0.03
    }
    this.grads = {
      dw: [],
      db: []
    }
  }

  /**
   * Takes input X and outputs yhat
   * 
   * @param {Array} X 
   * @returns {Array} 
   */
  Feedforward (X) {
    let a = Matrix.FromArray(X)
    // resetting
    this.params.a = []
    this.params.a.push(a)

    // store a & z for ease of calculation later
    for (let i=0; i<this.weights.length; i++) {
      let z = Matrix.dot(this.weights[i], a) // maybe take the transpose of w
      z.add(this.bias[i])
      a = Matrix.map(z, Sigmoid)
      this.params.a.push(a) 
    }
    return a.ToArray()
  }
  /**
   * Set the learning rate to wished alpha
   */
  set learningRate (alpha) {
    this.params.learning_rate = alpha
  } 

  /**
   * Takes the guess (yhat) and the real ans (y) and gives the error
   * @returns {Array}
   * 
   * @param {Array} yhat 
   * @param {Array} y 
   */
  Lost (yhat, y, fn = this.LogisticLost) {
    // Logistic Lost function
    let l = []
    for (let i=0; i<y.length; i++)
      l.push(fn(yhat[i], y[i]))

    return l
  }

  /**
   * Calculates the derivatives of weights & bias
   * 
   * @param {Array} y 
   * @param {Array} yhat 
   */
  Backpropargation (y, yhat) {
    // Calculate for the output layer
    const l = this.weights.length-1
    let wT = Matrix.subtractArray(y, yhat)
    let delta

    // Calculate for all the hidden layers
    for (let i=l; i>=0; i--) {
      let aT = this.params.a[i].T // will eventually be input X
      let dz = Matrix.map(this.params.a[i+1], dsigmoid)

      let gradient = Matrix.multiply(wT, dz)

      if (delta === undefined) delta = gradient
      else delta = Matrix.dot(gradient, delta)
      
      let dw = Matrix.dot(delta, aT)
      dw.multiply(this.params.learning_rate)
      this.weights[i].add(dw)

      wT = this.weights[i].T
    }
  }

  /**
   * Takes input X and maps weights & bias accordingly to output y 
   * 
   * @param {Array} X 
   * @param {Array} y 
   */
  Train (X, y) {
    let yhat = this.Feedforward(X)

    
    this.Backpropargation(y, yhat)
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