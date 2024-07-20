import { Document, Page, StyleSheet, Text, pdf } from "@react-pdf/renderer";
import { CheckIcon, DownloadIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { sleep } from "~/lib/utils";

export function DownloadPdfButton({
  text,
  fileName,
}: {
  text: string;
  fileName: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const downloadFile = async () => {
    if (!text) {
      toast.error("The cover letter is currently empty");
      return;
    }

    try {
      setIsLoading(true);
      const styles = StyleSheet.create({
        page: {
          flexDirection: "column",
          backgroundColor: "#ffffff",
          padding: 30,
        },
        text: {
          fontSize: 12,
          fontFamily: "Helvetica",
          lineHeight: 1.5,
        },
      });

      const MyDocument = () => (
        <Document>
          <Page size="LETTER" style={styles.page}>
            <Text style={styles.text}>{text}</Text>
          </Page>
        </Document>
      );

      const blob = await pdf(<MyDocument />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);

      await sleep(1000);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!isLoading ? (
        <DownloadIcon
          size={40}
          className="m-1 cursor-pointer rounded-lg p-2 transition-all hover:bg-secondary"
          onClick={downloadFile}
        />
      ) : (
        <CheckIcon color="green" size={40} className="m-1 rounded-lg p-2" />
      )}
    </div>
  );
}
