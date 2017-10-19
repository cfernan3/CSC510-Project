var Botkit = require('botkit');

var controller = Botkit.slackbot({
  debug: false
});

// connect the bot to a stream of messages
controller.spawn({
  token: process.env.SLACKTOKEN,
}).startRTM()

controller.hears(['schedule', 'setup'],['direct_mention', 'direct_message'], function(bot,message) {
  bot.startConversation(message, function(err, convo) {
    //
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
