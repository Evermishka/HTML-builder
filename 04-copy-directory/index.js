const path = require('path')
const fs = require('fs')
const fsPromisess = fs.promises

async function clearCopy(dir) {
  try {
    const filesCopy = await fsPromisess.readdir(
      path.join(__dirname, `${dir}-copy`),
      {
        withFileTypes: true,
      }
    )
    for (const file of filesCopy) {
      fs.unlink(path.join(__dirname, `${dir}-copy`, file.name), (err) => {
        if (err) throw err
      })
    }
  } catch (err) {
    throw err
  }
}

async function makeCopy(dir) {
  try {
    fs.mkdir(
      path.join(__dirname, `${dir}-copy`),
      { recursive: true },
      (err) => {
        if (err) throw err
      }
    )
    const files = await fsPromisess.readdir(path.join(__dirname, dir), {
      withFileTypes: true,
    })
    for (const file of files) {
      const srcPath = path.join(__dirname, dir, file.name)
      const destPath = path.join(__dirname, `${dir}-copy`, file.name)
      fs.copyFile(srcPath, destPath, (err) => {
        if (err) throw err
      })
    }
  } catch (err) {
    throw err
  }
}

function copyDir(dir) {
  try {
    fs.access(path.join(__dirname, `${dir}-copy`), (err) => {
      if (err) {
        makeCopy(dir)
      } else {
        clearCopy(dir)
        makeCopy(dir)
      }
    })
  } catch (err) {
    throw err
  }
}

copyDir('files')
