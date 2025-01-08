import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider, CssBaseline, IconButton, Box, useMediaQuery } from '@mui/material';
import { RootState } from './store/store';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import { createAppTheme } from './theme/theme';
import { useState, useEffect, useMemo } from 'react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function App() {
	const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const [mode, setMode] = useState<'light' | 'dark'>(
		localStorage.getItem('theme') as 'light' | 'dark' || (prefersDarkMode ? 'dark' : 'light')
	);

	const theme = useMemo(() => createAppTheme(mode), [mode]);

	useEffect(() => {
		localStorage.setItem('theme', mode);
	}, [mode]);

	const toggleTheme = () => {
		setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box
				sx={{
					minHeight: '100vh',
					bgcolor: 'background.default',
					transition: 'background-color 0.3s ease',
				}}
			>
				<Box
					sx={{
						position: 'fixed',
						top: 16,
						right: 16,
						zIndex: 1100,
					}}
				>
					<IconButton
						onClick={toggleTheme}
						color="inherit"
						sx={{
							bgcolor: 'background.paper',
							'&:hover': {
								bgcolor: 'action.hover',
							},
						}}
					>
						{mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
					</IconButton>
				</Box>
				<Router>
					<Routes>
						<Route
							path="/"
							element={isAuthenticated ? <Navigate to="/main" /> : <LoginPage />}
						/>
						<Route
							path="/main"
							element={isAuthenticated ? <MainPage /> : <Navigate to="/" />}
						/>
					</Routes>
				</Router>
			</Box>
		</ThemeProvider>
	);
}

export default App;
