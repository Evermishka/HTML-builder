const path = require('path')
const fs = require('fs')
const fsPromises = fs.promises

function makeDist() {
  fs.mkdir(path.join(__dirname, `project-dist`), { recursive: true }, (err) => {
    if (err) throw err
  })
}

async function createIndex() {
  const components = await fsPromises.readdir(
    path.join(__dirname, 'components')
  )
  let index = await fsPromises.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8',
    (err) => {
      if (err) throw err
    }
  )
  for (const component of components) {
    const componentPath = path.join(__dirname, 'components', component)
    const componentName = path
      .basename(componentPath)
      .replace(path.extname(componentPath), '')
    const componentText = await fsPromises.readFile(
      componentPath,
      'utf-8',
      (err) => {
        if (err) throw err
      }
    )
    index = index.replace(`{{${componentName}}}`, componentText)
  }
  fs.writeFile(
    path.join(__dirname, 'project-dist', 'index.html'),
    index,
    (err) => {
      if (err) throw err
    }
  )
}

async function mergeStyles() {
  try {
    const bundle = path.join(__dirname, 'project-dist/style.css')
    fs.writeFile(bundle, '', (err) => {
      if (err) throw err
    })
    const files = await fsPromises.readdir(path.join(__dirname, 'styles'), {
      withFileTypes: true,
    })
    const styles = files.filter((file) => !file.isDirectory())
    for (const style of styles) {
      const stylePath = path.join(__dirname, 'styles', style.name)
      const styleExt = path.extname(stylePath)
      if (styleExt === '.css') {
        const readbleStream = fs.createReadStream(stylePath, 'utf-8')
        readbleStream.on('data', (data) => {
          fs.appendFile(bundle, `${data}\n\n`, (err) => {
            if (err) throw err
          })
        })
      }
    }
  } catch (err) {
    throw err
  }
}

async function clearCopy(dir) {
  try {
    const filesCopy = await fsPromises.readdir(
      path.join(__dirname, `project-dist`, dir),
      {
        withFileTypes: true,
      }
    )
    for (const file of filesCopy) {
      if (file.isDirectory()) {
        clearCopy(path.join(dir, file.name))
      } else {
        fs.unlink(
          path.join(__dirname, `project-dist`, dir, file.name),
          (err) => {
            if (err) throw err
          }
        )
      }
    }
  } catch (err) {
    throw err
  }
}

async function makeCopy(dir) {
  try {
    fs.mkdir(
      path.join(__dirname, `project-dist`, dir),
      { recursive: true },
      (err) => {
        if (err) throw err
      }
    )
    const files = await fsPromises.readdir(path.join(__dirname, dir), {
      withFileTypes: true,
    })

    for (const file of files) {
      if (file.isDirectory()) {
        makeCopy(path.join(dir, file.name))
      } else {
        const srcPath = path.join(__dirname, dir, file.name)
        const destPath = path.join(__dirname, `project-dist`, dir, file.name)
        fs.copyFile(srcPath, destPath, (err) => {
          if (err) throw err
        })
      }
    }
  } catch (err) {
    throw err
  }
}

function copyAssets() {
  try {
    fs.access(path.join(__dirname, `project-dist`, 'assets'), (err) => {
      if (err) {
        makeCopy('assets')
      } else {
        clearCopy('assets')
        makeCopy('assets')
      }
    })
  } catch (err) {
    throw err
  }
}

function buildPage() {
  makeDist()
  createIndex()
  mergeStyles()
  copyAssets()
}

buildPage()
