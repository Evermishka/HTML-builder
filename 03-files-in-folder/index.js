const path = require('path')
const fs = require('fs')
const fsPromisess = fs.promises

async function readDir(dir) {
  try {
    const data = await fsPromisess.readdir(
      path.join(__dirname, dir),
      { withFileTypes: true }
    )
    const files = data.filter((file) => !file.isDirectory())
    for (const file of files) {
      const filePath = path.join(__dirname, dir, file.name)      
      const fileName = path.basename(filePath).replace(path.extname(filePath), '')
      const fileExt = path.extname(filePath).slice(1)
      const fileStat = await fsPromisess.stat(filePath)
      const fileSize = fileStat.size
      console.log(`${fileName} - ${fileExt} - ${fileSize}b`)
    }
  } catch (err) {
    console.error(err)
  }
}

readDir('secret-folder')
