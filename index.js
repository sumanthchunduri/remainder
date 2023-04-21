const express = require("express");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const path = require('path');
require('dotenv').config();
const CyclicDB = require('cyclic-dynamodb');
const db = CyclicDB(process.env.idCyclicDB);


const app = express();

let collect = db.collection('reminders')

async function mailSender() {
  let item = await collect.get('timesheet')
  mailService(item.props.email);
}

async function mailService(email) {
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email,
      pass: process.env.password,
    },
  });
  let mailDetails = {
    from: process.env.email,
    to: email,
    subject: `timesheet remainder`,
    text: `Hi this is a remainder for timesheet for today`,
  };

  // sending email
  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("error occurred", err.message);
    } else {
      console.log("email sent successfully");
    }
  });

  let leo = await collect.set('status', {
    lastrun: Date.now(),
  })
}


const task1 = cron.schedule("30 7 * * 1-5", function () {
  mailSender();
}, {
  scheduled:true,
  timezone: "Asia/Kolkata"
});

app.get("/", async (req, res) => {
  let item = await collect.get('status')
  let date = new Date(item.props.updated);
  res.json({ "last-run": date.toDateString()})
})

app.get("/run", (req, res) => {
  mailSender();
  res.json({"status": "cron runned"});
})

app.get("/kings-206-faqs", (req, res) => {
  res.sendFile(path.join(__dirname, '/faqs.html'));
})

task1.start();



const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`running`);
})