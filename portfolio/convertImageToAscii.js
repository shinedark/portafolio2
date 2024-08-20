const Art = require('ascii-art');
const fs = require('fs');

// Path to the image file you want to convert
const imagePath = '/Users/HubDaDub/Desktop/sdcode/portafolio2/portfolio/src/pictures/sd.png'; // Update this path

Art.image({
    filepath: imagePath,
    alphabet: 'variant4',
    width: 80, // Adjust the width as necessary
}, function(err, ascii){
    if (err) throw err;
    // Save the ASCII art to a file or output to the console
    fs.writeFileSync('./src/ascii-art.txt', ascii); // Save to a file
    console.log(ascii); // Print to console
});
