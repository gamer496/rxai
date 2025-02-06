import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, Container, TextField, Button, Paper, AppBar, Toolbar,
  List, ListItem, ListItemText, ListItemSecondaryAction, Divider, CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { authApi, prescriptionApi } from '../utils/api';
import { Prescription } from '../types';

const Home: React.FC = () => {
  const { isAuthenticated, userType, login, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!isAuthenticated || !userType) return;
      
      setLoading(true);
      try {
        const data = userType === 'customer' 
          ? await prescriptionApi.getCustomerPrescriptions()
          : await prescriptionApi.getDoctorPrescriptions();
        setPrescriptions(data);
      } catch (err) {
        console.error('Failed to fetch prescriptions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [isAuthenticated, userType]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await authApi.login(username, password);
      await login(data.access_token, data.userType);
      setError('');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF files are allowed');
      return;
    }
    
    setUploadError(null);
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Upload file
      const uploadResult = await prescriptionApi.uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });
      
      // Process prescription
      setProcessing(true);
      await prescriptionApi.createFromUpload(uploadResult.url);
      
      // Refresh prescriptions list
      const data = userType === 'customer' 
        ? await prescriptionApi.getCustomerPrescriptions()
        : await prescriptionApi.getDoctorPrescriptions();
      setPrescriptions(data);
    } catch (err) {
      console.error('Failed to process prescription:', err);
      setUploadError(err instanceof Error ? err.message : 'Failed to process prescription');
    } finally {
      setUploading(false);
      setProcessing(false);
      setUploadProgress(0);
    }
  };

  const handleRegenerate = async (prescriptionId: number) => {
    console.log('ok');
  };

  if (isAuthenticated && userType) {
    return (
      <>
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6">RxAI</Typography>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg">
          <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Welcome, {userType}!
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                Prescriptions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                <input
                  type="file"
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                <Button
                  variant="contained"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || processing}
                >
                  {uploading ? 'Uploading...' : processing ? 'Processing...' : 'Upload Prescription'}
                </Button>
                {(uploading || processing) && (
                  <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress
                      variant={uploading ? "determinate" : "indeterminate"}
                      value={uploadProgress}
                      size={20}
                    />
                    <Typography variant="caption">
                      {uploading ? `${Math.round(uploadProgress)}%` : 'Processing...'}
                    </Typography>
                  </Box>
                )}
                {uploadError && (
                  <Typography color="error" variant="caption">
                    {uploadError}
                  </Typography>
                )}
              </Box>
            </Box>
            {loading ? (
              <Typography>Loading prescriptions...</Typography>
            ) : prescriptions.length > 0 ? (
              <Paper elevation={2}>
                <List>
                  {prescriptions.map((prescription, index) => (
                    <React.Fragment key={prescription.id}>
                      {index > 0 && <Divider />}
                      <ListItem>
                        <ListItemText
                          primary={prescription.name}
                          secondary={`Medicine Type: ${prescription.medicineType} • Created: ${new Date(prescription.createdAt).toLocaleDateString()}`}
                        />
                        {userType === 'customer' && (
                          <ListItemSecondaryAction>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleRegenerate(prescription.id)}
                            >
                              Regenerate
                            </Button>
                          </ListItemSecondaryAction>
                        )}
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            ) : (
              <Typography>No prescriptions found.</Typography>
            )}
          </Box>
        </Container>
      </>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Welcome to RxAI
        </Typography>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h2" variant="h5" gutterBottom>
            Login
          </Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home; 