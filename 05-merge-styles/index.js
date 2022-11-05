const path = require('path')
const fs = require('fs')
const fsPromisess = fs.promises

async function mergeStyles() {
  try {    
    const bundle = path.join(__dirname, 'project-dist/bundle.css')
    fs.writeFile(bundle, '', (err) => {
      if (err) throw err
    }) 
    const files = await fsPromisess.readdir(path.join(__dirname, 'styles'), {
      withFileTypes: true,
    })
    const styles = files.filter((file) => !file.isDirectory())
    for (const style of styles) {
      const stylePath = path.join(__dirname, 'styles', style.name)
      const styleExt = path.extname(stylePath)
      if (styleExt === '.css') {
        const readbleStream = fs.createReadStream(
          stylePath,
          'utf-8'
        )
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

mergeStyles()