# Matterhook

Pipe webhooks from other services into your Mattermost server.

![](https://user-images.githubusercontent.com/2646487/53059921-7e816680-346d-11e9-89e2-6b2f9e6540c3.png)

## Supported Services

- GitHub
  - `push` event
- Raygun
  - `NewErrorOccurred` event
  - `ErrorReoccurred` event

### Soon

- New Relic
- Papertrail
- Slack-style webhooks

## Setup

### Global config

Either in a `config.json` or in your environment variables, you can set a `MATTERMOST_HOOK_URL` to be used globally across all hooks. Or you can set up the URL in hooks individually.

### Creating a hook

Hooks live in `hooks.json`. It is an array of hooks you wish to define. Every hook can have these keys:

- `type` - The type of hook this is (what service it connects to)
- `slug` - The slug of the URL that should trigger this hook (e.g. `/hook/the_slug_goes_here`)
- `hookUrl` - **(optional)** The Mattermost webhook URL to ping when this hook is triggered. If not set, it uses the `MATTERMOST_HOOK_URL` that was globally set.
- `username` - **(optional)** The username to post as in Mattermost. If not set, it uses whatever is set in Mattermost.
- `channel` - **(optional)** The channel to post to in Mattermost. If not set, it uses whatever is set in Mattermost.
- `iconUrl` - **(optional)** The icon to use for the bot in Mattermost. If not set, it uses whatever is set in Mattermost.

Specific services can also have additional service-specific config keys.

Here is an example `hooks.json`:

```json
[
  {
    "type": "github",
    "slug": "github",
    "hookUrl": "http://some/other/hook_url",
    "username": "github",
    "iconUrl": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    "channel": "fungineering",
    "secret": "yeet"
  },
  {
    "type": "raygun",
    "slug": "raygun",
    "username": "raygun",
    "iconUrl": "https://hnrddp064o-flywheel.netdna-ssl.com/wp-content/uploads/2016/11/raygun-logo-og.jpg",
    "channel": "errors"
  }
]
```

#### Hook type: `github`

To configure this hook, go to your GitHub repo's settings > Webhooks and add a new one. Configure it like so (options from your `hooks.json` config are in `{braces}`):

- **Payload URL:** `http://your_host/hook/{slug}`
- **Content type:** `application/json`
- **Secret:** `{secret}`

Config keys:

- `secret` - The webhook secret that is set in your webhook settings.

#### Hook type: `raygun`

To configure this hook, go to your Raygun application > Integrations > Webhook > Setup then set the URL to `http://your_host/hook/{slug}`.

The Raygun hook does not have any config options.

## Contributing

You can contribute to this project by adding another hook type or by extending a hook to be able to process other events.

### Creating a hook type

Code for hooks live in the `middleware` directory. Every hook extends the `Hook` class and must implement the constructor and a `process` method. The `process` method is passed a `Request` and `Response`, much like Express middleware. Set your Mattermost message payload in `this.payload`.

Someone probably once said _"an example is worth 1000 documentation pages"_, so here is a very simple webhook that just logs whatever was in the request body to the console and sends a simple text message to Mattermost. See [Mattermost's documentation](https://developers.mattermost.com/integrate/incoming-webhooks/) to learn what you can send in a payload.

```javascript
const Hook = require('./Hook')

class ExampleHook extends Hook {
  constructor(hook) {
    super(hook)
  }

  async process(req, res) {
    console.log(req.body)

    // In here, you can filter out certain event types
    // and construct your Mattermost message payload.
    this.payload.text = "This is a simple message"
    
    // When your payload is constructed, call the `fire()` method
    // to send it to the user-defined Mattermost URL.
    // It is not called automatically.
    await this.fire()

    res.sendStatus(200)
  }
}
```

Also check out the `GitHubHook` and `RaygunHook` for more examples.