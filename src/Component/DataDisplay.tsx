// src/DataDisplay.tsx
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TextField,
  TablePagination,
} from '@mui/material';
import { db } from '../firebaseService';
import { getDocs, collection } from 'firebase/firestore';

const DataDisplay: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const usersCollectionRef = collection(db, 'users');

      // Retrieve all documents in the 'users' collection
      const querySnapshot = await getDocs(usersCollectionRef);

      // Initialize an empty array to store user data
      const userDataArray: any[] = [];

      // Iterate through the documents and extract data
      querySnapshot.forEach((doc) => {
        // Access each document's data
        const userData = doc.data();
        userDataArray.push(userData);
      });

      // Update the state with the user data
      setData(userDataArray);
    };

    fetchData();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = data.filter(
    (item) =>
      item.first_name &&
      item.first_name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <TextField
        label="Search by First Name"
        variant="outlined"
        fullWidth
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: '16px' }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => (
                <TableRow key={index}>
                  {/* <TableCell>{item.id}</TableCell> */}
                  <TableCell>{item.first_name}</TableCell>
                  <TableCell>{item.last_name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.gender}</TableCell>
                  <TableCell>{item.address}</TableCell>
                  <TableCell>{item.mobile}</TableCell>
                  {/* Add other table cells for additional fields */}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[100, 250, 500]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default DataDisplay;
