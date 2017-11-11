var fs = require('fs');
var Validator = require('jsonschema').Validator;
var v = new Validator();
var result;

var configSchema = {
  type: 'object',
  properties: {
    startTimeHours: { type: 'number', minimum: 0, maximum: 23 },
    startTimeMins: { type: 'number', minimum: 0, maximum: 59 },
    endTimeHours: { type: 'number', minimum: 0, maximum: 23 },
    endTimeMins: { type: 'number', minimum: 0, maximum: 59 },
    questions: { type: 'array', items: { type: 'string' }, minItems: 1 },
    participants: { type: 'array', items: { type: 'string', minLength: 9, maxLength: 9 }, minItems: 1 },
    reportMedium: { type: 'string', enum: ['email', 'channel'] },
    reportChannel: { type: 'string', maxLength: 9 },
    creator: { type: 'string', minLength: 9, maxLength: 9 }
  },
  required: ['startTimeHours', 'startTimeMins', 'endTimeHours', 'endTimeMins',
              'questions', 'participants', 'reportMedium', 'reportChannel', 'creator']
}


module.exports = {

addParticipants: function(bot, participants, standupConfig) {
  var reg = /<(.*?)>/g;
  // Iterate through the valid participants list.
  while((result = reg.exec(participants)) !== null) {

    if (result[1].charAt(0) == '@') { // This is a user

      // Add this user to the json file.
      if (standupConfig.participants.indexOf(result[1].substr(1)) < 0) {
        console.log("Adding ", result[1].substr(1));
        standupConfig.participants.push(result[1].substr(1));
      }
      console.log("Participants " + standupConfig.participants);

    } else if (result[1].charAt(0) == '#') { // This is a channel

      // Get the users of the channel.
      var channel_id = result[1].substr(1).split('|')[0];
      console.log("channel_id = ", channel_id);

      bot.api.channels.info({"channel": channel_id},function(err,response) {
        // Check if the user is a bot, then don't add him.
        var members = response["channel"]["members"];
        for (var p_i in members) {

          console.log("Member id = " + members[p_i]);
          bot.api.users.info({"user": members[p_i]},function(err,response) {

            if (response["user"]["is_bot"] == false) { // This is a user

              // Add this participant
              if (standupConfig.participants.indexOf(response["user"]["id"]) < 0) {
                console.log("Adding ", response["user"]["id"]);
                standupConfig.participants.push(response["user"]["id"]);
              }
            }
            console.log("Participants " + standupConfig.participants);
          });
        }
      });
    }
  }
},


removeParticipants: function(participants, standupConfig) {
  while((result = reg.exec(participants)) !== null) {
      if (result[1].charAt(0) == '@') { // This is a user
        for (i in standupConfig.participants) {
          if (standupConfig.participants[i] == result[1].substr(1)) {
            // Remove this user from the json file.
            standupConfig.participants.splice(i,1);
            console.log("Removing ", (result[1].substr(1)));
            break;
          }
        }
      }
  }
},


parseQuestions: function(quest, standupConfig) {
  var questions = quest.split('\n');
  for(var i = 0; i < questions.length; i++)
    standupConfig.questions.push(questions[i]);
},


parseReportChannel: function(bot, botId, chan, standupConfig, callback) {
  console.log("Channel = " + chan);
  var regChan = /<(.*?)>/g;
  var result = regChan.exec(chan);
  console.log("Result = " + result);
  if (result && result[1].charAt(0) == '#') { // This is a channel

    // check if the given channel is a valid channel
    var channel_id = result[1].substr(1).split('|')[0];
    console.log("channel_id = ", channel_id);

    // check if the bot is a member of the given channel
    bot.api.channels.info({"channel": channel_id},function(err,response) {
    // This API call is asynchronous.
    // Thus we need callbacks to continue the conversation with the user

      // Check if the user is a bot, then don't add him.
      var members = response["channel"]["members"];
      if(members.indexOf(botId) < 0) {
        // Bot is NOT present in the channel.
        console.log("Callback 2");
        callback(2);
        return;
      } else {
        // Bot is present in valid channel
        standupConfig.reportChannel = channel_id;
        console.log("Callback 0");
        callback(0);
        return;
      }
    });
  } else { // Channel is invalid
    console.log("Callback 1");
    callback(1);
  }
},


validateConfigFile: function() {
  try {
      var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
      var results = v.validate(config, configSchema);
      //console.log(results["errors"];

      if(Object.keys(results["errors"]).length === 0) {
        //console.log("no errors");

        //TODO: add other checks for time
        if(config.reportMedium == "channel" && config.reportChannel == "")
          return null;

        return config;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
},


getHourIn12HourFormat: function(hour, min) {
    var timeStr = hour % 12;
    if(timeStr == 0)
      timeStr = 12;

    if(min/10 < 1)
      timeStr += ":0" + min;
    else
      timeStr += ":" + min;

    if(hour/12 < 1)
      timeStr += " AM";
    else
      timeStr += " PM";

    return timeStr;
},


reportMediumButtons: reportMediumButtons = {
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


modifyStandupButtons: modifyStandupButtons = {
attachments:[
    {
        pretext: "Which standup configuration do you want to modify?",
        title: "Select one option.",
        callback_id: '234',
        attachment_type: 'default',
        actions: [
            {
                "name":"modify",
                "text": "Start Time",
                "value": "startTime",
                "type": "button",
            },
            {
                "name":"modify",
                "text": "End Time",
                "value": "endTime",
                "type": "button",
            },
            {
                "name":"modify",
                "text": "Participants",
                "value": "participants",
                "type": "button",
            },
            {
                "name":"modify",
                "text": "Question Set",
                "value": "questionSet",
                "type": "button",
            },
            {
                "name":"modify",
                "text": "Reporting Medium",
                "value": "reportMedium",
                "type": "button",
            }
        ]
    }
]},


modifyUserButtons: modifyUserButtons = {
attachments:[
    {
        title: "Select one option.",
        callback_id: '456',
        attachment_type: 'default',
        actions: [
            {
                "name":"modify",
                "text": "Add Participants",
                "value": "addUsers",
                "type": "button",
            },
            {
                "name":"modify",
                "text": "Remove Participants",
                "value": "removeUsers",
                "type": "button",
            }
        ]
    }
]},


helpMsg: helpMsg = "Heya! I'm here to organize your standup.\n\
You can tell me to configure a new standup, and I'll guide you through the setup.\n\
All I need is the standup window, participant list, question set, and reporting medium (Slack channel / Email).\n\
Don't worry if you make a mistake. You can always view and modify the config later. :)"
} // module.exports ends
