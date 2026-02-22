// Server/Mail/templates/emailVerificationTemplate.js
const emailVerificationTemplate = (otp, name) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.5;">
      <h2>Hello ${name},</h2>
      <p>Your OTP for verification is:</p>
      <h3>${otp}</h3>
      <p>This OTP is valid for 10 minutes.</p>
      <p>Thanks,<br/>Your Company Team</p>
    </div>
  `;
};

module.exports = emailVerificationTemplate;