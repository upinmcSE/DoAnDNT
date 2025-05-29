import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "upinmc123@gmail.com",
    pass: "fczfnxqdcyziezzu",
  },
});