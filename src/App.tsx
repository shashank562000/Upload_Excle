import React from 'react';
import { Container, CssBaseline, Typography } from '@mui/material';
import DataUpload from './Component/DataUpload';
import DataDisplay from './Component/DataDisplay';

function App() {
  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <Typography variant="h4">Excel to Firestore App</Typography>
      <DataUpload />
      <DataDisplay />
    </Container>
  );
}

export default App;
