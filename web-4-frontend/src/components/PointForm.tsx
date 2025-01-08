import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Autocomplete,
  CircularProgress,
} from '@mui/material';

const X_OPTIONS = ['-3', '-2', '-1', '0', '1', '2', '3', '4', '5'];
const R_OPTIONS = ['1', '2', '3', '4', '5'];

interface PointFormProps {
  loading: boolean;
  onSubmit: (x: number, y: number, r: number) => void;
  onRChange: (r: string | null) => void;
}

const PointForm = ({ loading, onSubmit, onRChange }: PointFormProps) => {
  const [x, setX] = useState<string | null>(null);
  const [y, setY] = useState('');
  const [r, setR] = useState<string | null>(null);

  const validateY = (value: string) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= -3 && num <= 5;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (x && y && r) {
      onSubmit(parseFloat(x), parseFloat(y), parseFloat(r));
      setX(null);
      setY('');
    }
  };

  const handleRChange = (newValue: string | null) => {
    setR(newValue);
    onRChange(newValue);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Enter Coordinates
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Autocomplete
          options={X_OPTIONS}
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
          options={R_OPTIONS}
          value={r}
          onChange={(_, newValue) => handleRChange(newValue)}
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
  );
};

export default PointForm; 