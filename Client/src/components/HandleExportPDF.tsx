import html2pdf from "html2pdf.js";

export const handleExportPDF = () => {
  const element = document.getElementById("pdf-content");
  if (!element) return;

  const opt = {
    margin: 10,
    filename: "business-analysis.pdf",
    image: { type: "png" as const, quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: "portrait" as const, unit: "mm", format: "a4" },
  };
  html2pdf().set(opt).from(element).save();
};
