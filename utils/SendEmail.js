const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstname = user.name.split(' ')[0];
    this.url = url;
    this.from = `Abdulhamid Gouda <${process.env.EMAIL_FROM}>`;
  }

  // Create
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SEND_USERNAME,
          pass: process.env.SEND_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false, // This is the insecure option
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // This is the insecure option
      },
    });
  }

  // Send
  async send(message, subject) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: message,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  // Password reset email
  async sendPasswordReset() {
    const message = `Hello ${this.firstname},\n\nWe received a request to reset your password on البيت السعيد Account: \n\n${this.url}\n\nEnter this code to complete the reset.\n\nThanks for helping us keep your account secure.`;

    await this.send(
      message,
      'Your password reset token (valid for onlt 10 minutes)',
    );
  }
};
