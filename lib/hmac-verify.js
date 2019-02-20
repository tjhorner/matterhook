const crypto = require('crypto')

module.exports = (message, key, signature) => {
  return new Promise((resolve, reject) => {
    const hmac = crypto.createHmac("sha1", key)

    hmac.on("readable", () => {
      const digest = hmac.read().toString("hex")

      if(signature === digest)
        resolve()
      else
        reject()
    })

    hmac.write(message)
    hmac.end()
  })
}