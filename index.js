const express = require('express')
const multer = require('multer')
const childProcess = require('child_process')
const fs = require('fs')

var app = express()
var uploads = multer({ dest: 'uploads/' })

// Express middleware (provided for static service)
app.use(express.static('static'))

app.post('/uploads', uploads.any(), (req, res, next) => {
  // Prepare file structure
  const dirname = 'uploads/'+req.files[0].originalname+'/'
  fs.mkdirSync(dirname)
  const path = dirname+req.files[0].originalname
  fs.renameSync(req.files[0].path, path)
  const py = childProcess.spawn('python', ['vocal_separation_test.py', dirname, path])
  py.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })
  py.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`)
  })
  py.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
  })
})

app.listen(8080, () => {
  console.log("Webserver started at port 8080")
})
