import Matrix from './library/matrix'

let a = new Matrix([
  [1, 2, 3]
])

let b = new Matrix([
  [4],
  [2],
  [5]
])

let c = Matrix.Product(b, a)

a.print()
b.print()
c.print()