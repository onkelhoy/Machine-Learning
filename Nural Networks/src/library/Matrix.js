export default class Matrix {
  constructor (rows, columns) {
    if (typeof columns === 'undefined') {
      this.rows = rows.length
      this.columns = rows[0].length
      this.data = rows
    } else {
      this.rows = rows
      this.columns = columns
      this.data = []
      for (let r = 0; r < rows; r++) {
        this.data.push(new Array(columns).fill(0))
      }
    }
  }
  /**
   * 
   * @param {is a 1D array of numbers} array 
   * @param {number of rows} rows 
   * @param {number of columns} columns 
   * @returns Matrix based on the given array
   */
  static FromArray (array, rows = array.length, columns = 1) {
    if (array.length !== rows * columns) throw new Error('Array length does not match rows and columns')
    const m = new Matrix(rows, columns)
    m.map((val, r, c) => {
      return array[r + rows * c]
    })
    return m
  } 
  /**
   * Returns the Transpose of the matrix
   */
  Transpose () {
    let m = new Matrix(this.columns, this.rows)

    m.map((v, r, c) => {
      return this.data[c][r]
    })
    return m 
  }
  get T () {
    return this.Transpose()
  }

  /**
   * converts Matrix to a array (1xN matrix)
   */
  ToArray () {
    let a = []
    this.map(v => {
      a.push(v)
      return v
    })
    return a
  }

  map (fn) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        this.data[r][c] = fn(this.data[r][c], r, c)
      }
    }
  }

  randomize (min = 0, max = 1) {
    const range = Math.abs(max - min)
    this.map(value => Math.random() * range + min)
  }

  static dot (a, b) {
    if (a.columns !== b.rows)
      throw new Error(`The rows and columns doesn\'t match [${a.columns}][${b.rows}]`)
    
    const m = new Matrix(a.rows, b.columns)
    for (let r = 0; r < a.rows; r++)
      for (let c = 0; c < b.columns; c++)
        for (let i = 0; i < a.columns; i++)
          m.data[r][c] += a.data[r][i] * b.data[i][c]

    return m
  }

  /**
   * Element wise multiplication
   * @param {Matrix} a 
   * @param {Matrix} b 
   */
  static multiply (a, b) {
    return Matrix.map(a, (v, row, col) => {
      return v * b.data[row][col]
    })
  }
  static map (m, fn) {
    let nm = new Matrix(m.rows, m.columns)

    for (let r = 0; r < nm.rows; r++) {
      for (let c = 0; c < nm.columns; c++) {
        nm.data[r][c] = fn(m.data[r][c], r, c)
      }
    }

    return nm
  }

  /**
   * subtracts all the values from the equally sized arrays & returns an Matrix
   * 
   * @returns {Matrix}
   * @param {Array} a 
   * @param {Array} b 
   */
  static subtractArray (a, b) {
    let m = new Matrix(a.length, 1)
    for (let i=0;i<a.length;i++)
      m.data[i][0] = a[i] - b[i]

    return m
  }

  subtract (n) {
    if (n instanceof Matrix)
      this.map((v, r, c) => v - n.data[r][c])
    else
      this.map(v => v - n)
  }
  add (n) {
    if (n instanceof Matrix)
      this.map((v, r, c) => n.data[r][c] + v)
    else
      this.map(v => v + n)
  }

  multiply (n) {
    this.map(v => v * n)
  }

  get Print () {
    console.table(this.data)
  }
  get Shape () {
    console.log(`(${this.rows}x${this.columns})`)
  }
}