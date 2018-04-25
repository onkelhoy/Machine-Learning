const Sigmoid = x => 1 / (1 + Math.exp(-x))
const SigmoidPrime = x => Sigmoid(x) * (1 - Sigmoid(x))
const dsigmoid = z => z * (1 - z)


export {
  Sigmoid, SigmoidPrime, dsigmoid
}