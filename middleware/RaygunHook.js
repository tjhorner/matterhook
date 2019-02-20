const Hook = require('./Hook')

module.exports = class RaygunHook extends Hook {
  constructor(hook) {
    super(hook)
  }

  async process(req, res) {
    const body = JSON.parse(req.body)

    const handledEventTypes = [
      "NewErrorOccurred",
      "ErrorReoccurred"
    ]

    if(body.event === "error_notification" && handledEventTypes.includes(body.eventType)) {
      this.payload.text = `Error from ${body.application.name}: ${body.error.message}`

      this.payload.attachments = [
        {
          fallback: body.error.message,
          author_name: body.application.name,
          author_link: body.application.url,
          title: body.eventType === "NewErrorOccurred" ? "New error occurred!" : "Old error reoccurred!",
          title_link: body.error.url,
          text: body.error.message,
          fields: [
            {
              title: "Affected Users",
              value: body.error.usersAffected,
              short: true
            },
            {
              title: "Total occurrences",
              value: body.error.totalOccurrences,
              short: true
            },
            {
              title: "Tags",
              value: body.error.instance.tags.length === 0 ? "_(none)_" : body.error.instance.tags.join(", "),
              short: false
            }
          ]
        }
      ]

      await this.fire()
    }

    res.sendStatus(200)
  }
}