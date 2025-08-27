const nodemailer = require("nodemailer");

const sendOnboardingEmail = async (fullName, email, password) => {
    const onboardingLink = "https://app.turtlefinance.in";

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: `"Raj from Turtle" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Welcome ${fullName}, let's onboard you on Turtle.`,
        html: `
            <p>Hi ${fullName},</p>

            <p>Onboarding is one of the key steps to ensure you get access to the right financial advice at any time. We will need 15–20 minutes of your time to complete this compliance process. This begins with assessing your risk profile, completing your KYC, followed by signing the agreement and making the payment.</p>

            <p>Use the following link and credentials to do this at peace:</p>

            <p><strong>Link:</strong> <a href="${onboardingLink}" target="_blank">${onboardingLink}</a><br/>
            <strong>Username/Email:</strong> ${email}<br/>
            <strong>Password:</strong> ${password}</p>

            <p><em>Note: Kindly use a laptop/desktop to complete this onboarding and keep your PAN and Aadhar Card soft copies handy.</em></p>

            <p>In case you have any queries or feedback to share, write back to this email or call/WhatsApp us at <strong>+91-9773508833</strong>.</p>

            <p>Onwards & Upwards,<br/>
            Raj from Turtle<br/>
            +91-9535507833</p>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendOnboardingEmail;
