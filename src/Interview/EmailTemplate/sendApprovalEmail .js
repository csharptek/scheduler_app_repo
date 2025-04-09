import axios from "axios";
import { projectApiList } from "../../config/config";

const SendApprovalEmail = async ({ user }) => {
    if (!user || !user.EmailId) {
        console.error("❌ Missing User Email.");
        return;
    }

    // Format the email using UPN rule
    const formattedUpn = user.EmailId.replace("@", "_") + "#EXT#@csharptek.onmicrosoft.com";

    const emailData = {
        subject: "Account Approved - Action Required",
        recipient: user.EmailId,
        body: `
            <p>Dear ${user.Name},</p>
            <p>You have been approved by the admin. Now you can add candidates to the system.</p>
            <p><strong>Login Credentials:</strong></p>
            <ul>
                <li><strong>Email:</strong> ${formattedUpn}</li>
                <li><strong>Password:</strong> Welcome@1234</li>
            </ul>
            <p><strong>Note:</strong> You must change your password upon your first login.</p>
            <p>Best Regards,</p>
            <p>Csharptek</p>
        `,
        contentType: "text/html" // Ensure email is sent as HTML
    };

    try {
        await axios.post(projectApiList.SendMailApi, emailData);
        console.log("✅ Approval email sent successfully");
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

export default SendApprovalEmail;
