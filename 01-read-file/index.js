const path = require('path')
const fs = require('fs')
const { stdout } = require('process')

let readbleStream = fs.createReadStream(
  path.join(__dirname, 'text.txt'),
  'utf-8'
)

readbleStream.pipe(stdout)
