
module.exports = {
  postReportToChannel: function(bot, channel_json) {
    var answers = channel_json["answers"];
    var questions = channel_json["questions"];

    var report = channel_json["user_name"] + ` has completed the standup. The reponses are as follows-\n\n`;
    for(var i = 0; i < questions.length; i++){
        report += `Q: ${questions[i]}\n`;
        report += `A: ${answers[i]}\n`;
    }

    bot.say(
    {
      text: report,
      channel: channel_json["channel_id"]
    }
    );
  },

  emailReport: function() {
    // TODO: This needs to be fixed and remove nock and remove hardcoded username and password.
    // Trigger thiss function at standup end time
/*
    var api = nock("https://sheets.googleapis.com")
    .get("/v4/spreadsheets/abcdefgh/")
    .reply(200, {
      "user_name":message.username,
      "standup":{responseAnswers}
    });

    https.get("https://sheets.googleapis.com/v4/spreadsheets/abcdefgh/", function(resp) {
    var str = "";
    resp.on("data", function(data) { str += data; });
    resp.on("end", function() {
    console.log(str);
    var string = str
    //var string = JSON.stringify(str);


    'use strict';
    const nodemailer = require('nodemailer');
    var smtpTransport = nodemailer.createTransport("smtps://whatbot.ncsu%40gmail.com:"+encodeURIComponent('12345ABCDE') + "@smtp.gmail.com:465");
    smtpTransport.sendMail({  //email options
    from: "whatbot.ncsu@gmail.com", // sender address.  Must be the same as authenticated user if using Gmail.
    to: "cfernan3@ncsu.edu , nedsouza@ncsu.edu, rjoseph4@ncsu.edu", // receiver
    subject: "Report", // subject
    text: string // body
    }, function(error, response){  //callback
    if(error){
    console.log(error);
    }else{
    console.log("Message sent: " + response.message);
    }

    smtpTransport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
    });

    });
    });
*/
  }
}
