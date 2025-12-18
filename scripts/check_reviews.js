const https = require('https');

https.get('https://travel-api-dn8n.onrender.com/api/v1/reviews', (resp) => {
    let data = '';
    resp.on('data', c => data += c);
    resp.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.data && json.data.length > 0) {
                console.log("Keys:", Object.keys(json.data[0]).join(","));
                console.log("\nSample review:");
                console.log(JSON.stringify(json.data[0], null, 2));
            }
        } catch (e) {
            console.error(e);
        }
    });
});
