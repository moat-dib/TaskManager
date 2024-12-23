import { useState } from 'react';
import { useRequestGetTasks } from './useRequestGetTasks';
import { useRequestAddTask } from './useRequestAddTask';
import { ref, set, remove } from 'firebase/database';
import { db } from '../firebase';
import styles from './TaskList.module.css';
export const TaskList = () => {
	const [sortTasks, setSortTasks] = useState(false);
	const [editingTitle, setEditingTitle] = useState('');
	const [editingNum, setEditingNum] = useState('0');
	const [inputValue, setInputValue] = useState();

	const [isDeleting, setIsDeleting] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [refreshTasks, setRefreshTasks] = useState(false);

	const { isLoading, tasks } = useRequestGetTasks(sortTasks);
	const { isCreating, requestAddTask } = useRequestAddTask(tasks, inputValue);

	const requestDeleteTask = (target) => {
		setIsDeleting(true);
		const taskDbRef = ref(db, `tasks//${target.id}`);
		remove(taskDbRef)
			.then((response) => {
				setRefreshTasks(!refreshTasks);
			})
			.finally(() => setIsDeleting(false));
	};
	const requestUpdateTask = (target) => {
		const taskDbRef = ref(db, `tasks/${editingNum}`);
		set(taskDbRef, {
			userId: '1',
			title: editingTitle,
			completed: false,
		})
			.then((response) => {
				console.log('');
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
					Object.entries(tasks).map(([id, { userId, title, completed }]) => (
						<li key={id}>
							<button
								className={styles.edit}
								id={id}
								disabled={isEditing}
								onClick={({ target }) => enableEditor(target)}
							>
								E
							</button>
							<p>{title}</p>

							<button
								className={styles.close}
								id={id}
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
