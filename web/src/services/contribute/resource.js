if (!process.env.IS_BROWSER) {
  var email = require('../../server/email');
  var config = require('../../config/config.server');
}

export default {
  sendContribution: (values) => {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        to: config.email.recipient,
        subject: 'New contribution on Relational Dataset Repository',
        html: `
          <p><strong>From:</strong> ${values.name}</p>
          <p><strong>Origin:</strong> ${values.origin}</p>
          <p><strong>Dataset name:</strong> ${values.dataset}</p>
          <p><strong>Description:</strong> ${values.description}</p>
          <p><strong>Comment:</strong> ${values.comment}</p>
        `
      };

      email.sendMail(mailOptions, (error, info) => {
        if (error) return reject(error);
        return resolve(true);
      });
    });
  }
};
