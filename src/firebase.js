import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyAS1_Z5MTpdIarF_n8LYqZWOg1py3KI8BQ',
	authDomain: 'tasksproject-4ed31.firebaseapp.com',
	projectId: 'tasksproject-4ed31',
	storageBucket: 'tasksproject-4ed31.firebasestorage.app',
	messagingSenderId: '1064361470659',
	appId: '1:1064361470659:web:03365d0044c296ee121076',
	databaseURL:
		'https://tasksproject-4ed31-default-rtdb.europe-west1.firebasedatabase.app/',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
