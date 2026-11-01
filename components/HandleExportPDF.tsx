"use client";

export const handleExportPDF = async () => {
  const element = document.getElementById("pdf-content");
  if (!element) return;

  // Prepare an off-screen copy so the PDF gets a single-column report without
  // mutating (or reflowing) the page the user is looking at. The page-break
  // pass in html2pdf measures this copy, so it must be flattened up front.
  const source = element.cloneNode(true) as HTMLElement;
  source.querySelectorAll<HTMLElement>("[data-pdf-grid]").forEach((grid) => {
    grid.style.display = "block";
  });
  // The report column is ~700px wide in the PDF, so four metric columns
  // leave too little room for values such as "₱1,230,000". Use two.
  const header = source.querySelector("section");
  const headerInner = header?.firstElementChild as HTMLElement | null;
  if (headerInner) {
    headerInner.style.paddingTop = "24px";
    headerInner.style.paddingBottom = "24px";
  }

  const title = header?.querySelector("h1");
  if (title) {
    title.style.fontSize = "28px";
    title.style.lineHeight = "34px";
  }

  source
    .querySelectorAll<HTMLElement>("[data-pdf-metrics]")
    .forEach((metrics) => {
      metrics.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
      metrics.style.marginTop = "32px";
    });

  const metricDetail = header?.querySelector("[data-pdf-metrics] + p");
  if (metricDetail) {
    (metricDetail as HTMLElement).style.marginTop = "12px";
  }
  source.querySelectorAll("[data-pdf-ignore]").forEach((node) => {
    node.remove();
  });

  const html2pdfModule = await import("html2pdf.js");
  const html2pdf = html2pdfModule.default ?? html2pdfModule;

  const opt = {
    margin: [12, 12, 12, 12] as [number, number, number, number],
    filename: "startsmart-business-analysis.pdf",
    image: { type: "jpeg" as const, quality: 0.95 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      // Keep the exported report light even when the app is in dark mode.
      onclone: (clonedDocument: Document) => {
        clonedDocument.documentElement.setAttribute("data-theme", "light");
      },
    },
    jsPDF: { orientation: "portrait" as const, unit: "mm", format: "a4" },
    pagebreak: { mode: "avoid-all" as const },
  };

  await html2pdf().set(opt).from(source).save();
};
