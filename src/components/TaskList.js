import { useEffect, useState } from 'react';
import styles from './TaskList.module.css';
export const TaskList = () => {
	const [tasks, setTasks] = useState([]);
	const [inputValue, setInputValue] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [refreshTasks, setRefreshTasks] = useState(false);
	useEffect(() => {
		setIsLoading(true);

		fetch('http://localhost:3004/tasks')
			.then((loadedData) => loadedData.json())
			.then((loadedTasks) => {
				setTasks(loadedTasks);
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
		console.log(target.id);
		fetch(`http://localhost:3004/tasks/${target.id}/`, {
			method: 'DELETE',
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('ответ сервера: ', response);
				setRefreshTasks(!refreshTasks);
			})
			.finally(() => setIsDeleting(false));
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
			<ul className={styles.list}>
				{isLoading ? (
					<div className="loader"></div>
				) : (
					tasks.map((item) => (
						<li key={item.id}>
							<button
								className={styles.delBtn}
								id={item.id}
								disabled={isDeleting}
								onClick={({ target }) => requestDeleteTask(target)}
							>
								X
							</button>{' '}
							{item.title}
						</li>
					))
				)}
			</ul>
			<div>
				<button>Sort</button>
			</div>
		</div>
	);
};
