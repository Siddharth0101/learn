const nodemailer = require('nodemailer')
const catchAsync = require('./catchAsync')
const sendEmail = catchAsync(async (options) => {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    // 2) Define mail options
    const mailOptions = {
        from: 'sidd@prime.io',
        to: options.email,
        subject: options.email,
        text: options.message,
    }

    // 3) Actually send mail`
    await transporter.sendMail(mailOptions)
})

module.exports = sendEmail