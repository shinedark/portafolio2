import React from 'react';
import '../App.css';
import Vid from './assets/videos/remastered.mp4';
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
		    	  	<video controls={true} style={{height: '300px', width:"300px"}} src={Vid} />
		    		</div>
		  	</div>
	);
}


export default About;