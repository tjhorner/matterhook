var config

try {
  config = require('./config.json')
} catch(e) {
  config = process.env
}

const express = require('express')
const bodyParser = require('body-parser')
const request = require('./lib/request-promisified')
const verifyHmac = require('./lib/hmac-verify')
const commitToAttachment = require('./lib/commit-to-attachment')

const app = express()

app.use((req, res, next) => {
  req.body = ""

  req.on("data", chunk => { 
    req.body += chunk
  })

  req.on("end", () => {
    next()
  })
})

app.post("/hook", async (req, res) => {
  try {
    await verifyHmac(req.body, config.GITHUB_WEBHOOK_SECRET, req.headers["x-hub-signature"].split("=")[1])
  } catch(e) {
    res.sendStatus(401)
    return
  }

  req.body = JSON.parse(req.body)

  var response = { }

  response.text = `[${req.body.pusher.name}](https://github.com/${req.body.pusher.name}) pushed ${req.body.commits.length === 1 ? "a commit" : "some commits"} to [${req.body.repository.full_name}](${req.body.repository.html_url})`

  response.attachments = req.body.commits.map(commitToAttachment)

  await request(config.MATTERMOST_HOOK_URL, {
    method: "post",
    json: true,
    body: response
  })

  res.sendStatus(200)
})

app.listen(process.env.PORT || 3000)