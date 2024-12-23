import { useEffect, useState } from 'react';
import styles from './TaskList.module.css';
export const TaskList = () => {
	const [tasks, setTasks] = useState([]);
	const [sortTasks, setSortTasks] = useState(false);
	const [editingTitle, setEditingTitle] = useState('');
	const [editingNum, setEditingNum] = useState('0');
	const [inputValue, setInputValue] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [refreshTasks, setRefreshTasks] = useState(false);
	useEffect(() => {
		setIsLoading(true);

		fetch('http://localhost:3004/tasks')
			.then((loadedData) => loadedData.json())
			.then((loadedTasks) => {
				if (sortTasks) {
					const sortedTasks = loadedTasks.sort(function (a, b) {
						if (a.title < b.title) {
							return -1;
						}
						if (a.title > b.title) {
							return 1;
						}
						return 0;
					});
					setTasks(sortedTasks);
				} else {
					setTasks(loadedTasks);
				}
			})
			.finally(() => setIsLoading(false));
	}, [refreshTasks]);

	const requestAddTask = () => {
		setIsCreating(true);
		const nextId = Number(tasks[tasks.length - 1].id) + 1;
		fetch('http://localhost:3004/tasks', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				userId: '1',
				id: String(nextId),
				title: inputValue,
				completed: false,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Task addded, responce:', response);
				setRefreshTasks(!refreshTasks);
			})
			.finally(() => setIsCreating(false));
	};
	const requestDeleteTask = (target) => {
		setIsDeleting(true);
		fetch(`http://localhost:3004/tasks/${target.id}/`, {
			method: 'DELETE',
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				setRefreshTasks(!refreshTasks);
			})
			.finally(() => setIsDeleting(false));
	};
	const requestUpdateTask = (target) => {
		fetch(`http://localhost:3004/tasks/${editingNum}/`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				userId: '1',
				id: editingNum,
				title: editingTitle,
				completed: false,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				setRefreshTasks(!refreshTasks);
			})
			.finally(() => {
				setEditingNum('0');
				setEditingTitle('');
				setIsEditing(false);
			});
	};
	const enableEditor = (target) => {
		setIsEditing(true);
		setEditingNum(Number(target.id));
		setEditingTitle('');
	};
	const changeCheckbox = () => {
		setSortTasks(!sortTasks);
		setRefreshTasks(!refreshTasks);
	};
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h2>Task List</h2>
				<label onInput={({ target }) => setInputValue(target.value)}>
					<input type="text" id="newTaskInput" placeholder="Add new task..." />
				</label>
				<button
					disabled={isCreating}
					onClick={requestAddTask}
					className={styles.addBtn}
				>
					Add
				</button>
			</div>
			<ul className={styles.list} disabled={isEditing}>
				{isLoading ? (
					<div className="loader"></div>
				) : (
					tasks.map((item) => (
						<li key={item.id}>
							<button
								className={styles.edit}
								id={item.id}
								disabled={isEditing}
								onClick={({ target }) => enableEditor(target)}
							>
								E
							</button>
							<p>{item.title}</p>

							<button
								className={styles.close}
								id={item.id}
								disabled={isDeleting}
								onClick={({ target }) => requestDeleteTask(target)}
							>
								X
							</button>
						</li>
					))
				)}
			</ul>
			<div className={styles.footer}>
				<h2>Manage your Tasks</h2>

				<label
					id={editingTitle}
					onInput={({ target }) => setEditingTitle(target.value)}
				>
					<input type="text" id={editingTitle} disabled={!isEditing} />
				</label>
				<button
					className={styles.addBtn}
					disabled={!isEditing}
					onClick={requestUpdateTask}
				>
					Save
				</button>
			</div>
			<div className={styles.sortDiv}>
				{' '}
				<input
					type="checkbox"
					checked={sortTasks}
					onChange={changeCheckbox}
					placeholder="SortTasks"
				/>
				<span>{sortTasks ? 'Sorting ON' : 'Sorting OFF'}</span>
			</div>
		</div>
	);
};
