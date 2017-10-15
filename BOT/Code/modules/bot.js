const { WebClient } = require('@slack/client');

const slackClientOptions = {};
if (process.env.SLACK_ENV) {
  slackClientOptions.slackAPIUrl = process.env.SLACK_ENV;
}

const bot = {
  web: new WebClient(process.env.SLACK_BOT_TOKEN, slackClientOptions),
  orders: {},

  introduceToUser(userId) {
    this.web.im.open(userId)
      .then(resp => this.web.chat.postMessage(resp.channel.id, 'Good Morning.', {
        attachments: [
          {
            color: '#5A352D',
            title: 'We are starting with the standup\n',
            callback_id: 'standup:start',
            actions: [
              {
                name: 'Start',
                text: 'Start',
                type: 'button',
                value: 'standup:start',
              },
              {
                name: 'Snooze',
                text: 'Snooze',
                type: 'button',
                value: 'standup:snooze',
              },
              {
                name: 'Ignore',
                text: 'Ignore',
                type: 'button',
                value: 'standup:ignore',
              },
            ],
          },
        ],
      }))
      .catch(console.error);
  },
    handleDirectMessage(message) {
      this.introduceToUser(message.user);
  },
}
module.exports = bot;