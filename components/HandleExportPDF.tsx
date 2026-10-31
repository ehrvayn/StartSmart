"use client";

export const handleExportPDF = async () => {
  const element = document.getElementById("pdf-content");
  if (!element) return;

  const html2pdfModule = await import("html2pdf.js");
  const html2pdf = html2pdfModule.default ?? html2pdfModule;

  const opt = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename: "business-analysis.pdf",
    image: { type: "png" as const, quality: 0.98 },
    html2canvas: { scale: 2, allowTaint: true, useCORS: true },
    jsPDF: { orientation: "portrait" as const, unit: "mm", format: "a4" },
    pagebreak: { mode: "avoid-all" as const },
  };
  await html2pdf().set(opt).from(element).save();
};
