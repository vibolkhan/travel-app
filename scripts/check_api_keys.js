const https = require('https');

https.get('https://travel-api-dn8n.onrender.com/api/v1/destinations', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
        data += chunk;
    });

    resp.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.data && json.data.length > 0) {
                console.log("Keys:", Object.keys(json.data[0]));
                // Print a few critical fields to see their values
                const sample = json.data[0];
                console.log("Sample Name:", sample.name);
                console.log("Sample ID:", sample.id);
                console.log("Sample Category:", sample.category);
                console.log("Sample Image:", sample.image);
            } else {
                console.log("Structure:", Object.keys(json));
            }
        } catch (e) {
            console.error(e.message);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
