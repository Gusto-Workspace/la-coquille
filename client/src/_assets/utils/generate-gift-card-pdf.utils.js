import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function generateGiftCardPdf({
  value,
  code,
  validUntil,
  description,
  restaurantName,
  beneficiaryName,
  senderName,
  comment,
}) {
  const pdfDoc = await PDFDocument.create();

  // Dimensions pour un ratio 16/9
  const width = 800;
  const height = 450;

  // Charger l'image de fond
  const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/img/assets/bg-drinks.png`;
  const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());
  const backgroundImage = await pdfDoc.embedPng(imageBytes); 

  // Ajouter une page avec une taille personnalisée
  const page = pdfDoc.addPage([width, height]);

  // Dessiner l'image de fond
  page.drawImage(backgroundImage, {
    x: 0,
    y: 0,
    width: width,
    height: height,
  });

  // Configurer la police et les styles
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 18;

  const textColor = rgb(1, 1, 1); // Blanc
  const textX = 50;
  let textY = height - 50;

  // Ajouter le contenu
  page.drawText(`Carte Cadeau - ${restaurantName}`, {
    x: textX,
    y: textY,
    size: fontSize + 4,
    font,
    color: textColor,
  });

  textY -= 40;
  page.drawText(`Bénéficiaire: ${beneficiaryName}`, {
    x: textX,
    y: textY,
    size: fontSize,
    font,
    color: textColor,
  });

  textY -= 30;
  page.drawText(`Valeur: ${value} €`, {
    x: textX,
    y: textY,
    size: fontSize,
    font,
    color: textColor,
  });

  if (description) {
    textY -= 30;
    page.drawText(`Description: ${description}`, {
      x: textX,
      y: textY,
      size: fontSize,
      font,
      color: textColor,
    });
  }

  textY -= 30;
  page.drawText(`Code: ${code}`, {
    x: textX,
    y: textY,
    size: fontSize,
    font,
    color: textColor,
  });

  textY -= 30;
  page.drawText(`Valable jusqu'au: ${validUntil}`, {
    x: textX,
    y: textY,
    size: fontSize,
    font,
    color: textColor,
  });

  if (senderName) {
    textY -= 30;
    page.drawText(`De la part de: ${senderName}`, {
      x: textX,
      y: textY,
      size: fontSize,
      font,
      color: textColor,
    });
  }

  if (comment) {
    textY -= 40;
    page.drawText(`Message: "${comment}"`, {
      x: textX,
      y: textY,
      size: fontSize,
      font,
      color: textColor,
    });
  }

  // Sauvegarder le PDF
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes).toString("base64"); // Retourne le contenu en base64
}
