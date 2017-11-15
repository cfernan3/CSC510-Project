
module.exports = {
  postReportToChannel: function(bot, channel_json) {
    var answers = channel_json["answers"];
    var questions = channel_json["questions"];
    var users = channel_json["user_name"];
    var j = 0;
    var report = "The Consolidated Report is as follows\n\n";
    for (var j = 0;j<answers.length;j++){
      report += ` ${users[j]} has completed the standup. The reponses are as follows-\n\n`;
    for(var i = 0; i < answers[j].length; i++){
      
        report += `Q: ${questions[i]}\n`;
        report += `A: ${answers[j][i]}\n`;
    }
  }

    console.log('REPORT:/n',report);
    console.log("Channel_id " + channel_json["channel_id"]);
    bot.say(
    {
      text: report,
      channel: channel_json["channel_id"]
    }
    );
  },

  emailReport: function(bot,channel_json) {
    
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
    
    */
        'use strict';
        var answers = channel_json["answers"];
        var questions = channel_json["questions"];
        var users = channel_json["user_name"];
        var j = 0;
        var report = "The Consolidated Report is as follows\n\n";
        for(var i = 0; i < answers.length; i++){
          if (i%questions.length==0){
            console.log('USERS#############',users[j])
                    bot.api.users.info({"user": users[j]},function(err,response) {
                            console.log(response)
                            var participant = response.user.profile.email
                            console.log('PARTICIPANT#########################',participant)
                        var user_name = response.user.real_name;
                        console.log('USRNAMEJWQLRJEQJ#######', user_name)
                        report += user_name+"has completed the standup. The reponses are as follows-\n\n"
                    });
            j+=1;
          }
            report += `Q: ${questions[i%questions.length]}\n`;
            report += `A: ${answers[i]}\n`;
        }/*
        for(var j = 0; j < users.length; j++)
            console.log('USERS#############',users[j])
                    bot.api.users.info({"user": users[j]},function(err,response) {
                        var participant = response.user.profile.email
                            console.log('PARTICIPANT#########################',participant)
                        var user_name = response.user.real_name;
                        console.log('USRNAMEJWQLRJEQJ#######', user_name)
    
        */
        console.log('REPORT:/n',report);
        const nodemailer = require('nodemailer');
        var smtpTransport = nodemailer.createTransport("smtps://whatbot.ncsu%40gmail.com:"+encodeURIComponent('12345ABCDE') + "@smtp.gmail.com:465");
        smtpTransport.sendMail({  //email options
        from: "whatbot.ncsu@gmail.com", // sender address.  Must be the same as authenticated user if using Gmail.
        to: participant, // receiver
        subject: "Report", // subject
        text: report // body
        }, function(error, response){  //callback
        if(error){
        console.log(error);
        }else{
        console.log("Message sent: " + response.message);
        }
    //});
       smtpTransport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
        });
    
     //   });
      //  });
    
      }
    }
    
    