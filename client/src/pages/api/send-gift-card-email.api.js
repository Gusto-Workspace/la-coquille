export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

import SibApiV3Sdk from "sib-api-v3-sdk";

// Fonction pour envoyer un email transactionnel
async function sendTransactionalEmail(params) {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  // Formatage de la date (JJ/MM/AAAA, sans heure)
  const formattedValidUntil = new Date(params.validUntil).toLocaleDateString(
    "fr-FR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );

  // Contenu HTML de l'email
  const emailContent = `
    <html>
      <body>
        <p>Bonjour,</p>
        <p>Nous confirmons la commande d'une carte cadeau pour <strong>${params.beneficiaryFirstName} ${params.beneficiaryLastName}</strong>.</p>
        <p>Voici les détails de la commande :</p>
        <ul>
          <li><strong>Montant :</strong> ${params.value} €</li>
          <li><strong>Code :</strong> ${params.code}</li>
          <li><strong>Date de validité :</strong> ${formattedValidUntil}</li>
        </ul>
        <p>📎 La carte cadeau est jointe à cet email.</p>
        <p><strong>Comment utiliser la carte cadeau ?</strong></p>
        <ul>
          <li>Lors de la réservation, précisez que vous bénéficiez d'une carte cadeau.</li>
          <li>Rendez-vous au Restaurant La Coquille pour profiter d'un instant savoureux&nbsp;!</li>
          <li>Lors du paiement, donnez le code suivant : <strong>${params.code}</strong></li>
        </ul>
        <p><em><strong>⚠️ À PARTIR DU ${formattedValidUntil}, LA CARTE CADEAU NE POURRA PLUS ÊTRE UTILISÉE.</strong></em></p>
        <hr>
        <p><strong>Informations pratiques :</strong></p>
        <p>📍 Adresse : 1 Rue du Moros, 29900 Concarneau</p>
        <p>📞 Téléphone : 02 98 97 08 52</p>
        <p>🌐 Site internet : <a href="https://www.lacoquille-concarneau.fr" target="_blank">www.lacoquille-concarneau.fr</a></p>
        <p>Merci pour votre commande et à bientôt,</p>
        <p><strong>${params.restaurantName}</strong></p>
      </body>
    </html>
  `;

  // Configuration de l'email
  const mainEmail = {
    sender: {
      email: "no-reply@lacoquille-concarneau.fr",
      name: params.restaurantName,
    },
    to: [
      {
        email: params.sendEmail,
        name: params.sendEmail,
      },
    ],
    subject: `Confirmation de commande - Carte cadeau ${params.restaurantName}`,
    htmlContent: emailContent,
    attachment: [
      {
        name: "Carte_Cadeau.pdf",
        content: params.attachment,
      },
    ],
  };

  // Envoi de l'email
  try {
    const response = await apiInstance.sendTransacEmail(mainEmail);
    console.log("Email envoyé avec succès :", response);
    return response;
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'email :",
      error.response?.body || error
    );
    throw error;
  }
}

// Route API pour gérer les requêtes POST
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const data = req.body;

    // Validation des données entrantes
    if (
      !data.beneficiaryFirstName ||
      !data.beneficiaryLastName ||
      !data.sendEmail ||
      !data.value ||
      !data.code ||
      !data.validUntil ||
      !data.attachment
    ) {
      return res
        .status(400)
        .json({ message: "Paramètres manquants ou invalides" });
    }

    // Préparation des paramètres pour l'email
    const paramsEmail = {
      restaurantName: "Restaurant La Coquille",
      beneficiaryFirstName: data.beneficiaryFirstName,
      beneficiaryLastName: data.beneficiaryLastName,
      sendEmail: data.sendEmail,
      value: data.value,
      code: data.code,
      validUntil: data.validUntil,
      attachment: data.attachment,
    };

    // Envoi de l'email
    const emailResponse = await sendTransactionalEmail(paramsEmail);

    return res.status(200).json({
      status: 200,
      message: "Email envoyé avec succès",
      data: emailResponse,
    });
  } catch (err) {
    console.error("Erreur lors de la gestion de la requête POST :", err);
    return res
      .status(500)
      .json({ message: "Erreur lors de l'envoi de l'email" });
  }
}
