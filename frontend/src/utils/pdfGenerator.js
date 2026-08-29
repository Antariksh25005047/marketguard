import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const downloadPDF = async (elementId, fileName) => {
  const input = document.getElementById(elementId);

  if (!input) return;

  const canvas = await html2canvas(input, {
    scale: 2,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

  pdf.save(fileName);
};
