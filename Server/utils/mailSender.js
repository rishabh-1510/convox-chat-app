require("dotenv").config();
const SibApiV3Sdk = require("sib-api-v3-sdk");

const mailSender = async (email, title, body) => {
  const client = SibApiV3Sdk.ApiClient.instance;
  client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

  const api = new SibApiV3Sdk.TransactionalEmailsApi();
  const result = await api.sendTransacEmail({
    sender: { email: "belwalrishabh5@gmail.com", name: "ConvoX" },
    to: [{ email }],
    subject: title,
    htmlContent: body,
  });

  console.log("Brevo result:", result); // add this
};

module.exports = mailSender;