var fs = require('fs');
var Validator = require('jsonschema').Validator;
var v = new Validator();
var reg = /<(.*?)>/g;
var result;
var objUsers = JSON.parse(fs.readFileSync('mock_users.json', 'utf8'));

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
    creator: { type: 'string' }
  },
  required: ['startTimeHours', 'startTimeMins', 'endTimeHours', 'endTimeMins',
              'questions', 'participants', 'reportMedium', 'reportChannel', 'creator']
}

module.exports = {

addParticipants: function(participants, standupConfig) {
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
},

removeParticipants: function(participants, standupConfig) {
  while((result = reg.exec(participants)) !== null) {
      if (result[1].charAt(0) == '@') { // This is a user
        for (i in standupConfig.participants) {
          if (standupConfig.participants[i] == result[1].substr(1)) {
            console.log("Found user ", result[1]);
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


parseReportChannel: function(chan, standupConfig) {
  // TODO: check if the given channel is a valid channel
  // TODO: check if the bot is a member of the given channel
  var i = chan.indexOf('#');
  if(i != -1) {  // TODO: handle else
    standupConfig.reportChannel = chan.substr(i).split('|')[0];
    console.log('channel = ', standupConfig.reportChannel);
  }
},


validateConfigFile: function() {
  try {
      var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
      var results = v.validate(config, configSchema);
      //console.log(results["errors"];

      if(Object.keys(results["errors"]).length === 0) {
        //console.log("no errors");
        return config;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
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
        callback_id: '123',
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
Don't worry if you make a mistake. You can always modify the parameters later. :)"
} // module.exports ends
