import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyDpZOF2mRPlYAQJC0QGun7-ef6FI_vHN00",
  authDomain: "portafolio-6a269.firebaseapp.com",
  databaseURL: "https://portafolio-6a269.firebaseio.com",
  projectId: "portafolio-6a269",
  storageBucket: "portafolio-6a269.appspot.com",
  messagingSenderId: "285742052145",
  appId: "1:285742052145:web:b03227131ea98040"
};

class Firebase {
	constructor() {
		app.initializeApp(firebaseConfig)
		this.auth = app.auth()
		this.db = app.database()
	}

	login(email, password) {
		return this.auth.signInWithEmailAndPassword(email, password)
	}

	logout() {
		return this.auth.signOut()
	}

	async register(name, email, password) {
		await this.auth.createUserWithEmailAndPassword(email, password)
		return this.auth.currentUser.updateProfile({
			displayName: name
		})
	}

	isInitialized() {
		return new Promise(resolve => {
			this.auth.onAuthStateChanged(resolve)
		})
	}

	getCurrentUsername() {
		return this.auth.currentUser && this.auth.currentUser.displayName
	}

	checkForWrite (){
		return this.auth.currentUser.email === 'cam@me.com';
	}
	
	addBlogPost(title , blogPost, postType) {
		return this.db.ref(`blog/post/${postType}`).push({
			title , blogPost
		})
	}
}
export default new Firebase()
