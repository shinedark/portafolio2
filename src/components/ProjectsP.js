import React from 'react';
import '../App.css';
import appstore from './assets/images/appstore.svg';
import nm from './assets/images/nm.png';
import clock from './assets/images/clock.png';
import alog from './assets/images/alog.png';
import icon from './assets/images/icon.png';
import drone from './assets/images/drone.png';
import r from './assets/images/r.jpg';
import sdm from './assets/images/sdm.png';
import sport from './assets/images/sport.png';
import vids from './assets/images/vids.png';


function Projects () {
  
  return(
      
        <div className="App">
          <h1>Shine Dark Projects</h1>
            <div className="proejcts">
              <ul className="pro">
                <li className="mob">
                  <h2>Mobile Apps</h2>
                  <div className="mobile">
                    <h3>Noise Machine Sampler</h3>
                    <img src={nm} alt={nm} width="250" height="250"/>
                    <p>Music sampler done in Expo</p>
                    <h6>
                      <a target="_blank" href="https://itunes.apple.com/us/app/noise-machine-sampler/id1325689054?mt=8" rel="noopener noreferrer">
                            <img src={appstore} alt={appstore} />
                          </a>
                        </h6>
                        <h3>Remastered</h3>
                    <img src={r} alt={r} width="250" height="250"/>
                    <p> Ar experience done in Expo Kit</p>
                    <h6>
                      <a target="_blank" href="https://itunes.apple.com/us/app/remastered/id1356588290?ls=1&mt=8" rel="noopener noreferrer">
                            <img src={appstore} alt={appstore} />
                          </a>
                        </h6>
                        <h3>Timer Work</h3>
                    <img src={clock} alt={clock} width="250" height="250"/>
                    <p>Expo</p>
                    <h6>
                      <a className="link" target="_blank" href="hhttps://expo.io/@shinedark/timerWork" rel="noopener noreferrer">
                        📱
                      </a>
                        </h6>
                        <h3>Poke Search</h3>
                    <img src={icon} alt={icon} width="250" height="250"/>
                    <p>Expo</p>
                    <h6>
                      <a className="link" target="_blank" href="https://expo.io/@shinedark/pokesearch" rel="noopener noreferrer">
                           📱
                          </a>
                        </h6>
                  </div>
                </li>
              <li className="wb">
                <h2>Web Apps</h2>
                <div className="web">
                  <h3>Shine Dark Music</h3>
                  <img src={sdm} alt={sdm} width="250" height="250"/>
                  <p>Record Label site</p>
                  <h6>
                    <a className="link" target="_blank" href="https://shinedarkmusic.com/" rel="noopener noreferrer">
                        🌎
                        </a>
                      </h6>
                      <h3>Sports</h3>
                  <img src={sport} alt={sport} width="250" height="250"/>
                  <p>React exercie</p>
                  <h6>
                    <a  className="link" target="_blank" href="https://sports-87601.firebaseapp.com/" rel="noopener noreferrer">
                        🌎
                        </a>
                      </h6>
                      <h3>Alog</h3>
                  <img src={alog} alt={alog} width="250" height="250"/>
                  <p>Node App</p>
                  <h6>
                    <a  className="link" target="_blank" href="https://alog2.herokuapp.com/" rel="noopener noreferrer">
                        🌎
                        </a>
                      </h6>
                </div>
              </li>
              <li className="ot">
                <h2>Other Apps</h2>
                <div className="other">
                  <h3>Drones</h3>
                  <img src={drone} alt={drone} width="250" height="250"/>
                  <p>Experiment</p>
                  <h6>
                    <a className="link" target="_blank" href="https://shinedark.github.io/drones/" rel="noopener noreferrer">
                        🌎
                        </a>
                      </h6>
                      <h3>C-am Sampler</h3>
                  <img src={vids} alt={vids} width="250" height="250"/>
                  <p>Css Experiment</p>
                  <h6>
                    <a className="link" target="_blank" href="https://shinedark.github.io/vid/" rel="noopener noreferrer">
                        🌎
                        </a>
                      </h6>
                </div>
              </li>
              </ul>
          </div>          
        </div>
  );
}


export default Projects;
