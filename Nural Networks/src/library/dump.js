
  /**
   * Calculates the derivatives of weights & bias
   * 
   * @param {Array} y 
   * @param {Array} yhat 
   */
  Backpropargation (y, yhat) {
    // Calculate for the output layer
    const l = this.weights.length-1
    let dC = Matrix.subtractArray(yhat, y)
    dC.add(2) // dC/dA = 2(a(l) - y)


    // dA/dZ = o'(z), since a(l) = o(z(l)) we can reuse a, thus derivative of sigmoid is a * (1 - a)
    let dA = Matrix.map(this.params.a[l+1], dsigmoid) 
    
    let delta = Matrix.multiply(dC, dA)

    for (let i=l; i>=0; i--) {
      // since both w & a starts at 0, w[l] => a[l+1], so w[l-1] => a[l]
      let dZ = this.params.a[l].T  // dZ/dW = a(l-1)
      let dw = Matrix.dot(delta, dZ)

      delta = Matrix.dot(this.weights[i], delta)
      
    }

    // let delta

    // Calculate for all the hidden layers
    // for (let i=l; i>=0; i--) {
    //   let aT = this.params.a[i].T // will eventually be input X
    //   let dz = Matrix.map(this.params.a[i+1], dsigmoid)

    //   let gradient = Matrix.multiply(wT, dz)

    //   if (delta === undefined) delta = gradient
    //   else delta = Matrix.dot(gradient, delta)
      
    //   let dw = Matrix.dot(delta, aT)
    //   dw.multiply(this.params.learning_rate)
    //   this.weights[i].add(dw)

    //   wT = this.weights[i].T
    // }
  }

  /**
   * Calculate delta at given index (not the combinded delta but the new)
   * @param {index} layer 
   */
  CalculateDelta (layer) {

  }
