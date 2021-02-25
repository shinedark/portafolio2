import React, { useState } from "react";
import AuthSignUp from "../components/AuthSignUp";
import AuthLogIn from "../components/AuthLogIn";
import firebase from "../firebase";
import "../App.css";

function ProjectsP(props) {
	const [selectLogin, setSelectLongin] = useState(false);
	const checkForUser = () => {
		if (!firebase.getCurrentUsername()) {
			// not logged in
			// props.history.replace('/projects')
			return null;
		} else {
			props.history.replace("/blog");
		}
	};
	checkForUser();

	const renderAuth = () => {
		if (selectLogin) {
			return (
				<div className="containerAuth">
					<AuthLogIn />
					<div onClick={() => setSelectLongin(false)} className="linkAuth">
						Don't have a account please <strong>sign up</strong>
					</div>
				</div>
			);
		} else {
			return (
				<div className="containerAuth">
					<AuthSignUp />
					<div onClick={() => setSelectLongin(true)} className="linkAuth">
						Already have a account? plase <strong>log in</strong>
					</div>
				</div>
			);
		}
	};

	return (
		<div>
			<h3>Create an account to explore Blog</h3>
			<div className="containerAuth2">{renderAuth()}</div>
		</div>
	);
}

export default ProjectsP;
