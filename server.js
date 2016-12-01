const express = require('express')
const multer = require('multer')
const childProcess = require('child_process')
const fs = require('fs')
const mongo = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/renotate'
const ObjectId = require('mongodb').ObjectId

var app = express()
var uploads = multer({ dest: 'uploads/' })

// TODO: Socket to submit job and send back message
// TODO: PlayerUI with waveform
// TODO: Sonic annotator

// Express middleware (provided for static service)
app.use(express.static('static'))
// Also serve the node_modules folder
app.use(express.static('node_modules'))

// Provide access to uploaded files
app.use("/uploads", express.static('uploads'))
//TODO: BAD
app.use("/foregrounds", express.static('foregrounds'))
app.use("/backgrounds", express.static('backgrounds'))

// Route all hits at /jobs/:jobid to serve the job template
// TODO: organize HTTP requests for data and for html files to use different endpoints
app.get("/jobs/:jobid", (req, res) => {
  res.sendFile("static/job_wrapper.html", {root: __dirname})
})

app.post('/uploads', uploads.any(), (req, res, next) => {
  // Prepare file structure
  // TODO: name files <human identifier>_randomstring
  const path = "uploads/"+req.files[0].originalname+'_'+req.files[0].filename
  // Log this job in the database
  // TODO: duplicate detection
  mongo.connect(url, (err, db) => {
    if(err) {
      console.log("error connecting to mongo")
      db.close()
      return
    }
    db.collection('jobs').insertOne({
      multer_id: req.files[0].filename,
      name: req.files[0].originalname,
      // if the filename is different from the job's name
      file: path,
      sourcesep: false
    }, (err, r) => {
      db.close()
      res.send("Job saved with id: "+r.insertedId+" <a href=\"jobs/"+r.insertedId+"\">Link</a>")
    })
  })
  fs.renameSync(req.files[0].path, path)
  const py = childProcess.spawn('python', ['vocal_separation_test.py', req.files[0].originalname+'_'+req.files[0].filename])
  py.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })
  py.stderr.on('data', (data) => {
    // TODO: store error state
    console.log(`stderr: ${data}`)
  })
  py.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
    mongo.connect(url, (err, db) => {
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
})

// TODO: scan directory for all submitted jobs and send a JSON array back
app.get('/alljobs', (req, res) => {
  // send back array containing the list of jobs submitted
  mongo.connect(url, (err, db) => {
    db.collection('jobs').find().toArray((err, docs) => {
      res.send(docs)
      db.close()
    })
  })
})

app.get('/jobd/:jobid', (req,res) => {
  mongo.connect(url, (err, db) => {
    db.collection('jobs').findOne({_id: ObjectId(req.params.jobid)}, {}, (error, result) => {
      res.send(result)
    })
    db.close()
  })
})

// TODO: send job information per job

app.listen(8080, () => {
  console.log("Webserver started at port 8080")
})
