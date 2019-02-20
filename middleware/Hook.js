var config

try {
  config = require('../config.json')
} catch(e) {
  config = process.env
}

const request = require('../lib/request-promisified')

module.exports = class Hook {
  constructor(hook) {
    this.hookUrl = hook.hookUrl || config.MATTERMOST_HOOK_URL
    this.payload = { }

    if(hook.channel) this.payload.channel = hook.channel
    if(hook.username) this.payload.username = hook.username
    if(hook.iconUrl) this.payload.hook_url = hook.iconUrl
  }

  async fire() {
    return await request(this.hookUrl, {
      method: "post",
      json: true,
      body: this.payload
    })
  }
}