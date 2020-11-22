import React, { useState, useEffect, useCallback } from 'react';
import API from '../../services/axios';

import {
	Box,
	Drawer,
	AppBar,
	CssBaseline,
	Toolbar,
	List,
	Typography,
	Divider,
	ListItem,
	ListItemIcon,
	ListItemText,
	Avatar,
	CircularProgress
} from "@material-ui/core";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import NotesIcon from '@material-ui/icons/Notes';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import Account from '../../components/Account/account';
import Todo from '../../components/Todo/todo';

import { authMiddleWare } from '../../util/auth';

import { useStyle } from "./styles"

function Home({ history }) {
	const classes = useStyle();
	const [render, setRender] = useState(false);
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [profilePicture, setProfilePicture] = useState('')
	const [uiLoading, setUiLoading] = useState(true)

	const loadAccountPage = () => {
		setRender(true);
	};

	const loadTodoPage = () => {
		setRender(false);
	};

	const logoutHandler = () => {
		localStorage.removeItem('AuthToken');
		history.push('/login');
	};

	const getUserDetails = useCallback(async () => {
		try {
			authMiddleWare(history);
			const authToken = localStorage.getItem('AuthToken');
			API.defaults.headers.common = { Authorization: `${authToken}` };
			const { data } = await API.get('/user')
			setFirstName(data.userCredentials.firstName)
			setLastName(data.userCredentials.last)
			setUiLoading(false)
			setProfilePicture(data.userCredentials.imageUrl)
		} catch (err) {
			if (err.response.status === 403) {
				history.push('/login');
			}
			console.log(err);
		}
	}, [history])

	useEffect(() => {
		getUserDetails()
	}, [getUserDetails, history]);

	if (uiLoading === true) {
		return (
			<Box className={classes.root}>
				{uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
			</Box>
		);
	} else {
		return (
			<Box className={classes.root}>
				<CssBaseline />
				<AppBar position="fixed" className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" noWrap>
							TodoApp
							</Typography>
					</Toolbar>
				</AppBar>
				<Drawer
					className={classes.drawer}
					variant="permanent"
					classes={{
						paper: classes.drawerPaper
					}}
				>
					<Box className={classes.toolbar} />
					<Divider />
					<center>
						<Avatar src={profilePicture} className={classes.avatar} />
						<p>{firstName} {lastName}</p>
					</center>
					<Divider />
					<List>
						<ListItem button key="Todo" onClick={() => loadTodoPage()}>
							<ListItemIcon>
								<NotesIcon />
							</ListItemIcon>
							<ListItemText primary="Todo" />
						</ListItem>

						<ListItem button key="Account" onClick={() => loadAccountPage()}>
							<ListItemIcon>
								<AccountBoxIcon />
							</ListItemIcon>
							<ListItemText primary="Account" />
						</ListItem>

						<ListItem button key="Logout" onClick={() => logoutHandler()}>
							<ListItemIcon>
								<ExitToAppIcon />
							</ListItemIcon>
							<ListItemText primary="Logout" />
						</ListItem>
					</List>
				</Drawer>

				<Box>{render ? <Account /> : <Todo />}</Box>
			</Box>
		);
	}
}

export default Home;
