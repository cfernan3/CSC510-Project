var Botkit = require('botkit');

/*
var controller = Botkit.slackbot({
  debug: false
});

// connect the bot to a stream of messages
controller.spawn({
  token: process.env.SLACKTOKEN,
}).startRTM()
*/


var controller = Botkit.slackbot({
  debug: false,
  interactive_replies: true, // tells botkit to send button clicks into conversations
}).configureSlackApp(
  {
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    // Set scopes as needed. https://api.slack.com/docs/oauth-scopes
    scopes: ['bot'],
  }
);

// Setup for the Webserver - REQUIRED FOR INTERACTIVE BUTTONS
controller.setupWebserver(process.env.port,function(err,webserver) {
  controller.createWebhookEndpoints(controller.webserver);

  controller.createOauthEndpoints(controller.webserver,function(err,req,res) {
    if (err) {
      res.status(500).send('ERROR: ' + err);
    } else {
      res.send('Success!');
    }
  });
});

// to make sure we don't connect to the RTM twice for the same team
var _bots = {};
function trackBot(bot) {
  _bots[bot.config.token] = bot;
}

controller.on('create_bot',function(bot,config) {

  if (_bots[bot.config.token]) {
    // already online! do nothing.
  } else {
    bot.startRTM(function(err) {

      if (!err) {
        trackBot(bot);
      }

      bot.startPrivateConversation({user: config.createdBy},function(err,convo) {
        if (err) {
          console.log(err);
        } else {
          convo.say('I am a bot that has just joined your team');
        }
      });

    });
  }

});

controller.hears(['schedule', 'setup'],['direct_mention', 'direct_message'], function(bot,message) {
  bot.startConversation(message, function(err, convo) {


    convo.ask({
        attachments:[
            {
                title: 'Do you want to proceed?',
                callback_id: '123',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"yes",
                        "text": "Yes",
                        "value": "yes",
                        "type": "button",
                    },
                    {
                        "name":"no",
                        "text": "No",
                        "value": "no",
                        "type": "button",
                    }
                ]
            }
        ]
    },[
        {
            pattern: "yes",
            callback: function(reply, convo) {
                console.log("button yes clicked");
                convo.say('FABULOUS!');
                convo.next();
                // do something awesome here.
            }
        },
        {
            pattern: "no",
            callback: function(reply, convo) {
                console.log("button no clicked");
                convo.say('Too bad');
                convo.next();
            }
        },
        {
            default: true,
            callback: function(reply, convo) {
                console.log("wooops");
                // do nothing
            }
        }
    ]);











    convo.ask('Let\'s begin configuring a new standup.\n What time would you like to start the standup?', function (response, convo) {
      var startTime = response.text;
      console.log('startTime=', startTime);
      convo.next();
    });

    convo.ask('When would you like the standup to end?', function (response, convo) {
      var endTime = response.text;
      console.log('endTime=', endTime);
      convo.next();
    });

    // TODO: Mix and match
    convo.ask('Who would you like to invite for the standup session?\n You may enter it in the following ways:\n\
          1. list of users: @<user1>, ..., @<userN>\n \
          2. specific user group: @<user-group-name> \n \
          3. specific channel: #<channel-name>\n \
          4. all users from the slack group: all', function (response, convo) {
      var participants = response.text;
      console.log('participants=', participants);

      convo.next();
    });

    // TODO: How to know when all questions are done?
    convo.ask('Following are the default questions.\n Would you like to give your own question set?', [
      {
          pattern: bot.utterances.yes,
          callback: function(response, convo) {
            console.log('Entered the yes utterance');
            convo.gotoThread('askNewSet');
            }
            // convo.next();
      },
      {
          pattern: bot.utterances.no,
          default: true,
          callback: function(response, convo) {
              console.log('Ok! We will proceed with the default question set.');
              convo.transitionTo('continueQuestions', 'Ok! We will proceed with the default question set.');
          }
      }
    ]);

    console.log('Asking the new set');
    convo.addQuestion('Ok! Give me all the questions and say DONE to finish!!', [
      {
        pattern: 'done',
        callback: function(response, convo) {
          console.log("Finished receiving questions");
          convo.gotoThread('continueQuestions');
        }
      },
      {
        default: true,
        callback: function(response, convo) {
          var str = response.text;
          console.log('str=', str);
          convo.silentRepeat();
          // convo.next();
        }
      }
    ], {}, 'askNewSet');

    convo.addQuestion('Do you wish to post the report to a slack Channel?', [
      {
        pattern: bot.utterances.yes,
        callback: function(response, convo) {
          convo.gotoThread('channelQuestion');
        }
      },
      {
        pattern: bot.utterances.no,
        default: true,
        callback: function(response, convo) {
          convo.gotoThread('lastStatement');
        }
      }
    ], {}, 'continueQuestions');

    convo.addQuestion('Enter the slack Channel.', function (response, convo) {
      var channel = response.text;
      console.log('channel= ', channel);
      convo.gotoThread('lastStatement');
    }, {}, 'channelQuestion');

    convo.addMessage('Awesome! Your Standup is configured successfully!', 'lastStatement');
    console.log('I\'m out');
    // convo.say('I\'m out');
  }); // startConversation Ends

}); // hears 'schedule' ends
