import React, { useState, useEffect, useCallback, useRef } from 'react'
import backgroundVideo from '../../pictures/golf_compressed.mp4' // Update this path

const asciiArt = `
                                   ,::::                                        
                                   :::;;:::;                                    
                             ::;;;;;:,:::;::;   ,                               
                           ::::;::;;;::,:::;:::::                               
                          ::::,,,,,:,,,,,,,,,,,::::                             
                         ::::,,,,,:=iti+;,.. .,::::;                            
                      ,,:;:,,,.:iYVVXXRRXVt:  .,:::;:                           
                     ,::::,,..=IYVVVXXXRRXVY+  .,,,:::,                         
                     ::,,..,.;++iittVXXItiiit;.,.,::;:                          
                     ,,,,.:,,     ..:;:........,,.,,::,                         
                    ,,,,,...,.     .+YI:      ,,,.,::::,                        
                   ,,,,,...,+::,,,:+YXVt;,:,.:=, :,,.,,,                        
                   .,......=IYVVYYYIIVIIYYVVYYY; ..,,,,,                        
                    ..   ,:=IYVIIi+;=t;=+tIYXYI=;:..,,,,                        
                     ...  :=tI:;=+itYYIt+;;;itt=;. ...                          
                     ...  ::=+:+=tYVVYVVY++:;==:. ..,                           
         VVXRRRBMMMBBR+;::;;++=+++itttttiii====;:,,,;YI=i;++=                   
         IRBBBBW#WWMBXXVYYYYVXVVYIIYYVVXRBMW#WMMBRXXRRXVVYIYYt;                 
         +IYIYXBM###WMRRXVVVVVXVXRXXXRBBMW###WBRXYIttIIttiitt++                 
         =I+itIYXRMW###WWMBBRRBRBBBBMMWW###WMBRXVIti+++++===;+                  
         =+++ittIYVXRBMW###############WMMBRXVVXXXVt+===;;ii=;                  
         =i==+iitttIYVXXRRBMMWWWWWMMMBBBRRXVVYVYIYYVY=;;;;IYti                  
         ;===+++iItttIIYXVXXXRRRRRXXXXVXRRXYtIYVtitIXV+;;;tY=;                  
         ;=;==+ttIYYItittIIVVXXXXYIIIttYYXRXY+iitIIIYXVi=;+i;;                  
         ;;==+i+iii++i++itittItIItiiii+iiiittIIt++i=++iiYVVi=i                  
         ;=;;+i+=======++iti+i+++++++it+=+++=+==+i+;===;==+;=BB                 
         V;;;=====;=====+++++==+===++=+ii=;;;=;;==ii++=;;;;;+RXXV               
       XXX;;;;;==i;=;;;=i+==++;;=;;=====ti===;;=;;;++;;;;=iiVRRVYI              
      XXXR+=;;;;+tttti+==+==iIIi=;;;;;;+IYVI=;;;;;+tIti=;=IVXXXXVYYVVV          
  +tIYYXVVi;;;;==+YYVVi=;;++=+tii=;;;;===tiii;;;;;=;++++;;iXYXXXVVVVVXX         
VYIYYYYVXXXI;;;+IVVYIt+i++++=;;;;;;;;++i;=;;;;;;;;;;;;;;;;=iVVXRXXXXXXV         
VVVVVVVXVVXVIIt+==;;===+tIi++;;;;;;;;=i+=;;;;;;;;;==;;;;:;tRXVXXXXXXXXV         
XXXXRRRYVVitIt;;==;;;;;==+t++=;=;;;;;;==i=+=;:::::;;;;;;;=tIVXYXRRRRRXV         
XVXXXXRXYVI==;;;;;;;;;;+i+YIii==+====;;;t+tti+=;::::::;;=itVXXVVVVXRRVt         
RRRRXVVXYXXYYIti;;;;;;;=YtIXVVIYti+;+;;;XitIIItt=:::::;=++iIYVXRRXRXXVI         
RXXYVVVXRXI+;==;;;;;;=;;=;;++=+it++==;+==;;;;;;;:;;;;;;;;+++ItIVXXVVYtXB        
RRRXXXXVVI+;;;;;;;;;;=+++=+==i++=+i+=i++Y=;;;;::::::;===;;;;VYIitYVVYt+V+=      
XXXXXXXItYi;;;;;;;;;;;;;=;===+==+=+i==iii;;;;;;::;=;:::::;:=VVVitIVVYi=::;;     
YVXXVVIiYVt;;;;;;=;::::;=;=+++==+=+t++Iti+;;:::::;;+=;:;:::+VXVitYVVYI=;:::;    
YVVVYYitXRt;:::;+itt+=:::;;=iIItt;=+=+Vttti+;::::==ii+=::::iY:=;+tYYYI=:,::::   
IYVVYIi=IX+:::;;;;+=+====+++itItIIIIIYVIIYIYIIIIIIIYIIItIIIYY ;==+IIIt=:,,,::   
tYYYIt+;==:::+XRBBMWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWMMMBMMMX  ;=+ittti+;;:,:;   
iIIIti+;;     RBMBMWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWMMBBMMB   ;++iii==;;:,:    
+tttii+=      RRBMMWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWMMMRMMB    ===;==;;;:::    
=++++==+      RRBMBWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWMBMRBMB      ,::::::;:     

`

const AsciiArtComponent = () => {
  const [dynamicAsciiArt, setDynamicAsciiArt] = useState(asciiArt)
  const [backgroundColor, setBackgroundColor] = useState('rgba(0, 0, 0, 0.5)')
  const [isHovering, setIsHovering] = useState(false)
  const videoRef = useRef(null)

  const getShade = (char) => {
    const asciiValue = char.charCodeAt(0)
    if (asciiValue === 32) return 'transparent' // space
    if (asciiValue < 33) return '#FFFFFF' // very light
    if (asciiValue < 65) return '#CCCCCC' // light
    if (asciiValue < 97) return '#999999' // medium
    if (asciiValue < 126) return '#666666' // dark
    return '#333333' // very dark
  }

  const getRandomChar = () => {
    const chars = '.:;+=itIYVXRBMW#'
    return chars[Math.floor(Math.random() * chars.length)]
  }

  const getRandomBackgroundColor = () => {
    const colors = [
      'rgba(0, 0, 255, 0.5)',
      'rgba(255, 0, 0, 0.5)',
      'rgba(255, 255, 255, 0.5)',
      'rgba(128, 128, 128, 0.5)',
      'rgba(0, 0, 0, 0.5)',
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const updateAsciiArt = useCallback(() => {
    setDynamicAsciiArt((prevArt) => {
      const artArray = prevArt.split('')
      for (let i = 0; i < 100; i++) {
        // Change 100 random characters
        const randomIndex = Math.floor(Math.random() * artArray.length)
        if (artArray[randomIndex] !== '\n' && artArray[randomIndex] !== ' ') {
          artArray[randomIndex] = getRandomChar()
        }
      }
      return artArray.join('')
    })
  }, [])

  useEffect(() => {
    const asciiInterval = setInterval(updateAsciiArt, 3000) // Update ASCII art every 3 seconds
    const backgroundInterval = setInterval(
      () => setBackgroundColor(getRandomBackgroundColor()),
      1000,
    ) // Update background every 10 seconds

    // Ensure the video loops
    if (videoRef.current) {
      videoRef.current.loop = true
    }

    return () => {
      clearInterval(asciiInterval)
      clearInterval(backgroundInterval)
    }
  }, [updateAsciiArt])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <video
        ref={videoRef}
        src={backgroundVideo}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isHovering ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
        }}
        muted
        playsInline
        autoPlay
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: backgroundColor,
          opacity: isHovering ? 0 : 1,
          transition:
            'opacity 0.5s ease-in-out, background-color 3s ease-in-out',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(0.15)', // Adjust scale as needed
          transformOrigin: 'center center',
          fontFamily: 'monospace',
          fontSize: '10px',
          lineHeight: '1em',
          whiteSpace: 'pre',
          opacity: isHovering ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out',
        }}
      >
        {dynamicAsciiArt.split('\n').map((line, index) => (
          <div key={index}>
            {line.split('').map((char, i) => (
              <span
                key={i}
                style={{
                  color: getShade(char),
                  backgroundColor:
                    getShade(char) === 'transparent'
                      ? 'transparent'
                      : 'rgba(0, 0, 0, 0.5)',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AsciiArtComponent
