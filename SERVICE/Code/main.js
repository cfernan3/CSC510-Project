var Botkit = require('botkit');
var chrono = require('chrono-node');
var fs = require('fs');
var config = require('./modules/config.js')
var standup = require('./modules/standup');
var schedule = require('node-schedule')
var util = require('util')
var report = require('./modules/report.js')
const delay = require('delay');

function StandupConfig(){
  this.startTimeHours = 0;
  this.startTimeMins = 0;
  this.endTimeHours = 0;
  this.endTimeMins = 0;
  this.questions = ["What did you accomplish yesterday?", "What will you work on today",
                    "Is there anything blocking your progress?"];  // should have aleast 1 question
  this.participants = [];  // TODO: makse sure there are no duplicates
  this.reportMedium = "channel";  // default medium is channel
  this.reportChannel = "";
  this.creator = "";
}

var standupConfig = new StandupConfig();

var defaultQuestions = "\t" + standupConfig.questions[0];
for(var i = 1; i < standupConfig.questions.length; i++)
  defaultQuestions += "\n\t" + standupConfig.questions[i];

// TODO: Invoke when stand up is configured.
  var rule = new schedule.RecurrenceRule();                      //Reference:https://www.npmjs.com/package/node-schedule
  //rule.dayOfWeek = [0, new schedule.Range(1, 4)];
  rule.dayOfWeek = [0,1,2,3,4,5,6];
  rule.hour = 22;
  rule.minute = 37;
  //Loading config for mock
  var mock_config = require('./mock_config2.json');
  rule.hour = mock_config["startTimeHours"];
  rule.minute = mock_config['startTimeMins'];
  var participants = mock_config["participants"];
  var reportChannel = mock_config["reportChannel"];
  var questions = mock_config["questions"];

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
function makebot() {
  this.startPrivateConversation = function (user,cb) {

  }
}

var _bot = new makebot();
function trackBot(bot) {
  _bot = bot;
  console.log("bot:" + bot);
}

controller.on('create_bot',function(bot,config) {

  if (false) {
    // already online! do nothing.
  } else {
    bot.startRTM(function(err) {

      if (!err) {
        trackBot(bot);
        console.log("bot:" + bot);
      }

      standupConfig.creator = config.createdBy;
      bot.startPrivateConversation({user: config.createdBy},function(err,convo) {
        if (err) {
          console.log(err);
        } else {
          convo.say("Hello! I'm here to organise your standup. Let me know when you want to schedule one.");
        }
      });

for (var i=0;i< participants.length;i++){
      _bot.startPrivateConversation({user: participants[i]['user_id']},function(err,convo) {
        if (err) {
          console.log(err);
        } else {
          convo.ask( startStandupButtons, function (response, convo) {
            switch (response.text) {
              case "start":
                  var attachment = {text: `:white_check_mark: Awesome! Let's start the standup.`, title: "Select one option."};
                  _bot.replyInteractive(response, {text: "We are starting with the standup.", attachments: [attachment]});
                  var answers = [];

                  for(var i = 0; i < questions.length; i++) {
                    convo.addQuestion(questions[i], function (response, convo) {
                      console.log('Question answered =', response.text);
                      answers.push(response.text);
                      console.log(answers);
                      convo.next();
                    }, {}, 'askQuestion');
                  }

                  convo.addQuestion("We are done with the standup. Do you want to redo?", [
                          {
                              pattern: _bot.utterances.yes,
                              callback: function(response, convo) {
                                standupConfig.questions = [];
                                console.log('Redoing');
                                convo.gotoThread('askQuestion');
                              }
                          },
                          {
                              pattern: _bot.utterances.no,
                              default: true,
                              callback: function(response, convo) {
                                convo.addMessage(" Thanks for your responses! We are done with today's standup.", 'askQuestion');
                                convo.next();
                                // TODO: Remove Reporting from here and trigger it at standup close time.
                                console.log(require('util').inspect(response, { depth: null }));
                                report.postReportToChannel(_bot, {"channel_id":reportChannel,
                                  "user_name":"<@"+response.user+">",
                                  "questions":questions,
                                  "answers":answers});
                              }
                          }
                        ], {}, 'askQuestion');

                  convo.addMessage({text:"Here are your questions.", action:'askQuestion'}, 'default');
                  convo.next();
                break;
              case "snooze":
                var attachment = {text: `:white_check_mark: I will remind you in 15 minutes`, title: "Select one option."};
                _bot.replyInteractive(response, {text: "We are starting with the standup.", attachments: [attachment]});
                console.log("Before delay");
                delay(5000)
                .then(() => {
                  console.log("After Delay");
                  convo.gotoThread('default');
                });
                break;
              case "ignore":
                var attachment = {text: `:white_check_mark: See you tomorrow`, title: "Select one option."};
                _bot.replyInteractive(response, {text: "We are starting with the standup.", attachments: [attachment]});
                convo.next();
                break;
            }
          });
        }
      });
}


/*      //var j = schedule.scheduleJob(rule, function(){
//        for (var i=0;i< participants.length;i++){
          console.log("user: " + participants[0]['user_id']);
            // bot.sendMessage(participants[i]["direct_message_id"],bot.introduceToUser(participants[i]["user_id"]));
            bot.startPrivateConversation({user: config.createdBy},function(err,convo) {
              if (err) {
                console.log(err);
              } else {
                convo.ask(bot.startStandupButtons,
                  function (response, convo) {
                    console.log(response.text);
                  });
              }
            });
        //}
      //});
*/
    });
  }
});

/*
************************ Configuring a new standup**********************************
*/

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

      var endTime = chrono.parseDate(response.text)  // TODO: check that end time > start time
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

      console.log('participants=', response.text);
      config.addParticipants(response.text, standupConfig);
      convo.gotoThread('askQuestionSet');
    }, {}, 'askParticipants');


    convo.addQuestion('Following are the default questions.\n' + defaultQuestions +
    '\nWould you like to give your own question set?', [
      {
          pattern: bot.utterances.yes,
          callback: function(response, convo) {
            standupConfig.questions = [];
            console.log('Default questions not accepted.');
            convo.gotoThread('askNewSet');
          }
      },
      {
          pattern: bot.utterances.no,
          default: true,
          callback: function(response, convo) {
            console.log('Default question set accepted.');
            convo.transitionTo('askReportMedium', 'Ok! We will proceed with the default question set.');
          }
      }
    ], {}, 'askQuestionSet');


    convo.addQuestion('Ok! Give me all the questions, each on a new line, and say DONE to finish.', [
      {
        pattern: 'done',
        callback: function(response, convo) {
          console.log("Finished receiving questions");
          convo.gotoThread('askReportMedium');
        }
      },
      {
        default: true,
        callback: function(response, convo) {
          console.log('questions entered =', response.text);
          config.parseQuestions(response.text, standupConfig);
          convo.silentRepeat();
        }
      }
    ], {}, 'askNewSet');


    convo.addQuestion(config.reportMediumButtons,
    function (response, convo) {
        if(response.text == "email") {
          standupConfig.reportMedium = "email";
          standupConfig.reportChannel = "";
          convo.gotoThread('lastStatement');
        } else {
          standupConfig.reportMedium = "channel";
          convo.addQuestion('Which slack channel do you want to use? E.g. #general', function (response, convo) {
            config.parseReportChannel(response.text, standupConfig);
            convo.gotoThread('lastStatement');
          }, {}, 'askReportMedium');

          convo.next();
        }
    }, {}, 'askReportMedium');


    convo.beforeThread('lastStatement', function(convo, next) {
      console.log('New standup config complete');
      writeToConfigFile();
      next();
    });


    convo.addMessage('Awesome! Your Standup is configured successfully!', 'lastStatement');

  }); // startConversation Ends
}); // hears 'schedule' ends

/*
************************ Show an existing standup configuration***********************
*/
controller.hears(['show', 'display'],['direct_mention', 'direct_message'], function(bot,message) {
  bot.startConversation(message, function(err, convo) {
    convo.say('Let me show you the current configuration...');
    // Start time
    convo.say("Start time: " + standupConfig.startTimeHours + ":" + standupConfig.startTimeMins);
    // End time
    convo.say("End time: " + standupConfig.endTimeHours + ":" + standupConfig.endTimeMins);
    // participants
    convo.say("participants: " + standupConfig.participants.toString());
    // Question set
    convo.say("Question Set: ");
    standupConfig.questions.forEach(function(val) {
      convo.say("    " + val);
    });
    // Reporting medium
    if (standupConfig.reportMedium == "channel") {
      convo.say("Reporting Medium: " + standupConfig.reportMedium + " ("+ standupConfig.reportChannel + ") ");
    } else {
      convo.say("Reporting Medium: " + standupConfig.reportMedium);
    }

  });
});

/*
************************ Editing an existing standup**********************************
*/

controller.hears(['modify', 'change', 'update', 'reschedule'],['direct_mention', 'direct_message'], function(bot,message) {
  // TODO: check that standup exists

  bot.startConversation(message, function(err, convo) {

  // TODO: check that the user is allowed to modify config
    convo.ask(config.modifyStandupButtons,

    function (response, convo) {
      switch (response.text) {
        case "startTime":
          convo.gotoThread('editStartTime');
          break;
        case "endTime":
          convo.gotoThread('editEndTime');
          break;
        case "participants":
          convo.gotoThread('editParticipants');
          break;
        case "questionSet":
          standupConfig.questions = [];
          convo.gotoThread('editQuestionSet');
          break;
        case "reportMedium":
          convo.gotoThread('editReportMedium');
          break;
        default:
          convo.next();
      }
    });

    convo.addQuestion('What time would you like to start the standup?', function (response, convo) {
      console.log('Start time entered =', response.text);

      var startTime = chrono.parseDate(response.text)
      if (startTime != null) {
        standupConfig.startTimeHours = startTime.getHours();
        standupConfig.startTimeMins = startTime.getMinutes();
        console.log("Start time = " + standupConfig.startTimeHours + ":" + standupConfig.startTimeMins);
        convo.addMessage("All set! I have updated the start time to " + standupConfig.startTimeHours +
                          ":" + standupConfig.startTimeMins + ".", 'editStartTime');

        writeToConfigFile();
        convo.next();
      }
      else {
        console.log("Start time not entered correctly");
        convo.transitionTo('editStartTime', "I'm sorry. I didn't understand you. Please give a single time value in a 12 hour clock format.\n\
        You can say things like 10 AM or 12:15pm.");
      }
    }, {}, 'editStartTime');


    convo.addQuestion('When would you like the standup to end?', function (response, convo) {
      console.log('End time entered =', response.text);

      var endTime = chrono.parseDate(response.text)  // TODO: check that end time > start time
      if (endTime != null) {
        standupConfig.endTimeHours = endTime.getHours();
        standupConfig.endTimeMins = endTime.getMinutes();
        console.log("End time = " + standupConfig.endTimeHours + ":" + standupConfig.endTimeMins);
        convo.addMessage("All set! I have updated the end time to " + standupConfig.endTimeHours +
                          ":" + standupConfig.endTimeMins + ".", 'editEndTime');

        writeToConfigFile();
        convo.next();
      }
      else {
        console.log("End time not entered correctly");
        convo.transitionTo('editEndTime', "I'm sorry. I didn't understand you. Please give a single time value in a 12 hour clock format.\n\
        You can say things like 10 AM or 12:15pm.");
      }
    }, {}, 'editEndTime');


    convo.addQuestion(config.modifyUserButtons, function (response, convo) {
      switch (response.text) {
        case "addUsers":  // TODO: let the user know which users were successfully added.
          convo.addQuestion('Who would you like to invite for the standup session?\n You may enter it in the following ways:\n\
                1. list of users: @<user1>, ..., @<userN>\n \
                2. specific user group: @<user-group-name> \n \
                3. specific channel: #<channel-name>', function (response, convo) {
            console.log('participants to add =', response.text);
            config.addParticipants(response.text, standupConfig);
            //console.log(standupConfig.participants);
            convo.addMessage("All set! I have updated the participants", 'editParticipants');
            writeToConfigFile();
            convo.next();
          }, {}, 'editParticipants');
          convo.next();
          break;
        case "removeUsers":
          convo.addQuestion('Who would you like to remove from the standup session?\n You may enter it as a list of users: @<user1>, ..., @<userN>',
          function (response, convo) {
            console.log('participants to remove =', response.text);
            config.removeParticipants(response.text, standupConfig);
            //console.log(standupConfig.participants);
            convo.addMessage("All set! I have updated the participants", 'editParticipants');
            writeToConfigFile();
            convo.next();
          }, {}, 'editParticipants');
          convo.next();
          break;
        default:
          convo.next();
      }
    }, {}, 'editParticipants');


    convo.addQuestion('Ok! Give me all the questions, each on a new line, and say DONE to finish.', [
      {
        pattern: 'done',
        callback: function(response, convo) {
          console.log("Finished receiving questions");
          convo.addMessage("All set! I have updated the standup questions.", 'editQuestionSet');

          writeToConfigFile();
          convo.next();
        }
      },
      {
        default: true,
        callback: function(response, convo) {
          console.log('questions entered =', response.text);
          config.parseQuestions(response.text, standupConfig);
          convo.silentRepeat();
        }
      }
    ], {}, 'editQuestionSet');


    convo.addQuestion(config.reportMediumButtons,
    function (response, convo) {
        if(response.text == "email") {
          standupConfig.reportMedium = "email";
          standupConfig.reportChannel = "";
          convo.addMessage("All set! Standup reports will now be emailed to all participants.", 'editReportMedium');

          writeToConfigFile();
          convo.next();
        } else {
          standupConfig.reportMedium = "channel";
          convo.addQuestion('Which slack channel do you want to use? E.g. #general', function (response, convo) {
            config.parseReportChannel(response.text, standupConfig);
            convo.addMessage("All set! Standup reports will now be posted to your channel.", 'editReportMedium');

            writeToConfigFile();
            convo.next();
          }, {}, 'editReportMedium');

          convo.next();
        }
    }, {}, 'editReportMedium');for (var i=0;i< participants.length;i++){
        bot.sendMessage(participants[i]["direct_message_id"],bot.introduceToUser(participants[i]["user_id"]));
    }


    //bot.sendMessage("D7MDMK081",bot.introduceToUser("U7LJ7GXBN")) //Selenium Test
    //bot.sendMessage("D7JBPKD8B",bot.introduceToUser("U6WEA6ULA"))
    var j = schedule.scheduleJob(rule, function(){

    //console.log('running a task every minute');
      //condoel.log("Test");
      //bot.sendMessage("D7JBPKD8B","Calvin is awesome");
      //bot.sendMessage("D7JBPKD8B","Calvin is awesome");
      //bot.sendMessage("D7LJ7H9U4",bot.introduceToUser("U7LJ7GXBN"))
      //bot.sendMessage("D7JBPKD8B",bot.introduceToUser("U6WEA6ULA"))
    });

  }); // startConversation Ends
}); // hears 'schedule' ends


var writeToConfigFile = function() {
  fs.writeFile('./mock_config.json', JSON.stringify(standupConfig), (err) => {
     if (err) throw err;
   });
}

/*
************************ Help on how to configure a standup**********************************
*/

controller.hears(['help'],['direct_mention', 'direct_message'], function(bot,message) {
  bot.reply(message, config.helpMsg);
}); // hears 'help' ends

/*
************************ standup session **********************************
*/