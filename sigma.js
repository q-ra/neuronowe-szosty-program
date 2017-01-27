function sigma(x) {
  return 1 / (1 + Math.exp(-x))
}

function sigmaDerivative(x) {
  return sigma(x) * (1 - sigma(x))
}