const express = require('express')
const multer = require('multer')
const childProcess = require('child_process')
const fs = require('fs')

var app = express()
var uploads = multer({ dest: 'uploads/' })

// Express middleware (provided for static service)
app.use(express.static('static'))
// Also serve the node_modules folder
app.use(express.static('node_modules'))

//please remove
app.use(express.static('uploads'))

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

// TODO: scan directory for all submitted jobs and send a JSON array back
app.get('/jobs', (req, res) => {
  // send back array containing the list of jobs submitted
  res.send(fs.readdirSync('uploads'))
})

// TODO: send job information per job

app.listen(8080, () => {
  console.log("Webserver started at port 8080")
})
