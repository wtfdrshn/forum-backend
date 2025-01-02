import { Resend } from 'resend';
import config from '../config/config.js';

const sendRegistrationMail = async (emailData) => {

    const { email, name, token, memId } = emailData;

    const resend = new Resend(process.env.RESEND_API_KEY || config.resendApiKeys);

    const badgeLink = `${config.clientUrl}/member/badge/${token}`;

    try {
        await resend.emails.send({
            from: "MIT-WPU Science & Spirituality Forum <welcome@snsf.live>",
            to: email,
            subject: 'Welcome to MIT-WPU Science & Spirituality Forum',
            html: `
                <p>Dear ${name},</p>
                <p>Thank you for registering with MIT-WPU Science & Spirituality Forum. We are excited to have you on board.</p>
                <p>Your registration details are as follows:</p>
                <ul>
                    <li><strong>Name:</strong> ${name}</li>
                    <li><strong>Member ID:</strong> ${memId}</li>
                </ul>
                <p>Please click on the link below to view your badge:</p>
                <p><a href="${badgeLink}">View Badge</a></p>
                <p>Best regards,<br/>MIT-WPU Science & Spirituality Forum Team</p>
            `,
        });
    } catch (error) {
        console.log(error);
    }
}

export { sendRegistrationMail };