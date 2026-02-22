// Server/utils/mailSender.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"No Reply" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent,
  });

  console.log("Email sent: ", info.messageId);
  return info;
};

module.exports = mailSender;