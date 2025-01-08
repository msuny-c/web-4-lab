import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
  Alert,
  CircularProgress,
  Fade,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { logout } from '../store/slices/authSlice';
import { checkPointAsync, getAllPointsAsync } from '../store/slices/pointsSlice';
import type { RootState } from '../store/store';
import type { AppDispatch } from '../store/store';
import LogoutIcon from '@mui/icons-material/Logout';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  maxWidth: '1200px !important',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const AnimatedTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const xOptions = ['-3', '-2', '-1', '0', '1', '2', '3', '4', '5'];
const rOptions = ['-3', '-2', '-1', '0', '1', '2', '3', '4', '5'];

function MainPage() {
  const [x, setX] = useState<string | null>(null);
  const [y, setY] = useState('');
  const [r, setR] = useState<string | null>(null);
  const { points, loading, error } = useSelector((state: RootState) => state.points);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        await dispatch(getAllPointsAsync()).unwrap();
      } catch (err) {
        if (err instanceof Error && err.message === 'Session expired. Please login again.') {
          dispatch(logout());
          navigate('/');
        }
      }
    };
    fetchPoints();
  }, [dispatch, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (x && y && r) {
      try {
        await dispatch(checkPointAsync({
          x: parseFloat(x),
          y: parseFloat(y),
          r: parseFloat(r),
        })).unwrap();
        setX(null);
        setY('');
        setR(null);
      } catch (err) {
        if (err instanceof Error && err.message === 'Session expired. Please login again.') {
          dispatch(logout());
          navigate('/');
        }
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const validateY = (value: string) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= -3 && num <= 5;
  };

  return (
    <Fade in timeout={800}>
      <StyledContainer>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" color="primary">
            Point Checker
          </Typography>
          <IconButton
            onClick={handleLogout}
            color="primary"
            sx={{
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { md: '350px 1fr' } }}>
          <StyledPaper>
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Enter Coordinates
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Autocomplete
                  options={xOptions}
                  value={x}
                  onChange={(_, newValue) => setX(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="X Coordinate"
                      required
                      disabled={loading}
                    />
                  )}
                />
                
                <TextField
                  label="Y Coordinate"
                  type="number"
                  value={y}
                  onChange={(e) => setY(e.target.value)}
                  error={y !== '' && !validateY(y)}
                  helperText={y !== '' && !validateY(y) ? 'Y must be between -3 and 5' : ''}
                  required
                  disabled={loading}
                  inputProps={{
                    step: 'any',
                    min: -3,
                    max: 5,
                  }}
                />
                
                <Autocomplete
                  options={rOptions}
                  value={r}
                  onChange={(_, newValue) => setR(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Radius"
                      required
                      disabled={loading}
                    />
                  )}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 1,
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
                    'Check Point'
                  )}
                </Button>
              </Box>
            </Box>
          </StyledPaper>

          <StyledPaper>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Results History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>X</TableCell>
                    <TableCell>Y</TableCell>
                    <TableCell>R</TableCell>
                    <TableCell>Result</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {points.map((point, index) => (
                    <AnimatedTableRow key={index}>
                      <TableCell>{point.x}</TableCell>
                      <TableCell>{point.y}</TableCell>
                      <TableCell>{point.r}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            color: point.result ? 'success.main' : 'error.main',
                            fontWeight: 500,
                          }}
                        >
                          {point.result ? 'Hit' : 'Miss'}
                        </Box>
                      </TableCell>
                      <TableCell>{new Date(point.timestamp).toLocaleString()}</TableCell>
                    </AnimatedTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </StyledPaper>
        </Box>
      </StyledContainer>
    </Fade>
  );
}

export default MainPage;