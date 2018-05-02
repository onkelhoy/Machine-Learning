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
    this.grads = []
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
   * Takes input X and maps weights & bias accordingly to target output y 
   * 
   * @param {Array} X 
   * @param {Array} y 
   */
  Train (X, y, batchSize = X.length) {
    

    // calculate the output prediction
    let yhat = this.Feedforward(X)

    // now backpropargate the error and calculate the gradients
    const grads = this.Backpropargation(y, yhat)

    // update the weights and biases 
    this.Update(grads)
  }

  /**
   * Trains the network with mini batches (for now the core benifit is not implemented yet (doing the backprop later))
   * 
   * @param {2dArray} X 
   * @param {2dArray} y 
   * @param {Number} batchSize
   */
  TrainBatch (X, y, batchSize = X.length) {
    const batches = Math.ceil(X.length / batchSize) // ceil in order to get the last also
    // loop the batches
    for (let i=0; i<batches; i++) {
      const start = i * batchSize // gets batchsize or whats left
      const end = batchSize - ((start + batchSize) % X.length) * (1 - (batchSize % (X.length - start)) / batchSize)
      // loop batch
      for (let j=start; j<start+end; j++) {
        this.Train(X[j], y[j])
      }
    }
  }

  /**
   * Updates the weights & biases based on the gradients [w, b]
   * 
   * @param {Array} grads 
   */
  Update (grads) {
    const l = grads.length-1

    // updating the weights and biases (w+, b+)
    for (let i=0; i<=l; i++) {
      let dw = grads[l-i][0]
      let db = grads[l-i][1]

      // multiply by the learning rate (alpha)
      dw.multiply(this.params.learning_rate)
      db.multiply(this.params.learning_rate)

      this.weights[i].subtract(dw)
      this.bias[i].subtract(db)
    }
  }

  /**
   * Takes the guess (yhat) and the real ans (y) and gives the error
   * @returns {Array}
   * 
   * @param {Array} yhat 
   * @param {Array} y 
   */
  Cost (yhat, y, fn = this.LogisticLost) {
    // Logistic Lost function
    let l = []
    for (let i=0; i<y.length; i++)
      l.push(fn(yhat[i], y[i]))

    return l
  }

  /**
   * Mean squered error
   * 
   * @param {scalar} yhat 
   * @param {scalar} y 
   */
  MSELost (yhat, y) {
    return 1/2 * Math.pow(y - yhat, 2)
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


  /**
   * Backpropargation - where the network learns & updates its weights & biases
   * 
   * later: return grads and then in other function update the bias & weights
   * @param {Array} y
   * @param {Array} yhat
   */
  Backpropargation (y, yhat) {
    /**
     * Chain rule
     * delta = de/dz = de/da * da/dz
     * de/dw = delta * dz/dw
     * de/db = delta * dz/db = delta
     */
    
    const l = this.weights.length - 1
    let de = Matrix.subtractArray(y, yhat) // this is only for the MSE 
    de.multiply(-1)
    // resetting the grads
    const grads = []

    for (let i=l+1; i>0; i--) {
      let da = Matrix.map(this.params.a[i], dsigmoid) // update to work with ReLu or something else
      let delta = Matrix.multiply(de, da)
      let dz = this.params.a[i-1]

      // weight & bias
      grads.push([Matrix.dot(delta, dz.T), delta])

      // calulate the new error
      de = Matrix.dot(this.weights[i-1].T, delta)
    }

    return grads
  } 
}


