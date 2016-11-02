const express = require('express')
const multer = require('multer')
const childProcess = require('child_process')
const fs = require('fs')
const mongo = require('mongodb').MongoClient
const dburl = 'mongodb://localhost:27017/renotate'

var app = express()
var uploads = multer({ dest: 'uploads/' })

// Express middleware (provided for static service)
app.use(express.static('static'))
// Also serve the node_modules folder
app.use(express.static('node_modules'))

// Provide access to uploaded files
app.use(express.static('uploads'))

app.post('/uploads', uploads.any(), (req, res, next) => {
  // Prepare file structure
  // TODO: name files <human identifier>_randomstring
  const path = req.files[0].originalname+'_'+req.files[0].filename;
  fs.renameSync(req.files[0].path, path)
  const py = childProcess.spawn('python', ['vocal_separation_test.py', path])
  py.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })
  py.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`)
  })
  py.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
    MongoClient.connect(url, (err, db) => {
      if(err) {
        console.log("error connecting to mongo")
        db.close()
        return
      }
      db.collection('jobs').updateOne({
        multer_id: req.files[0].filename
      }, {
        $set: {sourcesep: true, sourcesep_exit: code}
      }, null, (err, r) => {
        db.close()
      })
    })
  })

  // Log this job in the database
  // TODO: duplicate detection
  // TODO: possible authentication?
  MongoClient.connect(url, (err, db) => {
    if(err) {
      console.log("error connecting to mongo")
      db.close()
      return
    }
    db.collection('jobs').insertOne({
      multer_id: req.files[0].filename,
      name: req.files[0].originalname,
      // if the filename is different from the job's name
      file: req.files[0].originalname+'_'+multer_id,
      sourcesep: false
    }, (err, r) => {
      db.close()
    })
  })
})

// TODO: scan directory for all submitted jobs and send a JSON array back
app.get('/jobs', (req, res) => {
  // send back array containing the list of jobs submitted
  MongoClient.connect(url, (err, db) => {
    db.collection('jobs').find().toArray((err, docs) => {
      res.send(docs)
      db.close()
    })
  })
})

// TODO: send job information per job

app.listen(8080, () => {
  console.log("Webserver started at port 8080")
})
