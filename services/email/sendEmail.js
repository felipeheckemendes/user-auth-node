const nodemailer = require('nodemailer');

module.exports = async (emailTemplate) => {
  const isDev = process.env.NODE_ENV === 'development';
  const mailConfig = {
    host: isDev ? process.env.DEV_EMAIL_HOST : process.env.PROD_EMAIL_HOST,
    PORT: isDev ? process.env.DEV_EMAIL_PORT : process.env.PROD_EMAIL_PORT,
    // secure: !isDev, // true for port 465, false for other ports
    auth: {
      user: isDev ? process.env.DEV_EMAIL_USER : process.env.PROD_EMAIL_USER,
      pass: isDev ? process.env.DEV_EMAIL_PASS : process.env.PROD_EMAIL_PASS,
    },
  };

  const transporter = nodemailer.createTransport(mailConfig);
  const emailOptions = {
    from: process.env.EMAIL_USER,
    ...emailTemplate,
  };
  const info = await transporter.sendMail(emailOptions);
  return info;
};
