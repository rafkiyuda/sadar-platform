const https = require('https');

const apiKey = "AIzaSyAyEuFPuxflgRIIgTOMk8djcrHeGmkSVr4";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.models) {
                console.log("Available Models:");
                json.models.forEach(m => {
                    if (m.name.includes('flash')) {
                        console.log(m.name);
                    }
                });
            } else {
                console.log("No models found or error:", json);
            }
        } catch (e) {
            console.error("Error parsing JSON:", e.message);
        }
    });
}).on('error', (err) => {
    console.error("Error:", err.message);
});
