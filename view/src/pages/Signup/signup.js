import React, { useState } from 'react';

import API from '../../services/axios';
import { useStyle } from "./styles";
import {
	Box, Avatar,
	Button,
	CssBaseline,
	TextField,
	Grid,
	Link,
	Typography,
	Container,
	CircularProgress,
} from '@material-ui/core';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

function Signup({ history }) {
	const classes = useStyle();
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [country, setCountry] = useState('');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errors, setErrors] = useState([]);
	const [loading, setLoading] = useState(false);


	const handleSubmit = async (event) => {
		event.preventDefault();
		setLoading(true);
		const newUserData = {
			firstName,
			lastName,
			phoneNumber,
			country,
			username,
			email,
			password,
			confirmPassword
		};
		try {
			const { data } = await API.post('/signup', newUserData)
			localStorage.setItem('AuthToken', `Bearer ${data.token}`);
			setLoading(false)
			history.push('/');

		} catch (error) {
			setErrors(error.response.data)
			setLoading(false)
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<Box className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign up
				</Typography>
				<form className={classes.form} noValidate>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="firstName"
								label="First Name"
								name="firstName"
								autoComplete="firstName"
								helperText={errors.firstName}
								error={errors.firstName ? true : false}
								onChange={(e) => setFirstName(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="lastName"
								label="Last Name"
								name="lastName"
								autoComplete="lastName"
								helperText={errors.lastName}
								error={errors.lastName ? true : false}
								onChange={(e) => setLastName(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="username"
								label="User Name"
								name="username"
								autoComplete="username"
								helperText={errors.username}
								error={errors.username ? true : false}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="phoneNumber"
								label="Phone Number"
								name="phoneNumber"
								autoComplete="phoneNumber"
								pattern="[7-9]{1}[0-9]{9}"
								helperText={errors.phoneNumber}
								error={errors.phoneNumber ? true : false}
								onChange={(e) => setPhoneNumber(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
								helperText={errors.email}
								error={errors.email ? true : false}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="country"
								label="Country"
								name="country"
								autoComplete="country"
								helperText={errors.country}
								error={errors.country ? true : false}
								onChange={(e) => setCountry(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
								autoComplete="current-password"
								helperText={errors.password}
								error={errors.password ? true : false}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								name="confirmPassword"
								label="Confirm Password"
								type="password"
								id="confirmPassword"
								autoComplete="current-password"
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
						onClick={(e) => handleSubmit(e)}
						disabled={
							loading ||
							!email ||
							!password ||
							!firstName ||
							!lastName ||
							!country ||
							!username ||
							!phoneNumber
						}
					>
						Sign Up
							{loading && <CircularProgress size={30} className={classes.progess} />}
					</Button>
					<Grid container justify="flex-end">
						<Grid item>
							<Link href="login" variant="body2">
								Already have an account? Sign in
								</Link>
						</Grid>
					</Grid>
				</form>
			</Box>
		</Container>
	);
}

export default Signup;
