const path = require('path')
const fs = require('fs')
const process = require('process')
const { stdin, stdout, exit } = process

function sayBye() {
  stdout.write('\nBye! Good luck!')
  exit()
}

stdout.write('Hello! Write your text here:\n')

fs.writeFile(path.join(__dirname, 'text.txt'), '', (err) => {
  if (err) throw err
})

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    sayBye()
  }
  fs.appendFile(path.join(__dirname, 'text.txt'), data, (err) => {
    if (err) throw err
  })
})

process.on('SIGINT', sayBye)
