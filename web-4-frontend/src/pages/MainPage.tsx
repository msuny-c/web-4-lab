import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  IconButton,
  Alert,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { logout } from '../store/slices/authSlice';
import { checkPointAsync, getAllPointsAsync } from '../store/slices/pointsSlice';
import type { RootState } from '../store/store';
import type { AppDispatch } from '../store/store';
import LogoutIcon from '@mui/icons-material/Logout';
import AreaCanvas from '../components/AreaCanvas';
import PointForm from '../components/PointForm';
import ResultsTable from '../components/ResultsTable';

// Styled Components
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

function MainPage() {
  const [selectedR, setSelectedR] = useState<string | null>(null);
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

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handlePointSubmit = async (x: number, y: number, r: number) => {
    try {
      await dispatch(checkPointAsync({ x, y, r })).unwrap();
    } catch (err) {
      if (err instanceof Error && err.message === 'Session expired. Please login again.') {
        dispatch(logout());
        navigate('/');
      }
    }
  };

  const handleCanvasClick = (x: number, y: number) => {
    if (selectedR) {
      handlePointSubmit(
        Number(x.toFixed(2)),
        Number(y.toFixed(2)),
        parseFloat(selectedR)
      );
    }
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

        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { md: '1fr 1fr' } }}>
          <StyledPaper>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="h6">
                Area Visualization
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <AreaCanvas
                  points={points}
                  currentR={selectedR ? parseFloat(selectedR) : null}
                  onPointClick={handleCanvasClick}
                />
              </Box>
            </Box>
          </StyledPaper>

          <StyledPaper>
            <PointForm
              loading={loading}
              onSubmit={handlePointSubmit}
              onRChange={setSelectedR}
            />
          </StyledPaper>

          <StyledPaper sx={{ gridColumn: '1 / -1' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Results History
            </Typography>
            <ResultsTable points={points} />
          </StyledPaper>
        </Box>
      </StyledContainer>
    </Fade>
  );
}

export default MainPage;