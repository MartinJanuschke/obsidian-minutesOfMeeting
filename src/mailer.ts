import * as nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
	host: "smtp.office365.com",
	port: 587,
	secure: false, // upgrade later with STARTTLS
	auth: {
		user: process.env.MAIL,
		pass: process.env.MAIL_PSW,
	},
});



// export class MailService{
//     sendMail(){}

// }
