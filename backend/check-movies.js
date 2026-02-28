const http = require('http');

http.get('http://localhost:5000/api/movies', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log(`Array Length: ${json.length}`);
            console.log("First movie:", JSON.stringify(json[0], null, 2));
        } catch (e) {
            console.error("Parse Error:", e);
            console.log("Raw Data:", data);
        }
    });
}).on('error', err => console.log('Error:', err.message));
