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
                console.log(JSON.stringify(json.data[0], null, 2));
            } else {
                console.log("No data found or different structure:", Object.keys(json));
            }
        } catch (e) {
            console.error(e.message);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
