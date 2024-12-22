import { useEffect, useState } from 'react';
import styles from './TaskList.module.css';
export const TaskList = () => {
	const [tasks, setTasks] = useState([]);
	const [inputValue, setInputValue] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
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
				id: nextId,
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
							<button id={item.id}>X</button> {item.title}
						</li>
					))
				)}
			</ul>
		</div>
	);
};
