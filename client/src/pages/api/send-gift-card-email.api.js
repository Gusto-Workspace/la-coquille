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

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    const formattedValidUntil = new Date(params.validUntil).toLocaleDateString(
      "fr-FR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );

    // Construire le contenu de l'email dynamiquement
    let emailContent = `
      <html>
        <body>
          <p>Bonjour <strong>${params.beneficiaryFirstName} ${params.beneficiaryLastName}</strong>,</p>
          <p>Vous avez reçu un cadeau spécial de la part de <strong>${params.senderName}</strong> ! 🎉</p>
    `;

    // Ajouter le prix si "masquer le prix" n'est pas activé
    if (!params.hidePrice) {
      emailContent += `
        <p>Voici votre carte cadeau d'une valeur de <strong>${params.value} €</strong>.</p>
      `;
    }

    // Ajouter la description si elle existe
    if (params.description) {
      emailContent += `
        <p>Description : ${params.description}</p>
      `;
    }

    // Ajouter le message (s'il y en a un)
    if (params.message) {
      emailContent += `
        <blockquote>${params.message}</blockquote>
      `;
    }

    emailContent += `
          <p>📎 Vous trouverez votre carte cadeau en pièce jointe à cet email.</p>
          <p><strong>Comment utiliser votre carte cadeau ?</strong></p>
          <ul>
            <li>Lors de votre réservation, précisez que vous bénéficiez d'une carte cadeau.</li>
            <li>Rendez-vous au Restaurant La Coquille pour profiter d'un instant savoureux !</li>
            <li>Lors du paiement, donnez le code suivant : <strong>${params.code}</strong></li>
          </ul>
          <p>Cette carte est valable jusqu'au <strong>${formattedValidUntil}</strong>.</p>
          <p>Nous sommes ravis de vous accueillir et espérons que vous passerez un excellent moment !</p>
          <p>Cordialement,</p>
          <p><strong>${params.restaurantName}</strong></p>
        </body>
      </html>
    `;

    sendSmtpEmail.htmlContent = emailContent;

    sendSmtpEmail.sender = {
      email: "baccialone.leo@gmail.com",
      name: params.restaurantName,
    };

    // Ajouter le destinataire principal
    sendSmtpEmail.to = [
      {
        email: params.beneficiaryEmail,
        name: `${params.beneficiaryFirstName} ${params.beneficiaryLastName}`,
      },
    ];

    // Ajouter une copie si nécessaire
    if (params.sendCopy && params.copyEmail) {
      sendSmtpEmail.cc = [
        {
          email: params.copyEmail,
          name: `Copie : ${params.senderName}`,
        },
      ];

      // Ajoutez un message spécifique pour la copie
      sendSmtpEmail.htmlContent += `
        <p><em>Copie du mail envoyé à ${params.beneficiaryFirstName} ${params.beneficiaryLastName} concernant la carte cadeau.</em></p>
      `;
    }

    sendSmtpEmail.subject = `🎁 Votre carte cadeau de ${params.restaurantName}`;
    sendSmtpEmail.attachment = [
      {
        name: "Carte_Cadeau.pdf",
        content: params.attachment,
      },
    ];

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
        restaurantName: "Restaurant La Coquille",
        beneficiaryFirstName: data.beneficiaryFirstName,
        beneficiaryLastName: data.beneficiaryLastName,
        beneficiaryEmail: data.beneficiaryEmail,
        senderName: data.senderName,
        value: data.value,
        description: data.description,
        code: data.code,
        message: data.message,
        validUntil: data.validUntil,
        attachment: data.attachment, // PDF encodé en base64
        hidePrice: data.hidePrice,
        sendCopy: data.sendCopy,
        copyEmail: data.copyEmail,
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

