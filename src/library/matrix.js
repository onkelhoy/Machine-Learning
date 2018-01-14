export default class Matrix {
  constructor (rows, columns) {
    this.rows = rows
    this.columns = columns
    this.matrix = []
    for (let r = 0; r < rows; r++) {
      this.matrix.push(new Array(columns).fill(0))
    }
  }

  map (fn) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        this.matrix[r][c] = fn(this.matrix[r][c], r, c)
      }
    }
  }

  randomize (min = 0, max = 1) {
    const range = Math.abs(max - min)
    this.map(value => {
      return Math.random() * range - min
    })
  }

  print () {
    console.table(this.matrix)
  }
}