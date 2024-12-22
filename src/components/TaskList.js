import { useEffect, useState } from 'react';
import styles from './TaskList.module.css';
export const TaskList = () => {
	const [tasks, setTasks] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		setIsLoading(true);

		fetch('https://jsonplaceholder.typicode.com/users/1/todos')
			.then((loadedData) => loadedData.json())
			.then((loadedTasks) => {
				setTasks(loadedTasks);
			})
			.finally(() => setIsLoading(false));
	}, []);
	console.log(tasks);
	return (
		<ul className={styles.list}>
			{isLoading ? (
				<div className="loader"></div>
			) : (
				tasks.map((item) => <li key={item.id}>{item.title} </li>)
			)}
		</ul>
	);
};
