

/*
#########################################################
                      References
https://github.com/slackapi/sample-message-menus-node
https://api.slack.com/
https://docs.npmjs.com/files/package.json
#########################################################
*/
require('dotenv').config();

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const normalizePort = require('normalize-port');
const delay = require('delay');

const slackEventsAPI = require('@slack/events-api');
const slackInteractiveMessages = require('@slack/interactive-messages');

const cloneDeep = require('lodash.clonedeep');
const bot = require('./modules/bot');
//var sched = require('node-cron');
//var sleep = require('sleep');
var schedule = require('node-schedule')
var Botkit = require('botkit')

// --- Slack Events ---
const slackEvents = slackEventsAPI.createSlackEventAdapter(process.env.SLACK_VERIFICATION_TOKEN);
/* Not needed for now
slackEvents.on('team_join', (event) => {
  bot.introduceToUser(event.user.id);
});
*/

var controller = Botkit.slackbot({
  debug: true,
});
var bkit = controller.spawn({
  token: process.env.SLACK_BOT_TOKEN,
}).startRTM();


// Scheduling code created
//sched.schedule(' * * * *',function(){
//var j = schedule.scheduleJob('* * * * *', function()  {
var rule = new schedule.RecurrenceRule();                      //Reference:https://www.npmjs.com/package/node-schedule
//rule.dayOfWeek = [0, new schedule.Range(1, 4)];
rule.dayOfWeek = [0,1,2,3,4,5,6];
rule.hour = 04;
rule.minute = 27;

var j = schedule.scheduleJob(rule, function(){



//console.log('running a task every minute');
  //condoel.log("Test");
  //bot.sendMessage("D7JBPKD8B","Calvin is awesome");
  //bot.sendMessage("D7JBPKD8B","Calvin is awesome");
  bot.sendMessage("D7LJ7H9U4",bot.introduceToUser("U7LJ7GXBN"))
  bot.sendMessage("D7JBPKD8B",bot.introduceToUser("U6WEA6ULA"))
});
/*
//------Replace by scheduling code------
slackEvents.on('message', (event) => {
  console.log("Event Received");
  // Filter out messages from this bot itself or updates to messages
  if (event.subtype === 'bot_message' || event.subtype === 'message_changed') {
    return;
  }
  bot.handleDirectMessage(event);
});
*/



// --- Slack Interactive Messages ---
const slackMessages =
  slackInteractiveMessages.createMessageAdapter(process.env.SLACK_VERIFICATION_TOKEN);

// Helper functions

function findAttachment(message, actionCallbackId) {
  return message.attachments.find(a => a.callback_id === actionCallbackId);
}

function acknowledgeActionFromMessage(originalMessage, actionCallbackId, ackText) {
  const message = cloneDeep(originalMessage);
  const attachment = findAttachment(message, actionCallbackId);
  delete attachment.actions;
  attachment.text = `:white_check_mark: ${ackText}`;
  return message;
}

function findSelectedOption(originalMessage, actionCallbackId, selectedValue) {
  const attachment = findAttachment(originalMessage, actionCallbackId);
  return attachment.actions[0].options.find(o => o.value === selectedValue);
}

// --- Bot QnA ---

function question1(payload){

 var message = { type: 'direct_message',
  channel: 'D7MSLM35H',
  user: 'U74535JLB',
  text: 'hello',
  ts: '1508794897.000490',
  source_team: 'T6XGVUQB1',
  team: 'T6XGVUQB1',
  raw_message:
   { type: 'message',
     channel: 'D7MSLM35H',
     user: 'U74535JLB',
     text: 'hello',
     ts: '1508794897.000490',
     source_team: 'T6XGVUQB1',
     team: 'T6XGVUQB1' },
  _pipeline: { stage: 'receive' }};
  if(payload=={}){
    payload = message
}

  bkit.startPrivateConversation(payload, function(err, convo) {
    var standupQuestions = ["What is your name?","Where do you live?","What do you do for living?"];
    var responseAnswers = {};
    convo.addMessage({text:standupQuestions[0], action:'askFirstQue'}, 'default');
    convo.addQuestion(standupQuestions[0], function (response, convo) {
      console.log('First question answered =', response.text);

      var answer = response.text;
      if (answer != null) {
        responseAnswers[standupQuestions[0]] = answer;
        console.log(`${standupQuestions[0]}:${answer}`);
        convo.gotoThread('askSecondQue');
      }
      else {
        console.log("Question not entered correctly");
        convo.transitionTo('askFirstQue', "I'm sorry. I didn't understand you. Please give a proper answer.");
      }
  }, {}, 'askFirstQue');


    convo.addMessage({text:standupQuestions[1], action:'askSecondQue'}, 'default');

    convo.addQuestion(standupQuestions[1], function (response, convo) {
      console.log('Second question answered =', response.text);

      var answer = response.text;
      if (answer != null) {
        responseAnswers[standupQuestions[1]] = answer;
        console.log(`${standupQuestions[1]}:${answer}`);
        convo.gotoThread('askThirdQue');
      }
      else {
        console.log("Question not entered correctly");
        convo.transitionTo('askSecondQue', "I'm sorry. I didn't understand you. Please give a proper answer.");
      }
    }, {}, 'askSecondQue');


    convo.addMessage({text:standupQuestions[2], action:'askThirdQue'}, 'default');

    convo.addQuestion(standupQuestions[1], function (response, convo) {
      console.log('Third question answered =', response.text);

      var answer = response.text;
      if (answer != null) {
        responseAnswers[standupQuestions[1]] = answer;
        console.log(`${standupQuestions[1]}:${answer}`);
        convo.gotoThread('askThirdQue');
      }
      else {
        console.log("Question not entered correctly");
        convo.transitionTo('askThirdQue', "I'm sorry. I didn't understand you. Please give a proper answer.");
      }
    }, {}, 'askThirdQue');


  convo.beforeThread('lastStatement', function(convo) {
      console.log('Standup complete');
    });

    convo.addMessage('Awesome! Your Standup is complete!', 'lastStatement');

  }); // startConversation Ends
}



// Action handling

slackMessages.action('standup:start', (payload, respond) => {
  // Create an updated message that acknowledges the user's action (even if the result of that
  // action is not yet complete).
  var optionName = payload.actions[0].name;
  //console.log(optionName);
  console.log(payload);
  const channel = payload.channel.id;
  //console.log(payload.channel);

  if (optionName=="Start")
  {
    var updatedMessage = acknowledgeActionFromMessage(payload.original_message, 'standup:start',
                                                      'I\'m getting the standup started.');
    question1(payload);
  }
   else if (optionName=="Snooze")
  {
      var updatedMessage = acknowledgeActionFromMessage(payload.original_message, 'standup:start',
                                                      'I will remind you in 15 minutes');
  delay(6000)         //While deploying change t0 900000
  .then(() => {
      //console.log("Test")
      bot.sendMessage(channel,bot.introduceToUser(payload.user[0].id))
  });
  }
   else
  {
      var updatedMessage = acknowledgeActionFromMessage(payload.original_message, 'standup:start',
                                                      'See you tomorrow');
  }
  console.log("\n Updated Message \n")
  console.log(updatedMessage);
  return updatedMessage;
});

// Create the server to listen for events
const port = normalizePort(process.env.PORT || '3000');
const app = express();
app.use(bodyParser.json());
app.use('/slack/events', slackEvents.expressMiddleware());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/slack/actions', slackMessages.expressMiddleware());
// Start the server
http.createServer(app).listen(port, () => {
  console.log(`server listening on port ${port}`);
});

bot.sendReport({"channel_id":"C7HTHUL3B","user_id":"C7HTHUL3B","standup":{"Who came first?":"Nobody! Both were sleeping."}});
var controller = Botkit.slackbot({
  debug: true,
});
var bkit = controller.spawn({
  token: process.env.SLACK_API_TOKEN,
}).startRTM();
      }
    }, {}, 'askSecondQue');


    convo.addMessage({text:standupQuestions[2], action:'askThirdQue'}, 'default');

    convo.addQuestion(standupQuestions[1], function (response, convo) {
      console.log('Third question answered =', response.text);

      var answer = response.text;
      if (answer != null) {
        responseAnswers[standupQuestions[2]] = answer;
        console.log(`${standupQuestions[2]}:${answer}`);
        convo.gotoThread('lastStatement');
      }
      else {
        console.log("Question not entered correctly");
        convo.transitionTo('askThirdQue', "I'm sorry. I didn't understand you. Please give a proper answer.");
      }
    }, {}, 'askThirdQue');


  convo.beforeThread('lastStatement', function(convo) {
      console.log('Standup complete');
    });

    convo.addMessage('Awesome! Your Standup is complete!', 'lastStatement');

  }); // startConversation Ends
}



// Action handling

slackMessages.action('standup:start', (payload, respond) => {
  // Create an updated message that acknowledges the user's action (even if the result of that
  // action is not yet complete).
  var optionName = payload.actions[0].name;
  //console.log(optionName);
  console.log(payload);
  const channel = payload.channel.id;
  //console.log(payload.channel);

  if (optionName=="Start")
  {
    var updatedMessage = acknowledgeActionFromMessage(payload.original_message, 'standup:start',
                                                      'I\'m getting the standup started.');
    question1(payload);
  }
   else if (optionName=="Snooze")
  {
      var updatedMessage = acknowledgeActionFromMessage(payload.original_message, 'standup:start',
                                                      'I will remind you in 15 minutes');
  delay(6000)         //While deploying change t0 900000
  .then(() => {
      //console.log("Test")
      bot.sendMessage(channel,bot.introduceToUser(payload.user[0].id))
  });
  }
   else
  {
      var updatedMessage = acknowledgeActionFromMessage(payload.original_message, 'standup:start',
                                                      'See you tomorrow');
  }
  console.log("\n Updated Message \n")
  console.log(updatedMessage);
  return updatedMessage;
});

// Create the server to listen for events
const port = normalizePort(process.env.PORT || '3000');
const app = express();
app.use(bodyParser.json());
app.use('/slack/events', slackEvents.expressMiddleware());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/slack/actions', slackMessages.expressMiddleware());
// Start the server
http.createServer(app).listen(port, () => {
  console.log(`server listening on port ${port}`);
});
