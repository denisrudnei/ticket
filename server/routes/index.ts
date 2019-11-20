import fs from 'fs'
import path from 'path'
const router = require('express').Router()

const folder = path.resolve(__dirname)

fs.readdirSync(folder).forEach((file: string) => {
  import(path.join(folder, file)).then(m => {
    console.log(m)
    if (!file.includes('.js')) {
      Object.keys(m).forEach(innerModule => {
        if (innerModule !== 'index.js') {
          router.use(m[innerModule])
        }
      })
    }
    if (file !== 'index.js' && file.includes('.js')) router.use(m) 
  })
})

export default router
