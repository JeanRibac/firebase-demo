import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { authMiddleWare } from '../../util/auth';
import API from '../../services/axios';

import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Card, CardActions, CardContent, Divider, Button, Grid, TextField, Box } from '@material-ui/core';

import { useStyle } from "./styles"

function Account({ history }) {
	const classes = useStyle();
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [country, setCountry] = useState('');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [uiLoading, setUiLoading] = useState(false);
	const [buttonLoading, setButtonLoading] = useState(false);
	const [imageError, setImageError] = useState(false);
	const [image, setImage] = useState("");
	const [content] = useState("")

	const getUserDetails = useCallback(async () => {
		setUiLoading(true);
		authMiddleWare(history);
		const authToken = localStorage.getItem('AuthToken');
		API.defaults.headers.common = { Authorization: `${authToken}` };
		try {
			const { data } = await API.get('/user')
			setFirstName(data.userCredentials.firstName);
			setLastName(data.userCredentials.lastName);
			setEmail(data.userCredentials.email);
			setPhoneNumber(data.userCredentials.phoneNumber);
			setCountry(data.userCredentials.country);
			setUsername(data.userCredentials.username);
			setUiLoading(false);
		} catch (error) {
			if (error.response.status === 403) {
				history.push('/login');
			}
			console.log(error);
		}
	}, [history]);

	useEffect(() => {
		getUserDetails()
	}, [getUserDetails, history])

	const handleImageChange = (event) => {
		setImage(event.target.files[0])
	};

	const profilePictureHandler = async (event) => {
		try {
			event.preventDefault();
			setUiLoading(true)
			authMiddleWare(history);
			const authToken = localStorage.getItem('AuthToken');
			let form_data = new FormData();
			form_data.append('image', image);
			form_data.append('content', content);
			API.defaults.headers.common = { Authorization: `${authToken}` };
			await API.post('/user/image', form_data, {
				headers: { 'content-type': 'multipart/form-data' }
			})
			window.location.reload()
		} catch (error) {
			if (error.response.status === 403) {
				history.push('/login');
			}
			console.log(error);
			setUiLoading(false);
			setImageError("Error in posting the data")
		}
	};

	const updateFormValues = async (event) => {
		try {
			event.preventDefault();
			setButtonLoading(true);
			authMiddleWare(history);
			const authToken = localStorage.getItem('AuthToken');
			API.defaults.headers.common = { Authorization: `${authToken}` };
			const formRequest = {
				firstName,
				lastName,
				country,
			};
			await API.post('/user', formRequest)
			setButtonLoading(false)
		} catch (error) {
			if (error.response.status === 403) {
				history.push('/login');
			}
			console.log(error);
			setButtonLoading(false);
		}
	};

	if (uiLoading === true) {
		return (
			<main className={classes.content}>
				<Box className={classes.toolbar} />
				{uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
			</main>
		);
	} else {
		return (
			<main className={classes.content}>
				<Box className={classes.toolbar} />
				<Card className={clsx(classes.root, classes)}>
					<CardContent>
						<Box className={classes.details}>
							<Box>
								<Typography className={classes.locationText} gutterBottom variant="h4">
									{firstName} {lastName}
								</Typography>
								<Button
									variant="outlined"
									color="primary"
									type="submit"
									size="small"
									startIcon={<CloudUploadIcon />}
									className={classes.uploadButton}
									onClick={(e) => profilePictureHandler(e)}
								>
									Upload Photo
									</Button>
								<input type="file" onChange={(e) => handleImageChange(e)} />

								{imageError ? (
									<Box className={classes.customError}>
										Wrong Image Format || Supported Format are PNG and JPG
									</Box>
								) : (
										false
									)}
							</Box>
						</Box>
						<Box className={classes.progress} />
					</CardContent>
					<Divider />
				</Card>

				<br />
				<Card className={clsx(classes.root, classes)}>
					<form autoComplete="off" noValidate>
						<Divider />
						<CardContent>
							<Grid container spacing={3}>
								<Grid item md={6} xs={12}>
									<TextField
										fullWidth
										label="First name"
										margin="dense"
										name="firstName"
										variant="outlined"
										value={firstName}
										onChange={(e) => setFirstName(e.target.value)}
									/>
								</Grid>
								<Grid item md={6} xs={12}>
									<TextField
										fullWidth
										label="Last name"
										margin="dense"
										name="lastName"
										variant="outlined"
										value={lastName}
										onChange={(e) => setLastName(e.target.value)}
									/>
								</Grid>
								<Grid item md={6} xs={12}>
									<TextField
										fullWidth
										label="Email"
										margin="dense"
										name="email"
										variant="outlined"
										disabled={true}
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</Grid>
								<Grid item md={6} xs={12}>
									<TextField
										fullWidth
										label="Phone Number"
										margin="dense"
										name="phone"
										type="number"
										variant="outlined"
										disabled={true}
										value={phoneNumber}
										onChange={(e) => setPhoneNumber(e.target.value)}
									/>
								</Grid>
								<Grid item md={6} xs={12}>
									<TextField
										fullWidth
										label="User Name"
										margin="dense"
										name="userHandle"
										disabled={true}
										variant="outlined"
										value={username}
										onChange={(e) => setUsername(e.target.value)}
									/>
								</Grid>
								<Grid item md={6} xs={12}>
									<TextField
										fullWidth
										label="Country"
										margin="dense"
										name="country"
										variant="outlined"
										value={country}
										onChange={(e) => setCountry(e.target.value)}
									/>
								</Grid>
							</Grid>
						</CardContent>
						<Divider />
						<CardActions />
					</form>
				</Card>
				<Button
					color="primary"
					variant="contained"
					type="submit"
					className={classes.submitButton}
					onClick={(e) => updateFormValues(e)}
					disabled={
						buttonLoading ||
						!firstName ||
						!lastName ||
						!country
					}
				>
					Save details
						{buttonLoading && <CircularProgress size={30} className={classes.progess} />}
				</Button>
			</main>
		);
	}
}

export default Account;
