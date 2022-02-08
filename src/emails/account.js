const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "no-reply@fivesdigital.com", // generated ethereal user
      pass: "5Sdigital198", // generated ethereal password
    },
  });


  const welcomeMail = async (email, name) => {
    let message = {
        from: 'Test <no-reply@fivesdigital.com>',
        to: `${name} <${email}>`,
        subject:`Welcome!`,
        text: `Welcome ${name}! We are glad to meet you!`,
    };
    await transporter.sendMail(message);
}
const signOffMail = async (email, name) => {
    let message = {
        from: 'Test <no-reply@fivesdigital.com>',
        to: `${name} <${email}>`,
        subject:`Hope you are ok!`,
        text: `Hi ${name}! please let us know the reason you left!`,
    };
    await transporter.sendMail(message);
}

module.exports = {
    welcomeMail,
    signOffMail
};