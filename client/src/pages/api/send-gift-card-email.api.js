export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Augmente la limite à 10 Mo
    },
  },
};

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

    const formattedValidUntil = new Date(params.validUntil).toLocaleDateString(
      "fr-FR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );

    // Construire le contenu de l'email de confirmation de commande
    let emailContent = `
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
            <li>Rendez-vous au Restaurant La Coquille pour profiter d'un instant savoureux !</li>
            <li>Lors du paiement, donnez le code suivant : <strong>${params.code}</strong></li>
          </ul>
          <p><em>⚠️ Si la carte est utilisée après cette date, une majoration de 15 € sera appliquée au montant de la carte cadeau.</em></p>
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

    // Envoyer l'email de confirmation

    const mainEmail = new SibApiV3Sdk.SendSmtpEmail();
    mainEmail.sender = {
      email: "no-reply@lacoquille-concarneau.fr",
      name: params.restaurantName,
    };
    mainEmail.to = [
      {
        email: params.sendEmail,
        name: params.sendEmail,
      },
    ];
    mainEmail.subject = `Confirmation de commande - Carte cadeau ${params.restaurantName}`;
    mainEmail.htmlContent = emailContent;
    mainEmail.attachment = [
      {
        name: "Carte_Cadeau.pdf",
        content: params.attachment,
      },
    ];

    apiInstance.sendTransacEmail(mainEmail);
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
        restaurantName: "Restaurant La Coquille",
        beneficiaryFirstName: data.beneficiaryFirstName,
        beneficiaryLastName: data.beneficiaryLastName,
        sendEmail: data.sendEmail,
        senderName: data.senderName,
        value: data.value,
        description: data.description,
        code: data.code,
        message: data.message,
        validUntil: data.validUntil,
        attachment: data.attachment,
        hidePrice: data.hidePrice,
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
