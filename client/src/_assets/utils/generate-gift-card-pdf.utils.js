import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

export async function generateGiftCardPdf({
  value,
  code,
  validUntil,
  description,
  beneficiaryName,
  senderName,
  message,
  hidePrice,
}) {
  const pdfDoc = await PDFDocument.create();

  // Enregistrer fontkit
  pdfDoc.registerFontkit(fontkit);

  // Dimensions pour un ratio 16/9
  const width = 1200;
  const height = 675;
  const effectiveWidth = (2 / 3) * width; // Largeur effective pour centrer sur les deux tiers droits

  // Charger l'image de fond
  const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/img/assets/bg-gift-card.png`;
  const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());
  const backgroundImage = await pdfDoc.embedPng(imageBytes);

  // Charger les polices
  const abelFontUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/fonts/Abel-Regular.ttf`;
  const abelFontBytes = await fetch(abelFontUrl).then((res) =>
    res.arrayBuffer()
  );
  const abelFont = await pdfDoc.embedFont(abelFontBytes);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Ajouter une page avec une taille personnalisée
  const page = pdfDoc.addPage([width, height]);

  // Dessiner l'image de fond
  page.drawImage(backgroundImage, {
    x: 0,
    y: 0,
    width: width,
    height: height,
  });

  // Configurer les styles
  const largeFontSize = 56;
  const fontSize = 32;
  const smallFontSize = 26;
  const largeSpacing = 0; // Espacement sous "Carte Cadeau"
  const lineHeightReduced = fontSize - 10; // Espacement réduit
  const topMargin = 10; // Marge au-dessus de "Carte Cadeau"
  const bottomSpacing = 20; // Espacement au-dessus de "Code :"
  const textColor = rgb(0, 0, 0); // Noir
  const maxTextWidth = effectiveWidth - 40; // Largeur maximale du texte dans les deux tiers droits

  // Fonction pour gérer les retours à la ligne
  const wrapText = (text, font, fontSize, maxWidth) => {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testLineWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testLineWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  // Convertir validUntil au format jj/mm/aaaa
  const formattedValidUntil = new Date(validUntil).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Calculer la hauteur totale du contenu
  let totalHeight = topMargin;
  totalHeight += largeFontSize + largeSpacing; // "Carte Cadeau"
  if (!hidePrice && value) totalHeight += fontSize + lineHeightReduced; // Prix
  if (description) {
    const wrappedDescription = wrapText(
      description,
      abelFont,
      fontSize,
      maxTextWidth
    );
    totalHeight += wrappedDescription.length * (fontSize + lineHeightReduced); // Hauteur totale pour chaque ligne de la description
  }
  totalHeight += Math.max(smallFontSize, fontSize) + lineHeightReduced; // "Pour :" + bénéficiaire
  if (message) {
    const wrappedMessage = wrapText(message, abelFont, fontSize, maxTextWidth);
    totalHeight += wrappedMessage.length * (fontSize + lineHeightReduced); // Hauteur totale pour chaque ligne du message
  }
  if (senderName)
    totalHeight += Math.max(smallFontSize, fontSize) + lineHeightReduced; // "De la part de :"
  totalHeight += smallFontSize + bottomSpacing; // "Code :" avec espace avant
  totalHeight += smallFontSize + lineHeightReduced; // "Valable jusqu'au :"

  // Position initiale pour centrer verticalement
  let currentY = (height + totalHeight) / 2;

  // Marge au-dessus de "Carte Cadeau"
  currentY -= topMargin;

  // Dessiner "Carte Cadeau"
  page.drawText("Carte Cadeau", {
    x:
      width / 3 +
      (effectiveWidth -
        abelFont.widthOfTextAtSize("Carte Cadeau", largeFontSize)) /
        2,
    y: currentY,
    size: largeFontSize,
    font: abelFont,
    color: textColor,
  });
  currentY -= largeFontSize + largeSpacing;

  // Dessiner le prix
  if (!hidePrice && value) {
    page.drawText(`${value} €`, {
      x:
        width / 3 +
        (effectiveWidth - abelFont.widthOfTextAtSize(`${value} €`, fontSize)) /
          2,
      y: currentY,
      size: fontSize,
      font: abelFont,
      color: textColor,
    });
    currentY -= fontSize + lineHeightReduced;
  }

  // Dessiner la description avec retour à la ligne
  if (description) {
    const wrappedDescription = wrapText(
      description,
      abelFont,
      fontSize,
      maxTextWidth
    );
    wrappedDescription.forEach((line) => {
      page.drawText(line, {
        x:
          width / 3 +
          (effectiveWidth - abelFont.widthOfTextAtSize(line, fontSize)) / 2,
        y: currentY,
        size: fontSize,
        font: abelFont,
        color: textColor,
      });
      currentY -= fontSize + lineHeightReduced;
    });
  }

  // Dessiner "Pour :" et le bénéficiaire
  const forText = `Pour :`;
  const forTextWidth = italicFont.widthOfTextAtSize(forText, smallFontSize);
  const nameTextWidth = abelFont.widthOfTextAtSize(beneficiaryName, fontSize);
  const combinedWidthFor = forTextWidth + nameTextWidth + 10;
  const combinedXFor = width / 3 + (effectiveWidth - combinedWidthFor) / 2;

  page.drawText(forText, {
    x: combinedXFor,
    y: currentY,
    size: smallFontSize,
    font: italicFont,
    color: textColor,
  });

  page.drawText(beneficiaryName, {
    x: combinedXFor + forTextWidth + 10,
    y: currentY,
    size: fontSize,
    font: abelFont,
    color: textColor,
  });
  currentY -= Math.max(smallFontSize, fontSize) + lineHeightReduced;

  // Dessiner le message
  if (message) {
    const wrappedMessage = wrapText(
      `"${message}"`,
      abelFont,
      fontSize,
      maxTextWidth
    );
    wrappedMessage.forEach((line) => {
      page.drawText(line, {
        x:
          width / 3 +
          (effectiveWidth - abelFont.widthOfTextAtSize(line, fontSize)) / 2,
        y: currentY,
        size: fontSize,
        font: abelFont,
        color: textColor,
      });
      currentY -= fontSize + lineHeightReduced;
    });
  }

  // Dessiner "De la part de :" et le SenderName
  if (senderName) {
    const fromText = `De la part de :`;
    const fromTextWidth = italicFont.widthOfTextAtSize(fromText, smallFontSize);
    const senderTextWidth = abelFont.widthOfTextAtSize(senderName, fontSize);
    const combinedWidthFrom = fromTextWidth + senderTextWidth + 10;
    const combinedXFrom = width / 3 + (effectiveWidth - combinedWidthFrom) / 2;

    page.drawText(fromText, {
      x: combinedXFrom,
      y: currentY,
      size: smallFontSize,
      font: italicFont,
      color: textColor,
    });

    page.drawText(senderName, {
      x: combinedXFrom + fromTextWidth + 10,
      y: currentY,
      size: fontSize,
      font: abelFont,
      color: textColor,
    });
    currentY -= Math.max(smallFontSize, fontSize) + lineHeightReduced;
  }

  // Dessiner "Code :" avec une marge
  currentY -= bottomSpacing;
  page.drawText(`Code : ${code}`, {
    x:
      width / 3 +
      (effectiveWidth -
        abelFont.widthOfTextAtSize(`Code : ${code}`, smallFontSize)) /
        2,
    y: currentY,
    size: smallFontSize,
    font: abelFont,
    color: textColor,
  });
  currentY -= smallFontSize + lineHeightReduced;

  // Dessiner "Valable jusqu'au :"
  page.drawText(`Valable jusqu'au : ${formattedValidUntil}`, {
    x:
      width / 3 +
      (effectiveWidth -
        abelFont.widthOfTextAtSize(
          `Valable jusqu'au : ${formattedValidUntil}`,
          smallFontSize
        )) /
        2,
    y: currentY,
    size: smallFontSize,
    font: abelFont,
    color: textColor,
  });
  currentY -= smallFontSize + lineHeightReduced;

  // Réduire la taille du texte pour le bloc supplémentaire
  const additionalFontSize = smallFontSize - 6; // Par exemple, on réduit de 6 points

  // Ajouter le texte supplémentaire sous "Valable jusqu'au..."
  const additionalText =
    "Pour utiliser ce bon, réserver au 02 98 97 08 52 en indiquant le code de votre bon cadeau";
  const wrappedAdditionalText = wrapText(
    additionalText,
    abelFont,
    additionalFontSize,
    maxTextWidth
  );
  wrappedAdditionalText.forEach((line) => {
    page.drawText(line, {
      x:
        width / 3 +
        (effectiveWidth -
          abelFont.widthOfTextAtSize(line, additionalFontSize)) /
          2,
      y: currentY,
      size: additionalFontSize,
      font: abelFont,
      color: textColor,
    });
    currentY -= additionalFontSize + lineHeightReduced;
  });

  // Sauvegarder le PDF
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes).toString("base64");
}
