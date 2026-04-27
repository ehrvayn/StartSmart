import html2pdf from "html2pdf.js";

export const handleExportPDF = () => {
  const element = document.getElementById("pdf-content");
  if (!element) return;

  const opt = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename: "business-analysis.pdf",
    image: { type: "png" as const, quality: 0.98 },
    html2canvas: { scale: 2, allowTaint: true, useCORS: true },
    jsPDF: { orientation: "portrait" as const, unit: "mm", format: "a4" },
    pagebreak: { mode: "avoid-all" as const },
  };
  html2pdf().set(opt).from(element).save();
};
