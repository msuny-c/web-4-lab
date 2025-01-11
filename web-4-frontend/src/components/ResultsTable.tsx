import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Анимированная строка таблицы
const AnimatedTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

// Типы данных
interface Point {
  x: number;
  y: number;
  r: number;
  result: boolean;
  timestamp: string;
}

interface ResultsTableProps {
  points: Point[];
}

const ResultsTable = ({ points }: ResultsTableProps) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>X</TableCell>
            <TableCell>Y</TableCell>
            <TableCell>R</TableCell>
            <TableCell>Result</TableCell>
            <TableCell>Date</TableCell>
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
  );
};

export default ResultsTable; 