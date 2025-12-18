const https = require('https');

https.get('https://travel-api-dn8n.onrender.com/api/v1/destinations', (resp) => {
    let data = '';
    resp.on('data', c => data += c);
    resp.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.data && json.data.length > 0) {
                console.log("KEYS:" + Object.keys(json.data[0]).join(","));
            }
        } catch (e) { }
    });
});
