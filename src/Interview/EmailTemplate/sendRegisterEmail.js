import axios from "axios";
import { projectApiList } from "../../config/config";

const sendRegisterEmail = async (user) => {
    if (!user || !user.EmailId) {
        console.error("❌ Missing User Email.");
        return;
    }

    const emailBody = `
        <p>Dear ${user.name},</p>
        <p>Thank you for registering on our platform.</p>
        <p>Your account has been successfully created, but before you can access our services, an admin must approve your registration.</p>
        <p><strong>Current Account Status:</strong> <span style="color: red;">Pending (Need Admin Approval)</span></p>
        <p>Once approved, you will receive an email notification, and you can start using our platform.</p>
        <p>We appreciate your patience and look forward to serving you.</p>
        <p>Best Regards,</p>
        <p>Csharptek</p>
    `;

    const emailData = {
        subject: "Registration Received -Status Pending",
        recipient: user.EmailId,
        body: emailBody,
        contentType: "text/html" // Ensuring HTML formatting
    };

    try {
        await axios.post(projectApiList.SendMailApi, emailData);
        console.log("📧 Registration email sent successfully!");
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

export default sendRegisterEmail;
