import SibApiV3Sdk from "sib-api-v3-sdk";

function instantiateClient() {
  try {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications["api-key"];

    apiKey.apiKey = process.env.BREVO_API_KEY;
    return defaultClient;
  } catch (err) {
    console.error("Erreur lors de l'instanciation du client:", err);
    throw new Error(err);
  }
}

function sendTransactionalEmail(params) {
  try {
    instantiateClient();

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    if (params.contact) {
      sendSmtpEmail.htmlContent = `<html>
                                      <body>
                                        <p><strong>Nom:</strong> ${params.name}</p>
                                        <p><strong>Email:</strong> ${params.email}</p>
                                        <p><strong>Téléphone:</strong> ${params.phone}</p>
                                        <p><strong>Message:</strong> ${params.message}</p>
                                      </body>
                                     </html>`;
    }

    sendSmtpEmail.sender = {
      email: "no-reply@lacoquille-concarneau.fr",
      name: "Formulaire Contact",
    };

    sendSmtpEmail.replyTo = {
      email: params.email,
      name: params.email,
    };

    sendSmtpEmail.to = params.to;
    sendSmtpEmail.subject = params.subject;

    apiInstance
      .sendTransacEmail(sendSmtpEmail)
      .then((data) => {
        console.log("Email envoyé avec succès :", data);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de l'envoi de l'email:",
          error.response ? error.response.body : error
        );
      });
  } catch (err) {
    console.error("Erreur dans sendTransactionalEmail:", err);
    throw new Error(err);
  }
}

export default function handler(req, res) {
  if (req.method === "POST") {
    try {
      const data = req.body;

      const paramsEmail = {
        to: [{ email: "restaurant-la-coquille@orange.fr", name: "Marie" }],
        contact: true,
        subject: "Nouveau message via le formulaire de contact",
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      };

      sendTransactionalEmail(paramsEmail);

      return res
        .status(200)
        .json({ status: 200, message: "Email envoyé avec succès" });
    } catch (err) {
      console.error("Erreur lors de la gestion de la requête POST:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Erreur lors de l'envoi de l'email" });
    }
  } else {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }
}
