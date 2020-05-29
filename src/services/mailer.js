import nodemailer from "nodemailer";
import secret from "../../config/secret";

import templateMail from "../templates/confirmation_mail"

async function sendMail(mail, name, code) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport(
    {
      service: "Gmail",
      auth: {
        user: secret.mail.username, // generated ethereal user
        pass: secret.mail.password, // generated ethereal password
      },
    },
    {
      tls: {
        rejectUnauthorized: false,
      },
    }
  );

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Contact HomeDelivery" <io.estiam@gmail.com>', // address estiam io
    to: mail, // le mail de candidat in bdd // inactive
    subject: "Confirmation compte HomeDelivery", // Subject line
    html: templateMail(code), // html body avec le nom / code in bdd
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};


module.exports = sendMail