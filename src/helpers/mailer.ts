import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    // TODO: Configure mail for usage

    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {

      const updatedUser = await User.findByIdAndUpdate(userId, {
        $set:{
          verifyToken: hashedToken,
          verifyTokenExpiry: new Date(Date.now() + 3600000)
        }
      });

    } else if (emailType === "RESET") {

      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });

    }

    var transport = nodemailer.createTransport({

      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {

        user: "7c2e75e7691464", //should be in .env
        pass: "8ed5ee929f56fc", //should be in .env

      },

    });

    const mailOptions = {

      from: 'hitesh@gmail.com',
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
    }

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;

  } catch (error: any) {

    throw new Error(error.message);

  }
};
