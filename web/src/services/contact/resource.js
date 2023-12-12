if (!process.env.IS_BROWSER) {
  var email = require('../../server/email');
  var config = require('../../config/config.server');
}

export default {
  sendContact: (values) => {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        replyTo: values.email,
        to: config.email.recipient,
        subject: 'New message on Relational Dataset Repository',
        html: `
          <p><strong>From:</strong> <a href="mailto:${values.email}">${values.email}</a></p>
          <p><strong>Message:</strong> ${values.message}</p>
        `
      };

      email.sendMail(mailOptions, (error, info) => {
        if (error) return reject(error);
        return resolve(true);
      });
    });
  }
};
