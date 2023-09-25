import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import { db } from '../firebaseService';
import { collection, addDoc } from 'firebase/firestore';
import * as XLSX from 'xlsx';

const DataUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setUploadMessage('');
      console.log('File selected:', selectedFile);
    }
  };

  const handleUpload = async () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target) {
          const result = e.target.result as ArrayBuffer;
          const data = new Uint8Array(result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

          // Iterate through jsonData and add each item to Firestore
          try {
            const usersCollectionRef = collection(db, 'users');
            for (const item of jsonData) {
              await addDoc(usersCollectionRef, item);
            }

            setUploadMessage('Upload successful');
            console.log('Upload successful');
          } catch (error) {
            console.error('Error uploading data:', error);
            setUploadMessage('Upload failed');
            console.log('Upload failed');
          }
        } else {
          console.log('e.target not found');
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      <div>
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
        />
        {file && (
          <Button variant="contained" onClick={handleUpload}>
            Upload Data
          </Button>
        )}
        <Typography variant="subtitle1">{uploadMessage}</Typography>
      </div>
    </div>
  );
};

export default DataUpload;
