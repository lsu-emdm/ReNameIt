const express = require('express')
const multer = require('multer')
const childProcess = require('child_process')

var app = express()
var uploads = multer({ dest: 'uploads/' })

// Express middleware (provided for static service)
app.use(express.static('static'))

app.post('/uploads', uploads.any(), (req, res, next) => {
  console.log(`Starting job for audio file ${req.files[0].filename}`)
  const py = childProcess.spawn('python', ['plot_vocal_separation.py', req.files[0].path])
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
