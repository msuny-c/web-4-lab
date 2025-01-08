import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAsync, registerAsync } from '../store/slices/authSlice';
import type { RootState } from '../store/store';
import type { AppDispatch } from '../store/store';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Alert,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  maxWidth: '400px',
  margin: '0 auto',
  marginTop: theme.spacing(8),
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(4),
  },
}));

const Header = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  color: theme.palette.primary.main,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
  },
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiToggleButton-root': {
    textTransform: 'none',
    minWidth: 100,
  },
}));

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const validateUsername = (value: string) => {
    return value.length >= 5;
  };

  const validatePassword = (value: string) => {
    return value.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'register' && (!validateUsername(username) || !validatePassword(password))) {
        return;
      }
      if (mode === 'login') {
        await dispatch(loginAsync({ username, password })).unwrap();
      } else {
        await dispatch(registerAsync({ username, password })).unwrap();
      }
      navigate('/main');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Fade in timeout={800}>
      <Container maxWidth="sm">
        <StyledPaper elevation={0}>
          <Header variant="h4">
            Point Checker
          </Header>
          
          <Box sx={{ 
            mb: 4,
            p: 3,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            borderRadius: 1,
          }}>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              Student Information
            </Typography>
            <Typography variant={isMobile ? 'body2' : 'body1'} sx={{ color: 'text.secondary' }}>
              Name: Your Name
            </Typography>
            <Typography variant={isMobile ? 'body2' : 'body1'} sx={{ color: 'text.secondary' }}>
              Group: P3214
            </Typography>
            <Typography variant={isMobile ? 'body2' : 'body1'} sx={{ color: 'text.secondary' }}>
              Variant: 1234
            </Typography>
          </Box>
          
          <StyledToggleButtonGroup
            value={mode}
            exclusive
            onChange={(_, newMode) => newMode && setMode(newMode)}
            aria-label="auth mode"
            fullWidth
          >
            <ToggleButton value="login">
              Login
            </ToggleButton>
            <ToggleButton value="register">
              Register
            </ToggleButton>
          </StyledToggleButtonGroup>

          {error && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              error={mode === 'register' && username.length > 0 && !validateUsername(username)}
              helperText={mode === 'register' && username.length > 0 && !validateUsername(username) ? 'Username must be at least 5 characters long' : ''}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              error={mode === 'register' && password.length > 0 && !validatePassword(password)}
              helperText={mode === 'register' && password.length > 0 && !validatePassword(password) ? 'Password must be at least 6 characters long' : ''}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || (mode === 'register' && (!validateUsername(username) || !validatePassword(password)))}
              sx={{
                height: 48,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              ) : (
                mode === 'login' ? 'Login' : 'Register'
              )}
            </Button>
          </Box>
        </StyledPaper>
      </Container>
    </Fade>
  );
}

export default LoginPage; 