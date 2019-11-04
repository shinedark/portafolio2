import React, { useState } from "react";
import { Icon } from "react-icons-kit";
import { u1F4BC } from "react-icons-kit/noto_emoji_regular/u1F4BC";
import { u1F4AF } from "react-icons-kit/noto_emoji_regular/u1F4AF";
import { instagram } from "react-icons-kit/fa/instagram";
import { twitter } from "react-icons-kit/fa/twitter";
import { github } from "react-icons-kit/fa/github";
import { u1F4E7 } from "react-icons-kit/noto_emoji_regular/u1F4E7";
import "../App.css";
import Resume from "./assets/CamiloPinedaResume.pdf";

function About() {
  const [resume, setResume] = useState(<Icon size={64} icon={u1F4BC} />);
  const [blogpost, setBlogpost] = useState(<Icon size={64} icon={u1F4AF} />);
  const [email, setEmail] = useState(<Icon size={64} icon={u1F4E7} />);
  const hover = () => {
    setResume("Resume");
  };

  const hoverLeave = () => {
    setResume(<Icon size={64} icon={u1F4BC} />);
  };

  const hover2 = () => {
    setBlogpost("Expo Blog Post");
  };

  const hoverLeave2 = () => {
    setBlogpost(<Icon size={64} icon={u1F4AF} />);
  };

  const hover3 = () => {
    setEmail("Email Me");
  };

  const hoverLeave3 = () => {
    setEmail(<Icon size={64} icon={u1F4E7} />);
  };

  return (
    <div className="App">
      <h1>About</h1>
      <div className="App-Body">
        <h3>Stack</h3>
        <ul className="ulAbout">
          <li>React Native</li>
          <li>FireBase</li>
          <li>GraphQl</li>
          <li>React</li>
          <li>Node</li>
          <li>AWS</li>
          <li>JS</li>
        </ul>
        <ol className="olAbout">
          <h3>
            <a
              onMouseEnter={() => hover()}
              onMouseLeave={() => hoverLeave()}
              className="resume"
              href={Resume}
              download
            >
              {resume}
            </a>
          </h3>
          <h3>
            <a
              onMouseEnter={() => hover2()}
              onMouseLeave={() => hoverLeave2()}
              className="resume"
              href="https://blog.expo.io/expo-featured-developer-shine-dark-26ccaa63706a"
            >
              {blogpost}
            </a>
          </h3>
          <h3>
            <a className="resume" href="https://github.com/shinedark">
              <Icon size={64} icon={github} />
            </a>
          </h3>
          <h3>
            <a className="resume" href="https://twitter.com/ShineDarkmusic">
              <Icon size={64} icon={twitter} />
            </a>
          </h3>
          <h3>
            <a
              className="resume"
              href="https://www.instagram.com/shinedarkmusic/"
            >
              <Icon size={64} icon={instagram} />
            </a>
          </h3>
          <h3>
            <a
              onMouseEnter={() => hover3()}
              onMouseLeave={() => hoverLeave3()}
              className="resume"
              href="mailto:mide0303@gmail.com"
            >
              {email}
            </a>
          </h3>
        </ol>
      </div>
    </div>
  );
}

export default About;
