import React, { useEffect, useState } from 'react';
import API from "../../services/axios"
import {
	Box,
	Avatar,
	Button,
	CssBaseline,
	TextField,
	Link,
	Grid,
	Typography,
	Container,
	CircularProgress
} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useStyles } from './styles';


function Login({ history }) {
	const classes = useStyles();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
	}, [errors]);

	const handleSubmit = (event) => {
		event.preventDefault();
		setLoading(true)
		const userData = { email, password };
		API
			.post('/login', userData)
			.then((response) => {
				localStorage.setItem('AuthToken', `Bearer ${response.data.token}`);
				setLoading(false);
				history.push('/');
			})
			.catch((error) => {
				setErrors(error.response.data);
				setLoading(false);
			});
	};
	console.log(errors)
	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<Box className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Login
					</Typography>
				<form className={classes.form} noValidate>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email Address"
						name="email"
						autoComplete="email"
						autoFocus
						helperText={errors.email}
						error={errors.email ? true : false}
						onChange={(event) => setEmail(event.target.value)}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						autoComplete="current-password"
						helperText={errors.password}
						error={errors.password ? true : false}
						onChange={(event) => setPassword(event.target.value)}
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
						onClick={(event) => handleSubmit(event)}
						disabled={loading || !email || !password}
					>
						Sign In
							{loading && <CircularProgress size={30} className={classes.progess} />}
					</Button>
					<Grid container>
						<Grid item>
							<Link href="signup" variant="body2">
								{"Don't have an account? Sign Up"}
							</Link>
						</Grid>
					</Grid>
					{errors.general && (
						<Typography variant="body2" className={classes.customError}>
							{errors.general}
						</Typography>
					)}
				</form>
			</Box>
		</Container>
	);
}

export default Login;
