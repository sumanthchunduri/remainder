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
  console.log('details from db');
  let item = await collect.get('timesheet')
  await mailService(item.props.email);
  console.log('called mail service');
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


const task1 = cron.schedule("*/5 * * * *", function () {
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

app.get("/faqs", (req, res) => {
  res.sendFile(path.join(__dirname, '/faqs.html'));
})

task1.start();

// 7d22ff1b3468cd3f07090885f022cc04b4f4e782  -  30 7 * * 1-5

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`running`);
})