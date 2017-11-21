const nodemailer = require('nodemailer');

module.exports = {
  // TODO: fetch questions and answers from sheets
  generateReport: function(standupConfig, answers) {
    var standupReport = "Here's the consolidated report for today's standup.\n";
    for (var user in answers) {
      var userName = standupConfig.participantNames[user];
      standupReport += `\n${userName}'s responses:\n`;
      for(var i = 0; i < standupConfig.questions.length; i++) {
        standupReport += `${standupConfig.questions[i]}\n`;
        standupReport += `${answers[user][i]}\n`;
      }
    }

    return standupReport;
  },


  postReportToChannel: function(bot, report, channelId) {
    bot.say(
    {
      text: report,
      channel: channelId
    });
  },


  emailReport: function(report) {
    var smtpTransport = nodemailer.createTransport("smtps://whatbot.ncsu%40gmail.com:"+encodeURIComponent('12345ABCDE') + "@smtp.gmail.com:465");
    smtpTransport.sendMail({
      from: "whatbot.ncsu@gmail.com",
      to: participant,
      subject: "Report",
      text: report
    },

    function(error, response){
      if(error){
        console.log(error);
      }else{
        console.log("Message sent: " + response.message);
      }
      smtpTransport.close(); // shut down the connection pool. Comment this line out to continue sending emails.
    });
  }
}
