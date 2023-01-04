const express = require("express");
const cron = require("node-cron");
const nodemailer = require("nodemailer");

const app = express();



const dat = new Date();

function mailService() {
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "180040097ece@gmail.com",
// use generated app password for gmail
      pass: process.env.password,
    },
  });
  let mailDetails = {
    from: "180040097ece@gmail.com",
    to: "sumanthchunduri123@gmail.com",
    subject: "Time sheet remainder",
    text: `Hi this is remainder to fill your timesheet ${dat}`,
  };

  // sending email
  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("error occurred", err.message);
    } else {
      console.log("---------------------");
      console.log("email sent successfully");
    }
  });
}


cron.schedule("30 7 * * 1-5", function () {
  console.log(`message`);
  mailService();
  console.log(`sent`);
}, {
  scheduled:true,
  timezone: "Asia/Kolkata"
});


app.get("/", (req, res) => {
  res.json({ msg: "pass" })
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`running`);
}
)