import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

export const useRequestGetTasks = (sortTasks) => {
	const [tasks, setTasks] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		const tasksDbRef = ref(db, 'tasks');
		return onValue(tasksDbRef, (snapshot) => {
			const loadedTasks = snapshot.val() || [];
			setTasks(loadedTasks);
			setIsLoading(false);
		});
	}, []);
	return {
		isLoading,
		tasks,
	};
};
