import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import { config } from "../config/config";
import { EmailSubject, EmailView } from "./mailer.utils";

export const sendMail = async (
  email: any,
  subject: EmailSubject,
  emailView: EmailView,
  link = "",
  link2 = "",
  user = "",
  ip = "",
  date = ""
) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: config.MAILER_USER_GG,
      pass: config.MAILER_PASS_GG,
    },
  });

  const handlebarOptions = {
    viewEngine: {
      extName: ".hbs",
      partialsDir: path.join(__dirname, "../views/"),
      layoutsDir: path.join(__dirname, "../views/"),
      defaultLayout: "",
    },
    viewPath: path.join(__dirname, "../views/"),
    extName: ".hbs",
  };

  transporter.use("compile", hbs(handlebarOptions));

  const mailOptions = {
    from: `"ChatMe" <${config.MAILER_USER_GG}>`,
    to: email,
    subject,
    template: emailView,
    context: {
      link,
      link2,
      user,
      ip,
      date,
    },
  };

  let info = await transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log(err);
    }
  });
};
