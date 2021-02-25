import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../App.css";
import appstore from "./assets/images/appstore.svg";
import nm from "./assets/images/nm.png";
import alog from "./assets/images/alog.png";
import icon from "./assets/images/icon.png";
import drone from "./assets/images/drone.png";
import r from "./assets/images/r.jpg";
import sdm from "./assets/images/sdm.png";
import ll from "./assets/images/ll.png";
import vids from "./assets/images/vids.png";
import { Icon } from "react-icons-kit";
import { u1F30E } from "react-icons-kit/noto_emoji_regular/u1F30E";
import { u1F3B9 } from "react-icons-kit/noto_emoji_regular/u1F3B9";
import { u1F4F1 } from "react-icons-kit/noto_emoji_regular/u1F4F1";

function ProjectsP(props) {
	const [showProject, setShowProject] = useState("mobile");
	const [selected, setSelected] = useState({ textDecoration: "underline" });
	const [selected2, setSelected2] = useState({ textDecoration: "none" });
	const [selected3, setSelected3] = useState({ textDecoration: "none" });

	const mobileSelect = () => {
		setShowProject("mobile");
		setSelected2({ textDecoration: "none" });
		setSelected3({ textDecoration: "none" });
		setSelected({ textDecoration: "underline" });
	};

	const webSelect = () => {
		setShowProject("web");
		setSelected({ textDecoration: "none" });
		setSelected3({ textDecoration: "none" });
		setSelected2({ textDecoration: "underline" });
	};

	const otherSelect = () => {
		setShowProject("other");
		setSelected({ textDecoration: "none" });
		setSelected2({ textDecoration: "none" });
		setSelected3({ textDecoration: "underline" });
	};

	const renderMobile = () => {
		if (showProject === "mobile") {
			return (
				<div>
					<ul className="pro">
						<li className="mob">
							<div className="mobile">
								<h3>Noise Machine Sampler</h3>
								<img src={nm} alt={nm} width="250" height="250" />
								<h6>
									<a
										target="_blank"
										href="https://itunes.apple.com/us/app/noise-machine-sampler/id1325689054?mt=8"
										rel="noopener noreferrer">
										<img src={appstore} alt={appstore} />
									</a>
								</h6>
								<h3>Stack</h3>
								<ol className="porjectAbout">
									<li className="projectLi">React Native</li>
									<li className="projectLi">Expo</li>
								</ol>
								<p className="pAbout">
									This App is IOS only and is on version 2, it's a sampler that
									has 9 slots with sound banks for each and 6 samples per bank.
									You can search with each bank indipendetly to set the sample
									you like.
								</p>
							</div>
						</li>
						<li className="mob">
							<div className="mobile">
								<h3>Remastered</h3>
								<img src={r} alt={r} width="250" height="250" />
								<h6>
									<a
										target="_blank"
										href="https://itunes.apple.com/us/app/remastered/id1356588290?ls=1&mt=8"
										rel="noopener noreferrer">
										<img src={appstore} alt={appstore} />
									</a>
								</h6>
								<h3>Stack</h3>
								<ol className="porjectAbout">
									<li className="projectLi">React Native</li>
									<li className="projectLi">Expo Kit</li>
									<li className="projectLi">AR</li>
								</ol>
								<p className="pAbout">
									Promotional App for the Remastered Album, is a Ar expirience
									with sounds and visuals.
								</p>
							</div>
						</li>
						<li className="mob">
							<div className="mobile">
								<h3>Poke Search</h3>
								<img src={icon} alt={icon} width="250" height="250" />
								<h6>
									<a
										className="resume"
										target="_blank"
										href="https://expo.io/@shinedark/pokesearch"
										rel="noopener noreferrer">
										<Icon size={51} icon={u1F4F1} />
									</a>
								</h6>
								<h3>Stack</h3>
								<ol className="porjectAbout">
									<li className="projectLi">React Native</li>
									<li className="projectLi">Expo</li>
								</ol>
								<p className="pAbout">
									Pokedex App, you can search by name and number of pokemon and
									it will display all the information of the Pokemon.
								</p>
							</div>
						</li>
					</ul>
				</div>
			);
		}
	};

	const renderWeb = () => {
		if (showProject === "web") {
			return (
				<div>
					<ul className="pro">
						<li className="wb">
							<div className="web">
								<h3>Shine Dark Music</h3>
								<img src={sdm} alt={sdm} width="250" height="250" />
								<h6>
									<a
										className="resume"
										target="_blank"
										href="https://shinedarkmusic.com/"
										rel="noopener noreferrer">
										<Icon size={51} icon={u1F30E} />
									</a>
								</h6>
								<h3>Stack</h3>
								<ol className="porjectAbout">
									<li className="projectLi">Shopify</li>
									<li className="projectLi">Design</li>
								</ol>
								<p className="pAbout">Shopify Store.</p>
							</div>
						</li>
						<li className="wb">
							<div className="web">
								<h3>Shine Dark Method</h3>
								<img src={ll} alt={ll} width="250" height="250" />
								<h6>
									<a
										className="resume"
										target="_blank"
										href="https://shinedarkmethod.com/"
										rel="noopener noreferrer">
										<Icon size={51} icon={u1F30E} />
									</a>
								</h6>
								<h3>Stack</h3>
								<ol className="porjectAbout">
									<li className="projectLi">React</li>
									<li className="projectLi">React Router</li>
									<li className="projectLi">AWS</li>
									<li className="projectLi">GraphQl</li>
								</ol>
								<p className="pAbout">
									React Hooks App. It has Auth, GraphQl API, DynamoDb, via AWS.
									Material UI. It is also connected to calendar to scheldue
									meetings.
								</p>
							</div>
						</li>
						<li className="wb">
							<div className="web">
								<h3>Alog</h3>
								<img src={alog} alt={alog} width="250" height="250" />
								<h6>
									<a
										className="resume"
										target="_blank"
										href="https://alog2.herokuapp.com/"
										rel="noopener noreferrer">
										<Icon size={51} icon={u1F30E} />
									</a>
								</h6>
								<h3>Stack</h3>
								<ol className="porjectAbout">
									<li className="projectLi">Node</li>
									<li className="projectLi">EJS Templets</li>
									<li className="projectLi">Youtube</li>
									<li className="projectLi">Cron Jobs</li>
								</ol>
								<p className="pAbout">
									This Node App is use for journaling for a person with a
									medical condition and emails each weeek the logs to the
									provider.
								</p>
							</div>
						</li>
					</ul>
				</div>
			);
		}
	};

	const renderOther = () => {
		if (showProject === "other") {
			return (
				<div>
					<ul className="pro">
						<li className="ot">
							<div className="other">
								<h3>Drones</h3>
								<img src={drone} alt={drone} width="250" height="250" />
								<h6>
									<a
										className="resume"
										target="_blank"
										href="https://shinedark.github.io/drones/"
										rel="noopener noreferrer">
										<Icon size={51} icon={u1F3B9} />
									</a>
								</h6>
								<h3>Stack</h3>
								<ol className="porjectAbout">
									<li className="projectLi">Vanilla JS</li>
									<li className="projectLi">HTML</li>
									<li className="projectLi">JQuery</li>
									<li className="projectLi">Pizzicatto</li>
									<li className="projectLi">CSS</li>
								</ol>
								<p className="pAbout">
									This is a audio random frequency drone generator.
								</p>
							</div>
						</li>
						<li className="ot">
							<div className="other">
								<h3>C-am Sampler</h3>
								<img src={vids} alt={vids} width="250" height="250" />
								<h6>
									<a
										className="resume"
										target="_blank"
										href="https://shinedark.github.io/vid/"
										rel="noopener noreferrer">
										<Icon size={51} icon={u1F3B9} />
									</a>
								</h6>
								<h3>Stack</h3>
								<ol className="porjectAbout">
									<li className="projectLi">Vanilla JS</li>
									<li className="projectLi">HTML</li>
									<li className="projectLi">CSS</li>
								</ol>
								<p className="pAbout">
									This is a keyboard triggered music sampler with lots of CSS
									animations.
								</p>
							</div>
						</li>
					</ul>
				</div>
			);
		}
	};

	return (
		<div className="App">
			<h1>Shine Dark Projects</h1>
			<h2 className="blog">
				<Link className="linkColor" to="/projectsp">
					Blog
				</Link>
			</h2>
			<div>
				<ol className="dProjects">
					<div
						className="searchD1"
						style={selected}
						onClick={() => mobileSelect()}>
						Mobile
					</div>
					<div
						className="searchD1"
						style={selected2}
						onClick={() => webSelect()}>
						Web
					</div>
					<div
						className="searchD1"
						style={selected3}
						onClick={() => otherSelect()}>
						Other
					</div>
				</ol>
			</div>
			<div className="proejcts">
				{renderMobile() || renderWeb() || renderOther()}
			</div>
		</div>
	);
}

export default ProjectsP;
