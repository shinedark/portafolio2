import React from 'react';
import '../App.css';
import Resume from './assets/CamiloPinedaResume.pdf';


function About (props) {
	
	return(
			
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
		    	  		<li>JS</li>
		    	  	</ul>
		    	  	
		    	  	<h3><a className="resume" href={Resume} download>Resume</a></h3>
		    	  	<h3><a className="resume" href="https://github.com/shinedark" download>GitHub</a></h3>
		    	  	<h3><a className="resume" href="https://blog.expo.io/expo-featured-developer-shine-dark-26ccaa63706a" >Blog Post</a></h3>
		    		</div>
		  	</div>
	);
}


export default About;