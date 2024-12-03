import SibApiV3Sdk from "sib-api-v3-sdk";

async function sendTransactionalEmail(params) {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  // Création de l'objet pour l'envoi de l'email
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
    // Envoi de l'email via l'API
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

    // Préparation des paramètres pour l'envoi
    const params = {
      to: [{ email: "contact@gusto-manager.com", name: "Marie" }],
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
