const https = require('https');

https.get('https://travel-api-dn8n.onrender.com/api/v1/destinations', (resp) => {
    let data = '';
    resp.on('data', c => data += c);
    resp.on('end', () => {
        try {
            const json = JSON.parse(data);
            const problematic = json.data.filter(d => !d.nameEn);
            if (problematic.length > 0) {
                console.log("Found items with missing nameEn:", problematic.length);
                console.log("Sample:", JSON.stringify(problematic[0], null, 2));
            } else {
                console.log("All items have nameEn.");
            }
        } catch (e) {
            console.error(e);
        }
    });
});
