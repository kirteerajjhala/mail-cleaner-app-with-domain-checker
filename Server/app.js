const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const contactRoutes = require("../Server/contact/routes/contact-route.js");
const emailRecordRoute = require("../Server/emailRecord/routes/email-record-routes.js")
dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Routes
const authRoutes = require('./routes/auth');
const spamRoutes = require('./routes/spam');
const outgoingMailRoutes = require('./routes/outgoingMail');
app.use('/api/auth', authRoutes);
app.use('/api/spam', spamRoutes);
app.use('/api/outgoing-mail', outgoingMailRoutes);

const adminMiddleware = require('./middleware/adminMiddleware');
app.use('/api/admin/auth',      require('./routes/admin/adminAuthRoutes'));
app.use('/api/admin/dashboard', adminMiddleware, require('./routes/admin/adminDashboardRoutes'));
app.use('/api/admin/users',     adminMiddleware, require('./routes/admin/adminUserRoutes'));
app.use('/api/admin/mails',     adminMiddleware, require('./routes/admin/adminMailRoutes'));
app.use('/api/admin/spam',      adminMiddleware, require('./routes/admin/adminSpamRoutes'));
app.use('/api/admin/contacts',  adminMiddleware, require('./routes/admin/adminContactRoutes'));
app.use('/api/admin/reports',   adminMiddleware, require('./routes/admin/adminReportRoutes'));
app.use('/api/admin/settings',  adminMiddleware, require('./routes/admin/adminSettingsRoutes'));
app.use('/api/admin/security',  adminMiddleware, require('./routes/admin/adminSecurityRoutes'));


// contact
app.use("/contact", contactRoutes);
app.use("/emailRecord" ,emailRecordRoute)

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Connect DB & start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.DATABASE_URL)
  .then(()=> {
    console.log('MongoDB connected');
    app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('DB connection error', err);
  });
