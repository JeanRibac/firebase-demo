import React, { useEffect, useState, useCallback } from 'react';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CloseIcon from '@material-ui/icons/Close';
import { useStyle } from './styles';
import {
	Box,
	Typography,
	Button,
	Dialog,
	AppBar,
	Toolbar,
	IconButton,
	Slide,
	TextField,
	Grid,
	Card,
	CardActions,
	CircularProgress,
	CardContent,
} from '@material-ui/core';

import { authMiddleWare } from '../../util/auth';
import API from '../../services/axios';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';

const Transition = React.forwardRef(
	function Transition(props, ref) {
		return <Slide direction="up" ref={ref} {...props} />;
	}
);

function Todo({ history }) {
	const classes = useStyle();
	const [todos, setTodos] = useState('');
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [todoId, setTodoId] = useState("");
	const [errors, setErrors] = useState([]);
	const [open, setOpen] = useState(false);
	const [uiLoading, setUiLoading] = useState(true);
	const [buttonType, setButtonType] = useState('');
	const [viewOpen, setViewOpen] = useState(false);
	const DialogContent = MuiDialogContent;
	dayjs.extend(relativeTime);

	const getTodos = useCallback(async () => {
		try {
			authMiddleWare(history);
			const authToken = localStorage.getItem('AuthToken');
			API.defaults.headers.common = { Authorization: `${authToken}` };
			const { data } = await API.get('/todos')
			setTodos(data);
			setUiLoading(false);
		} catch (error) {
			console.log(error);
		}
	}, [history])

	useEffect(() => getTodos(), [getTodos, history]);

	const deleteTodoHandler = async (data) => {
		try {
			authMiddleWare(history);
			const authToken = localStorage.getItem('AuthToken');
			API.defaults.headers.common = { Authorization: `${authToken}` };
			const todoId = data.todo.todoId;
			await API.delete(`todo/${todoId}`)
			window.location.reload();
		} catch (error) {
			console.log(error);
		};
	}
	const handleEditClickOpen = ({ todo }) => {
		setTitle(todo.title);
		setBody(todo.body);
		setTodoId(todo.todoId);
		setButtonType("Edit");
		setOpen(true)
	}

	const handleViewOpen = ({ todo }) => {
		setBody(todo.body);
		setTitle(todo.title);
		setViewOpen(true)
	}

	const DialogTitle = ({ children, onClose, ...other }) => {
		return (
			<MuiDialogTitle disableTypography className={classes.root} {...other}>
				<Typography variant="h6">{children}</Typography>
				{onClose ? (
					<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
						<CloseIcon />
					</IconButton>
				) : null}
			</MuiDialogTitle>
		);
	};

	const handleClickOpen = () => {
		setTodoId("");
		setTitle("");
		setBody("");
		setButtonType("");
		setOpen(true);
	};

	const handleSubmit = async (event) => {
		try {
			authMiddleWare(history);
			event.preventDefault();
			const userTodo = {
				title,
				body
			};
			let options = {};
			if (buttonType === 'Edit') {
				options = {
					url: `/todo/${todoId}`,
					method: 'put',
					data: userTodo
				};
			} else {
				options = {
					url: '/todo',
					method: 'post',
					data: userTodo
				};
			}
			const authToken = localStorage.getItem('AuthToken');
			API.defaults.headers.common = { Authorization: `${authToken}` };
			await API(options)
			setOpen(false)
			window.location.reload();
		} catch (error) {
			setOpen(false)
			setErrors(error.response.data)
			console.log(error);
		}
	};

	const handleViewClose = () => setViewOpen(false)

	const handleClose = () => setOpen(false);

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
				<IconButton
					className={classes.floatingButton}
					color="primary"
					aria-label="Add Todo"
					onClick={() => handleClickOpen()}
				>
					<AddCircleIcon style={{ fontSize: 60 }} />
				</IconButton>
				<Dialog fullScreen open={open} onClose={() => handleClose()} TransitionComponent={Transition}>
					<AppBar className={classes.appBar}>
						<Toolbar>
							<IconButton edge="start" color="inherit" onClick={() => handleClose()} aria-label="close">
								<CloseIcon />
							</IconButton>
							<Typography variant="h6" className={classes.title}>
								{buttonType === 'Edit' ? 'Edit Todo' : 'Create a new Todo'}
							</Typography>
							<Button
								autoFocus
								color="inherit"
								onClick={(e) => handleSubmit(e)}
								className={classes.submitButton}
							>
								{buttonType === 'Edit' ? 'Save' : 'Submit'}
							</Button>
						</Toolbar>
					</AppBar>
					<form className={classes.form} noValidate>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="todoTitle"
									label="Todo Title"
									name="title"
									autoComplete="todoTitle"
									helperText={errors.title}
									value={title}
									error={errors.title ? true : false}
									onChange={(e) => setTitle(e.target.value)}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="todoDetails"
									label="Todo Details"
									name="body"
									autoComplete="todoDetails"
									multiline
									rows={22}
									rowsMax={25}
									helperText={errors.body}
									error={errors.body ? true : false}
									onChange={(e) => setBody(e.target.value)}
									value={body}
								/>
							</Grid>
						</Grid>
					</form>
				</Dialog>
				<Grid container spacing={2}>
					{todos.map((todo, index) => (
						<Grid key={index} item xs={12} sm={6}>
							<Card className={classes.root} variant="outlined">
								<CardContent>
									<Typography variant="h5" component="h2">
										{todo.title}
									</Typography>
									<Typography className={classes.pos} color="textSecondary">
										{dayjs(todo.createdAt).fromNow()}
									</Typography>
									<Typography variant="body2" component="p">
										{`${todo.body.substring(0, 65)}`}
									</Typography>
								</CardContent>
								<CardActions>
									<Button size="small" color="primary" onClick={() => handleViewOpen({ todo })}>
										View
									</Button>
									<Button size="small" color="primary" onClick={() => handleEditClickOpen({ todo })}>
										Edit
										</Button>
									<Button size="small" color="primary" onClick={() => deleteTodoHandler({ todo })}>
										Delete
										</Button>
								</CardActions>
							</Card>
						</Grid>
					))}
				</Grid>

				<Dialog
					onClose={handleViewClose}
					aria-labelledby="customized-dialog-title"
					open={viewOpen}
					fullWidth
					classes={{ paperFullWidth: classes.dialogeStyle }}
				>
					<DialogTitle id="customized-dialog-title" onClose={() => handleViewClose()}>
						{title}
					</DialogTitle>
					<DialogContent dividers>
						<TextField
							fullWidth
							id="todoDetails"
							name="body"
							multiline
							readOnly
							rows={1}
							rowsMax={25}
							value={body}
							InputProps={{
								disableUnderline: true
							}}
						/>
					</DialogContent>
				</Dialog>
			</main>
		);
	}
}

export default Todo;
