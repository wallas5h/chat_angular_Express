import { google } from "googleapis";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import { config } from "../config/config";
import { EmailSubject, EmailView } from "./mailer.utils";

const OAuth2 = google.auth.OAuth2;

const OAuth2_client = new OAuth2(
  config.client_Id,
  config.client_Secret,
  config.redirect_URI
);

OAuth2_client.setCredentials({ refresh_token: config.refresh_oAuth_token });

export const sendMail2 = async (
  email: any,
  subject: EmailSubject,
  emailView: EmailView,
  link = "",
  link2 = "",
  user = "",
  ip = "",
  date = ""
) => {
  try {
    const accesToken = await OAuth2_client.getAccessToken();

    let transporter = nodemailer.createTransport({
      // service: String("gmail")||"",
      // host: "smtp.gmail.com",
      // port: 465,
      // auth: {
      //   type: "OAuth2",
      //   user: config.OAuth_User,
      //   clientId: config.client_Id,
      //   clientSecret: config.client_Secret,
      //   refreshToken: config.refresh_oAuth_token,
      //   accessToken: accesToken.token,
      // },
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
  } catch (error) {
    return error;
  }

  // let transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   host: "smtp.gmail.com",
  //   port: 465,
  //   auth: {
  //     user: config.MAILER_USER_GG,
  //     pass: config.MAILER_PASS_GG,
  //   },
  // });
};
