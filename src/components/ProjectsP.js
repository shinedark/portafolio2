import React, { useState } from "react";
import { Link } from "react-router-dom";
import firebase from "../firebase";
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

function ProjectsP(props) {
  const checkForUser = () => {
    if (!firebase.getCurrentUsername()) {
      // not logged in
      props.history.replace("/login");
      return null;
    }
  };
  checkForUser();
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
                    rel="noopener noreferrer"
                  >
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
                    rel="noopener noreferrer"
                  >
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
                    className="link"
                    target="_blank"
                    href="https://expo.io/@shinedark/pokesearch"
                    rel="noopener noreferrer"
                  >
                    <span role="img" aria-label="Phone">
                      📱
                    </span>
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
          <h2>Web Apps</h2>
          <ul className="pro">
            <li className="wb">
              <div className="web">
                <h3>Shine Dark Music</h3>
                <img src={sdm} alt={sdm} width="250" height="250" />
                <h6>
                  <a
                    className="link"
                    target="_blank"
                    href="https://shinedarkmusic.com/"
                    rel="noopener noreferrer"
                  >
                    <span role="img" aria-label="wolrd">
                      🌎
                    </span>
                  </a>
                </h6>
                <h3>Stack</h3>
                <ol className="porjectAbout">
                  <li className="projectLi">React</li>
                  <li className="projectLi">React Router</li>
                  <li className="projectLi">Fireabase</li>
                </ol>
                <p className="pAbout">
                  Component based React App, Firestore is being used for the
                  soundbank with search option based on tags.
                </p>
              </div>
            </li>
            <li className="wb">
              <div className="web">
                <h3>Lazy Leads</h3>
                <img src={ll} alt={ll} width="250" height="250" />
                <h6>
                  <a
                    className="link"
                    target="_blank"
                    href="https://pin-example.firebaseapp.com/"
                    rel="noopener noreferrer"
                  >
                    <span role="img" aria-label="wolrd">
                      🌎
                    </span>
                  </a>
                </h6>
                <h3>Stack</h3>
                <ol className="porjectAbout">
                  <li className="projectLi">React</li>
                  <li className="projectLi">React Router</li>
                  <li className="projectLi">Fireabase</li>
                  <li className="projectLi">Google Spreadsheets</li>
                </ol>
                <p className="pAbout">
                  React Hooks App. It has Auth via Firebase and is connected to
                  a google spreadsheet to collect information.
                </p>
              </div>
            </li>
            <li className="wb">
              <div className="web">
                <h3>Alog</h3>
                <img src={alog} alt={alog} width="250" height="250" />
                <h6>
                  <a
                    className="link"
                    target="_blank"
                    href="https://alog2.herokuapp.com/"
                    rel="noopener noreferrer"
                  >
                    <span role="img" aria-label="wolrd">
                      🌎
                    </span>
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
          <h2>Other Apps</h2>
          <ul className="pro">
            <li className="ot">
              <div className="other">
                <h3>Drones</h3>
                <img src={drone} alt={drone} width="250" height="250" />
                <h6>
                  <a
                    className="link"
                    target="_blank"
                    href="https://shinedark.github.io/drones/"
                    rel="noopener noreferrer"
                  >
                    <span role="img" aria-label="wolrd">
                      🌎
                    </span>
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
                    className="link"
                    target="_blank"
                    href="https://shinedark.github.io/vid/"
                    rel="noopener noreferrer"
                  >
                    <span role="img" aria-label="wolrd">
                      🌎
                    </span>
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
      <div>Hello {firebase.getCurrentUsername()}</div>
      <h2 className="blog">
        <Link className="linkColor" to="/blog">
          Blog
        </Link>
      </h2>
      <h2 className="logout">
        <span className="linkColor" type="submit" onClick={logout}>
          Logout
        </span>
      </h2>
      <div>
        <ol className="dProjects">
          <div
            className="searchD1"
            style={selected}
            onClick={() => mobileSelect()}
          >
            Mobile
          </div>
          <div
            className="searchD1"
            style={selected2}
            onClick={() => webSelect()}
          >
            Web
          </div>
          <div
            className="searchD1"
            style={selected3}
            onClick={() => otherSelect()}
          >
            Other
          </div>
        </ol>
      </div>
      <div className="proejcts">
        {renderMobile() || renderWeb() || renderOther()}
      </div>
    </div>
  );
  async function logout() {
    await firebase.logout();
    props.history.push("/");
  }
}

export default ProjectsP;
