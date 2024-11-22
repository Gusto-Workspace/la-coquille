import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generateGiftCardPdf({
  value,
  code,
  validUntil,
  description,
  restaurantName,
  beneficiaryName,
}) {
  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage([400, 600]); // Taille A6 (environ)
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;

  // Ajouter le contenu
  page.drawText(`Carte Cadeau - ${restaurantName}`, {
    x: 50,
    y: height - 50,
    size: fontSize + 4,
    font,
    color: rgb(0, 0, 0), // Utilise la méthode `rgb` fournie par pdf-lib
  });

  page.drawText(`Bénéficiaire: ${beneficiaryName}`, {
    x: 50,
    y: height - 100,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Valeur: ${value} €`, {
    x: 50,
    y: height - 130,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Description: ${description}`, {
    x: 50,
    y: height - 160,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Code: ${code}`, {
    x: 50,
    y: height - 190,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Valable jusqu'au: ${validUntil}`, {
    x: 50,
    y: height - 220,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes).toString("base64"); // Retourne le contenu en base64
}
