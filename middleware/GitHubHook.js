const Hook = require('./Hook')
const verifyHmac = require('../lib/hmac-verify')
const commitToAttachment = require('../lib/commit-to-attachment')

module.exports = class GitHubHook extends Hook {
  constructor(hook) {
    super(hook)
    this.secret = hook.secret
  }

  async process(req, res) {
    try {
      await verifyHmac(req.body, this.secret, req.headers["x-hub-signature"].split("=")[1])
    } catch(e) {
      res.sendStatus(401)
      return
    }

    if(req.headers["x-github-event"] === "push") {
      const body = JSON.parse(req.body)

      this.payload.text = `[${body.pusher.name}](https://github.com/${body.pusher.name}) pushed ${body.commits.length === 1 ? "a commit" : "some commits"} to [${body.repository.full_name}](${body.repository.html_url})`

      this.payload.attachments = body.commits.map(commitToAttachment)

      await this.fire()
    }

    res.sendStatus(200)
  }
}