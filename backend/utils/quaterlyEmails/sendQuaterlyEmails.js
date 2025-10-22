const nodemailer = require("nodemailer");


const sendMilestoneEmail = async (salutation, email, days) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    let subject;
    let message;

    // Customize email content based on milestone days
    switch (days) {
        case 90:
            subject = `${salutation}, we are quarter in. Are your plans turning into action?`;
            message = `
                <p>Hi ${salutation},</p>
                <p>Three months have flown by since we started working together.</p>
                <p>By now, you should be seeing the first few pieces of your financial plan taking shape.</p>
                <p>But the real question is, are these plans turning into action?</p>
                <p>I’d love to hear how it’s been for you so far. What felt easy? What still feels like it’s waiting to be done?</p>
                <p>Let’s connect for a quick check-in to review progress and set the pace for the next quarter. 
                Please pick up a slot that works best for you from 
                <a href="https://calendly.com/turtle-finance/check-in-with-turtle" target="_blank">this link</a>.
                </p>
            `;
            break;


        case 180:
            subject = `${salutation}, halfway through the year: How are we doing?`;
            message = `
                <p>Hi ${salutation},</p>
                <p>It's been 6 months since you joined Turtle!</p>
                <p>By now, you should be seeing parts of your plan turning into action: investments, insurance, taxes, or simply more clarity.</p>
                <p>But progress isn’t always linear; sometimes priorities shift, or life gets in the way. That’s why I’d love to catch up and see what’s working, and what needs a little more attention.</p>
                <p>Let’s schedule a check-in call to review your wins and fix anything that needs attention.</p>
                <p>Can you please pick up a slot that works best for you from 
                <a href="https://calendly.com/turtle-finance/check-in-with-turtle" target="_blank">this link</a>?</p>
        
            `;
            break;


        case 270:
            subject = `${salutation}, staying consistent is the hardest part...`;
            message = `
                <p>Hi ${salutation},</p>
                <p>It's been 9 months since you joined Turtle!</p>
                <p>This is where consistency is tested. Some clients feel momentum building, others notice things slipping a bit, and both are normal parts of the journey.</p>
                <p>The good news is, we still have a full quarter left to bring things back on track.</p>
                <p>Let’s connect for a Q3 check-in call, look at where you stand, and decide on the small steps to finish the year strong.</p>
                <p>Can you please pick up a slot that works best for you from 
                <a href="https://calendly.com/turtle-finance/check-in-with-turtle" target="_blank">this link</a>?</p>
                
            `;
            break;

        case 335:
            subject = `${salutation}, let’s reflect on this year and plan the next`;
            message = `
                <p>Hi ${salutation},</p>
                <p>It's been 11 months since you joined Turtle! We’re so glad to have had you with us, and we hope the past year’s guidance has added clarity and confidence to your financial journey.</p>
                <p>As we wrap up the year, this is a great moment to pause and reflect.</p>
                <p>What financial goals did you move forward on this year?<br/>
                Where did you face hurdles?<br/>
                And most importantly, what’s the one thing you’d like to improve in the coming year?</p>
                <p>Your journey with Turtle is about more than just numbers. It’s about building the financial confidence to live life on your terms.</p>
                <p>Your Turtle membership is due for renewal next month, but before we get there, we’d love to hear from you.</p>
                <p>Let’s get on a call, hear about your experience, and plan for what’s next together.</p>
                <p>Can you please pick up a slot that works best for you from 
                <a href="https://calendly.com/turtle-finance/check-in-with-turtle" target="_blank">this link</a>?</p>
                <p><em>Note: The all-inclusive renewal fee for the next year will be [Amount]. Happy to share more details in our check-in conversation.</em></p>
            
            `;
            break;

        case 365:
            subject = `${salutation}, let's renew your Turtle membership`;
            message = `
                <p>Hi ${salutation},</p>
                <p>Time really does fly! It’s been another year since you joined Turtle! We’re so glad to have you with us, and we hope the past year’s guidance has added clarity and confidence to your financial journey. Your Turtle membership is due for renewal.</p>
                <p>We’d be delighted to continue the journey with you. Think of it less as a fee and more as investing in peace of mind with a partner who’s got your back on the financial front. Without renewal, you’ll lose access to the right financial advice, ongoing insights and support that keep your financial goals on track.</p>
                <p>We will need 15–20 minutes of your time to complete this compliance process for renewal. This begins with assessing your risk profile, completing your KYC, followed by signing the agreement and making the payment.</p>
                <p><strong>Use the following link and credentials to do this at peace:</strong></p>
                <p><strong>Link:</strong> <a href="https://app.turtlefinance.in" target="_blank">https://app.turtlefinance.in</a><br/>
                <strong>Username/Email:</strong> ${email}<br/>
                <strong>Password:</strong>1234[Standard Password]<br/>
                <em>(In case you wish to change the password, use the reset password option on the above link)</em></p>
                <p><em>Note: Kindly use a laptop/desktop to complete this onboarding and keep your PAN and Aadhar Card soft copies handy.</em></p>
                <p>In case you need any assistance or have any feedback to share, reply to this email or call/WhatsApp us at <strong>+91-9773508833</strong>.</p>
            `;
            break;


    }

    if (!subject || !message) {
        console.log(`No milestone email defined for ${days} days. Skipping email to ${email}.`);
        return;
    }

    const mailOptions = {
        from: `"Raj from Turtle" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html: `
            ${message}
            <p>Onwards & Upwards,<br/>Raj from Turtle<br/>+91-9535507833</p>
        `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Milestone email for ${days} days sent to ${email}`);
};

module.exports = sendMilestoneEmail;
