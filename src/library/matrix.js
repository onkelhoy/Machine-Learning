export default class Matrix {
  constructor (rows, columns) {
    if (typeof columns === 'undefined') {
      this.rows = rows.length
      this.columns = rows[0].length
      this.matrix = rows
    } else {
      this.rows = rows
      this.columns = columns
      this.matrix = []
      for (let r = 0; r < rows; r++) {
        this.matrix.push(new Array(columns).fill(0))
      }
    }
  }

  static FromArray (array, rows, columns) {
    if (array.length !== rows * columns) throw new Error('Array length does not match rows and columns')
    const m = new Matrix(rows, columns)
    m.map((val, r, c) => {
      return array[r * rows + c]
    })

    return m
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
    this.map(value => Math.random() * range + min)
  }

  static Product (a, b) {
    if (!a instanceof Matrix)
      throw new Error('The first given object is not a instance of the Matrix class')
    if (!b instanceof Matrix)
      throw new Error('The second given object is not a instance of the Matrix class')
    if (a.columns !== b.rows)
      throw new Error(`The rows and columns doesn\'t match [${a.columns}][${b.rows}]`)
    
    const m = new Array(a.rows)
    for (let r = 0; r < a.rows; r++) {
      m[r] = new Array(b.columns)
      for (let c = 0; c < b.columns; c++) {
        m[r][c] = 0
        for (let i = 0; i < a.columns; i++) {
          m[r][c] += a.matrix[r][i] * b.matrix[i][c]
        }
      }
    }
    return new Matrix(m)
  }

  multiply (n) {
    this.map(v => v * n)
  }

  print () {
    console.table(this.matrix)
  }
}