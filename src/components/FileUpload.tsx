import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";

interface IDataInvoice {
  from: string;
  to: string;
  logo: string;
  number: string;
  date: string;
  due_date: string;
  items: string;
  notes: string;
}

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | undefined | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    setFile(uploadedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("No file selected");
      return;
    }

    setIsLoading(true);

    try {
      const parsedData = await parseCsv(file);
      await sendDataToApi(parsedData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const parseCsv = (file: File): Promise<IDataInvoice[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (result: any) => {
          console.log("🚀 ~ returnnewPromise ~ result:", result.data);
          const arr_data: Array<IDataInvoice> = [];
          for (let index = 0; index < result.data.length; index++) {
            const data = result.data[index];
            console.log("🚀 ~ returnnewPromise ~ data:", data);
            const mapData: IDataInvoice = {
              from: data.from_who,
              to: data.to_who,
              logo: data.logo,
              number: data.number,
              date: data.date,
              due_date: data.due_date,
              items: JSON.parse(data.items),
              notes: data.notes,
            };
            arr_data.push(mapData);
          }

          resolve(arr_data);
        },
        error: (error) => {
          reject(new Error("Failed to parse CSV file"));
        },
        header: true, // Assuming CSV has headers
      });
    });
  };

  const sendDataToApi = async (data: any) => {
    console.log("🚀 ~ sendDataToApi ~ data:", data);
    try {
      // Replace 'your-api-endpoint' with your actual API endpoint
      await axios.post(
        "https://invoice-generator.com",
        data[0],
        {
          headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      throw new Error("Failed to send data to API");
    }
  };

  return (
    <div>
      <h2>Upload CSV File</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || isLoading}>
        Upload
      </button>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default FileUpload;
