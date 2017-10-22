var Botkit = require('botkit');
var chrono = require('chrono-node');
var fs = require('fs');

function StandupConfig(){
  this.startTimeHours = 0;
  this.startTimeMins = 0;
  this.endTimeHours = 0;
  this.endTimeMins = 0;
  this.questions = ["What did you accomplish yesterday?", "What will you work on today",
                    "Is there anything blocking your progress?"];  // should have aleast 1 question
  this.participants = [];
  this.reportMedium = "channel";  // default medium is channel
  this.reportChannel = "";
}

var standupConfig = new StandupConfig();

var defaultQuestions = "\t" + standupConfig.questions[0];
for(var i = 1; i < standupConfig.questions.length; i++)
  defaultQuestions += "\n\t" + standupConfig.questions[i];

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
          convo.say("Hello! I'm here to organise your standup. Let me know when you want to schedule one.");
        }
      });
    });
  }
});

controller.hears(['schedule', 'setup'],['direct_mention', 'direct_message'], function(bot,message) {
  bot.startConversation(message, function(err, convo) {

    convo.addMessage({text:"Let's begin configuring a new standup.", action:'askStartTime'}, 'default');

    convo.addQuestion('What time would you like to start the standup?', function (response, convo) {
      console.log('Start time entered =', response.text);

      var startTime = chrono.parseDate(response.text)
      if (startTime != null) {
        standupConfig.startTimeHours = startTime.getHours();
        standupConfig.startTimeMins = startTime.getMinutes();
        console.log("Start time = " + standupConfig.startTimeHours + ":" + standupConfig.startTimeMins);
        convo.gotoThread('askEndTime');
      }
      else {
        console.log("Start time not entered correctly");
        convo.transitionTo('askStartTime', "I'm sorry. I didn't understand you. Please give a single time value in a 12 hour clock format.\n\
        You can say things like 10 AM or 12:15pm.");
      }
    }, {}, 'askStartTime');


    convo.addQuestion('When would you like the standup to end?', function (response, convo) {
      console.log('End time entered =', response.text);

      var endTime = chrono.parseDate(response.text)
      if (endTime != null) {
        standupConfig.endTimeHours = endTime.getHours();
        standupConfig.endTimeMins = endTime.getMinutes();
        console.log("End time = " + standupConfig.endTimeHours + ":" + standupConfig.endTimeMins);
        convo.gotoThread('askParticipants');
      }
      else {
        console.log("End time not entered correctly");
        convo.transitionTo('askEndTime', "I'm sorry. I didn't understand you. Please give a single time value in a 12 hour clock format.\n\
        You can say things like 10 AM or 12:15pm.");
      }
    }, {}, 'askEndTime');


    convo.addQuestion('Who would you like to invite for the standup session?\n You may enter it in the following ways:\n\
          1. list of users: @<user1>, ..., @<userN>\n \
          2. specific user group: @<user-group-name> \n \
          3. specific channel: #<channel-name>', function (response, convo) {
      var participants = response.text;
      console.log('participants=', participants);

      var reg = /<(.*?)>/g;
      var result;
      var objUsers = JSON.parse(fs.readFileSync('mock_users.json', 'utf8'));

      while((result = reg.exec(participants)) !== null) {
          if (result[1].charAt(0) == '@') { // This is a user
            for (key in objUsers.users) {
              if (objUsers.users[key] == result[1].substr(1)) {
                console.log("Found user ", result[1]);
                // Add this user to the json file.
                standupConfig.participants.push(result[1].substr(1));
                console.log("Adding ", (result[1].substr(1)));
                break;
              }
            }
          } else if (result[1].charAt(0) == '#') { // This is a channel
            for (key in objUsers.channels) {
              var channel_key = Object.keys(objUsers.channels[key])[0];
              var channel_id = result[1].substr(1,9);
              if (channel_key == channel_id) {
                // Add all users to the json file.
                console.log("Found channel ", channel_id);
                for (i in (objUsers.channels[key])[channel_id]) {
                  standupConfig.participants.push((objUsers.channels[key])[channel_id][i]);
                  console.log("Adding ", ((objUsers.channels[key])[channel_id][i]));
                }
                break;
              }
            }
          }
      }

      convo.gotoThread('askQuestionSet');
    }, {}, 'askParticipants');


    convo.addQuestion('Following are the default questions.\n' + defaultQuestions +
    '\nWould you like to give your own question set?', [
      {
          pattern: bot.utterances.yes,
          callback: function(response, convo) {
            standupConfig.questions = [];
            console.log('Default questions not accepted');
            convo.gotoThread('askNewSet');
          }
      },
      {
          pattern: bot.utterances.no,
          default: true,
          callback: function(response, convo) {
            console.log('Ok! We will proceed with the default question set.');
            convo.transitionTo('continueQuestions', 'Ok! We will proceed with the default question set.');
          }
      }
    ], {}, 'askQuestionSet');


    convo.addQuestion('Ok! Give me all the questions, each on a new line, and say DONE to finish.', [
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
          console.log('questions entered =', response.text);
          var questions = response.text.split('\n');
          for(var i = 0; i < questions.length; i++)
            standupConfig.questions.push(questions[i]);
          convo.silentRepeat();
        }
      }
    ], {}, 'askNewSet');


    convo.addQuestion({
    attachments:[
        {
            pretext: "How do you want to share the standup report with others?",
            title: "Select one option.",
            callback_id: '123',
            attachment_type: 'default',
            actions: [
                {
                    "name":"email",
                    "text": "Email",
                    "value": "email",
                    "type": "button",
                },
                {
                    "name":"channel",
                    "text": "Slack channel",
                    "value": "channel",
                    "type": "button",
                }
            ]
        }
    ]},

    function (response, convo) {
        if(response.text == "email") {
          standupConfig.reportMedium = "email";
          convo.gotoThread('lastStatement');
        } else {
          convo.gotoThread('channelQuestion');
        }
    }, {}, 'continueQuestions');


    convo.addQuestion('Which slack channel do you want to use? E.g. #general', function (response, convo) {
      // TODO: check if the given channel is a valid channel
      var chan = response.text;
      var i = chan.indexOf('#');
      if(i != -1) {  // TODO: handle else
        standupConfig.reportChannel = chan.substr(i).split('|')[0];
        console.log('channel = ', standupConfig.reportChannel);
      }
      convo.gotoThread('lastStatement');
    }, {}, 'channelQuestion');

    convo.beforeThread('lastStatement', function(convo, next) {
      console.log('New standup config complete');
      fs.writeFile('./mock_config.json', JSON.stringify(standupConfig), (err) => {
         if (err) throw err;
       });
      next();
    });

    convo.addMessage('Awesome! Your Standup is configured successfully!', 'lastStatement');

  }); // startConversation Ends
}); // hears 'schedule' ends
