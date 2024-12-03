import SibApiV3Sdk from "sib-api-v3-sdk";

async function sendTransactionalEmail(params) {
  // Configuration du client avec la clé API
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = {
    sender: {
      email: "no-reply@lacoquille-concarneau.fr",
      name: "Formulaire Contact",
    },
    to: params.to,
    subject: params.subject,
    htmlContent: `
      <html>
        <body>
          <p><strong>Nom:</strong> ${params.name}</p>
          <p><strong>Email:</strong> ${params.email}</p>
          <p><strong>Téléphone:</strong> ${params.phone}</p>
          <p><strong>Message:</strong> ${params.message}</p>
        </body>
      </html>`,
    replyTo: {
      email: params.email,
      name: params.name,
    },
  };

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email envoyé avec succès :", data);
    return data;
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'email:",
      error.response ? error.response.body : error
    );
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    const params = {
      to: [{ email: "restaurant-la-coquille@orange.fr", name: "Marie" }],
      subject: "Nouveau message via le formulaire de contact",
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
    };

    try {
      await sendTransactionalEmail(params);
      return res.status(200).json({ message: "Email envoyé avec succès" });
    } catch (error) {
      console.error("Erreur d'envoi :", error);
      return res
        .status(500)
        .json({ message: "Erreur lors de l'envoi de l'email" });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
