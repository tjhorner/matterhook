var config

try {
  config = require('./config.json')
} catch(e) {
  config = process.env
}

const hooks = require('./hooks.json')

const express = require('express')
const request = require('./lib/request-promisified')
const verifyHmac = require('./lib/hmac-verify')
const commitToAttachment = require('./lib/commit-to-attachment')

const GitHubHook = require('./middleware/GitHubHook')
const RaygunHook = require('./middleware/RaygunHook')

const app = express()

const hookTypes = {
  github: GitHubHook,
  raygun: RaygunHook
}

app.use((req, res, next) => {
  req.body = ""

  req.on("data", chunk => { 
    req.body += chunk
  })

  req.on("end", () => {
    next()
  })
})

app.post("/hook/:slug", async (req, res) => {
  const hookRaw = hooks.filter(h => h.slug === req.params.slug)[0]
  
  if(hookRaw && hookTypes[hookRaw.type]) {
    const hook = new hookTypes[hookRaw.type](hookRaw)
    hook.process(req, res)
  } else {
    res.sendStatus(404)
  }
})

app.listen(process.env.PORT || 3000)