class Matrix {
  constructor (rows, columns) {
    this.rows = rows
    this.columns = columns
    this.matrix = [][]
  }

  map (fn) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        this.matrix[r][c] = fn(this.matrix[r][c], r, c)
      }
    }
  }
}