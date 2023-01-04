const express = require("express");
const cron = require("node-cron");
const nodemailer = require("nodemailer");

const app = express();


const dat = new Date();


const usersTimesheet = [
  {
    name:"Sumanth",
    email: "sumanthchunduri123@gmail.com",
    task: "timesheet"
  },
  {
    name: "Sandeep",
    email: "180031046cse@gmail.com",
    task: "timesheet"
  }
]

const usersOffice = [
  {
    name:"Gopi",
    email: "180030739cse@gmail.com",
    task: "office mail to supervisor and time sheet"
  }
]

function mailSender() {
  for (let x in usersTimesheet) {
    mailService(usersTimesheet[x]);
  }
}

function mailOffice() {
  for (let x in usersOffice) {
    mailService(usersOffice[x]);
  }
}

function mailService(user) {
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "180040097ece@gmail.com",
      pass: process.env.password,
    },
  });
  let mailDetails = {
    from: "180040097ece@gmail.com",
    to: user.email,
    subject: `${user.task} remainder`,
    text: `Hi ${user.name} this is a remainder for ${user.task} for date ${dat.getDate()}`,
  };

  // sending email
  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("error occurred", err.message);
    } else {
      console.log("email sent successfully");
    }
  });
}


const task1 = cron.schedule("30 7 * * 1-5", function () {
  console.log(`message`);
  mailSender();
  console.log(`sent`);
}, {
  scheduled:true,
  timezone: "Asia/Kolkata"
});

const task2 = cron.schedule("30 10 * * 1-5", function () {
  mailOffice();
  console.log(`mail sent to gopi`);
}, {
  scheduled:true,
  timezone: "Asia/Kolkata"
});


app.get("/", (req, res) => {
  res.json({ msg: "pass" })
})


task1.start();
task2.start();


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`running`);
}
)