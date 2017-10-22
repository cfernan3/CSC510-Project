
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
