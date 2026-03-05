const { Resend } = require('resend');
const env = require('../config/env');

let resend;
if (env.RESEND_API_KEY) {
    resend = new Resend(env.RESEND_API_KEY);
}

const sendEmail = async ({ to, subject, html }) => {
    if (!resend) {
        console.log(`[MOCK EMAIL] To: ${to}\nSubject: ${subject}\nBody: ${html}`);
        return;
    }

    try {
        const data = await resend.emails.send({
            from: 'ZAPI <noreply@zapi.es>',
            to: Array.isArray(to) ? to : [to],
            subject,
            html
        });
        console.log(`Email sent: ${data.id}`);
        return data;
    } catch (error) {
        console.error('Resend email error:', error);
        throw error;
    }
};

module.exports = {
    sendEmail
};
