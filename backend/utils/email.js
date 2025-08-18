const nodemailer = require("nodemailer")
const fs = require("fs").promises
const path = require("path")

// Create transporter
// const createTransporter = () => {
//   return nodemailer.createTransporter({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   })
// }

// Load email template
const loadTemplate = async (templateName, data = {}) => {
  try {
    const templatePath = path.join(__dirname, "../templates/email", `${templateName}.html`)
    let template = await fs.readFile(templatePath, "utf8")

    // Replace placeholders with actual data
    Object.keys(data).forEach((key) => {
      const placeholder = new RegExp(`{{${key}}}`, "g")
      template = template.replace(placeholder, data[key])
    })

    return template
  } catch (error) {
    console.error("Error loading email template:", error)
    return null
  }
}

// Send email function
const sendEmail = async ({ to, subject, template, data = {}, html, text }) => {
  try {
    const transporter = createTransporter()

    let emailHtml = html
    const emailText = text

    // Load template if provided
    if (template) {
      emailHtml = await loadTemplate(template, data)
      if (!emailHtml) {
        throw new Error(`Template ${template} not found`)
      }
    }

    const mailOptions = {
      from: `"Web Love cat" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: emailHtml,
      text: emailText,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", result.messageId)
    return result
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

// Send bulk emails
// const sendBulkEmail = async (emails) => {
//   const transporter = createTransporter()
//   const results = []

//   for (const email of emails) {
//     try {
//       const result = await sendEmail(email)
//       results.push({ success: true, messageId: result.messageId, to: email.to })
//     } catch (error) {
//       results.push({ success: false, error: error.message, to: email.to })
//     }
//   }

//   return results
// }

// Email templates data
const emailTemplates = {
  "email-verification": {
    subject: "Verify Your Email - Web Love cat",
    requiredData: ["firstName", "verificationUrl"],
  },
  "password-reset": {
    subject: "Password Reset - Web Love cat",
    requiredData: ["firstName", "resetUrl"],
  },
  "order-confirmation": {
    subject: "Order Confirmation - Web Love cat",
    requiredData: ["firstName", "orderNumber", "orderTotal", "orderItems"],
  },
  "booking-confirmation": {
    subject: "Booking Confirmation - Web Love cat",
    requiredData: ["firstName", "serviceName", "bookingDate", "bookingTime"],
  },
  newsletter: {
    subject: "Newsletter - Web Love cat",
    requiredData: ["firstName", "content"],
  },
}

// module.exports = {
//   sendEmail,
//   sendBulkEmail,
//   emailTemplates,
// }
