import Exception from "../../error/Exception.js";
import { transporter } from "./Email.config.js";
import { Verification_Email_Template } from "./Email.Template.js";
import HttpStatusCode from "../../error/HttpStatusCode.js";


export const sendVerificationEamil=async(email,verificationCode)=>{
    try {
     const response=   await transporter.sendMail({
            from: '"Cafe Dev" <upinmc123@gmail.com>',

            to: email, // list of receivers
            subject: "Verify your Email", // Subject line
            text: "Verify your Email", // plain text body
            html: Verification_Email_Template.replace("{verificationCode}",verificationCode)
        })
    } catch (error) {
        throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message)
    }
}
