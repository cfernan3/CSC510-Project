const nodemailer = require('nodemailer');

module.exports = {
  postReportToChannel: function(bot, report, channelId) {
    bot.say(
    {
      text: report,
      channel: channelId
    }
    );
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
