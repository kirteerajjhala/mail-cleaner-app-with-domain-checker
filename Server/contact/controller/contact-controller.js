// controllers/contactController.js
const Contact = require("../model/contact-model.js");

// Create a new contact
exports.createContact = async (req, res) => {
  try {
    const { email, message } = req.body;
    if (!email || !message) {
      return res
        .status(400)
        .json({ success: false, msg: "All fields are required" });
    }

    const newContact = new Contact({ email, message });
    await newContact.save();

    res
      .status(201)
      .json({
        success: true,
        msg: "Contact saved successfully",
        data: newContact,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// Get all contacts
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json({ success: true, data: contacts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// DELETE a contact by ID
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ success: false, msg: "Contact not found" });
    }

    await Contact.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, msg: "Contact deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

const nodemailer = require("nodemailer");

// Reply to a contact
exports.replyContact = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id : " , id)
    const { reply } = req.body;
console.log(process.env.SMTP_EMAIL, process.env.SMTP_PASSWORD);
    if (!reply || reply.trim() === "") {
      return res
        .status(400)
        .json({ success: false, msg: "Reply message is required" });
    }

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ success: false, msg: "Contact not found" });
    }

    // Create transporter (replace with your SMTP details)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    // Email template
    const mailOptions = {
      from: `"Support Team" <${process.env.SMTP_EMAIL}>`,
      to: contact.email,
      subject: "Reply to your message",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #1a73e8;">Hello,</h2>
          <p>Thank you for contacting us. Here is our reply to your message:</p>
          <blockquote style="background: #f1f1f1; padding: 10px 15px; border-left: 4px solid #1a73e8;">
            ${reply}
          </blockquote>
          <p>If you have further questions, feel free to reply to this email.</p>
          <p style="margin-top: 20px;">Best regards,<br/>Support Team</p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, msg: "Reply sent successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: "Server error while sending reply" });
  }
};
