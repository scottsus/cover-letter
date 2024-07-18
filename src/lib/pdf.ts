import PDFParser from "pdf2json";

export function readPdfText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on("pdfParser_dataError", (err: any) => {
      console.error("readPdfText:", err);
      resolve("");
    });
    pdfParser.on("pdfParser_dataReady", (data: any) => {
      const text = data.Pages.map((page: any) =>
        page.Texts.map((text: any) => decodeURIComponent(text.R[0].T)).join(""),
      ).join("\n");

      resolve(text);
    });
    file
      .arrayBuffer()
      .then((buffer) => {
        pdfParser.parseBuffer(Buffer.from(buffer));
      })
      .catch((err) => {
        console.error("readPdfText:", err);
        resolve("");
      });
  });
}
