import { useEffect, useState } from 'react';
import { ref, push } from 'firebase/database';
import { db } from '../firebase';

export const useRequestAddTask = (tasks, inputValue) => {
	const [isCreating, setIsCreating] = useState(false);

	const requestAddTask = () => {
		setIsCreating(true);
		const nextId = Number(tasks[tasks.length - 1].id) + 1;
		const tasksDbRef = ref(db, 'tasks');
		push(tasksDbRef, {
			userId: '1',
			title: inputValue,
			completed: false,
		})
			.then((response) => {
				console.log('Task addded, responce:', response);
			})
			.finally(() => setIsCreating(false));
	};
	return {
		isCreating,
		requestAddTask,
	};
};
