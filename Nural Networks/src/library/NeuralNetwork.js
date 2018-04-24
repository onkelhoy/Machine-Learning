import Matrix from './Matrix'
import { Sigmoid } from './ActivationFunctions'


// Two layer network
export default class NeuralNetwork {
  /**
   * 
   * @param {Number} input_nodes 
   * @param {Number} hidden_nodes 
   * @param {Number} output_nodes 
   */
  constructor (input_nodes, hidden_nodes, output_nodes) {
    this.num_input = input_nodes
    this.num_hidden = hidden_nodes
    this.num_output = output_nodes

    this.weights_ih = new Matrix(hidden_nodes, input_nodes)
    this.weights_ho = new Matrix(output_nodes, hidden_nodes)
    this.weights_ih.randomize()
    this.weights_ho.randomize()

    this.bias_h = new Matrix(hidden_nodes, 1)
    this.bias_o = new Matrix(output_nodes, 1)
  }
  
  /**
   * 
   * @param {Array} input_array 
   */
  FeedForward (input_array) {
    let inputs = Matrix.FromArray(input_array)

    // Generate the hidden outputs
    let hidden = Matrix.Product(this.weights_ih, inputs)
    hidden.add(this.bias_h)
    // Activation Function
    hidden.map(Sigmoid)

    // Generate the output outputs
    let output = Matrix.Product(this.weights_ho, hidden)
    output.add(this.bias_o)
    // Activation functoin
    output.map(Sigmoid)

    return output.ToArray()
  }

  /**
   * y - prediction output
   * yhat - desired output
   * @param {Scalar} y 
   * @param {Scalar} yhat 
   */
  Lost (y, yhat) {
    // the log
    return -y*Math.log(yhat) + (1-y)*Math.log(1-yhat)
  }
  /**
   * The sum of all lost 
   */
  Cost () {
    // 1/m * sum(Lost(y, yhat))
  }
  backpropagation (A, y) {
    // calculate dirivative of Z
    // let dz2 = A - y
    // let dz1 = w1.T * dz2 * g'(z1)

    // calculate dirivative of weight (m => #training examples)
    let dw = 1/this.m * dz * A.Transpose()

    // calculate dirivative of bias
    let db = 
  }

  Train (X, yhat) {
    let y = this.FeedForward(X)
    // now compute error using y & yhat
    let lost = this.Lost(y, yhat)

    return y
  }
}