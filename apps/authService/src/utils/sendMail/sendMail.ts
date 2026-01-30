import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});


export const renderEmailTemplate = async (template: string, data: Record<string, any>) => {
    const templatePath = path.join(__dirname, `${template}.ejs`);
    return ejs.renderFile(templatePath, data);

}

export const sendEmail = async (to: string, subject: string, template: string, data: Record<string, any>) => {

    // console.log("to: ",to);

    try {
        const html = await renderEmailTemplate(template, data);

        //    console.log("html: ", html);

        const mailOptions = {
            from: process.env.MAIL_USER,
            to,
            subject,
            html: html,
        };
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.log(error);
        throw new Error("Error sending email: ", error);
    }
}
