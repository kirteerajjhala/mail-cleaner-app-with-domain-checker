// Server/Mail/templates/passwordUpdate.js
const passwordUpdated = (email, message) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.5;">
      <h2>Password Update Notification</h2>
      <p>${message}</p>
      <p>If you did not request this change, please contact support immediately.</p>
    </div>
  `;
};

module.exports = { passwordUpdated };