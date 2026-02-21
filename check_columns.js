const url = "https://wiyhmzoudoddshdcdete.supabase.co/rest/v1/";
const apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpeWhtem91ZG9kZHNoZGNkZXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNTM5ODMsImV4cCI6MjA4MjcyOTk4M30.fJ9ZSubY8U7BVljIL8MISMaV5KGxoLiCa_8N33UZ1ig";

// PostgREST provides an OpenAPI spec which includes schema info
fetch(url, {
    headers: {
        'apikey': apikey,
        'Authorization': 'Bearer ' + apikey
    }
})
    .then(r => r.json())
    .then(data => {
        const beritaPath = data.paths["/berita"];
        if (beritaPath && beritaPath.get && beritaPath.get.parameters) {
            const columns = beritaPath.get.parameters
                .filter(p => p.in === 'query' && !p.name.includes('.'))
                .map(p => p.name);
            console.log("Columns recognized by PostgREST for 'berita':", columns);
        } else {
            console.log("Could not find table 'berita' in OpenAPI spec.");
            console.log("Available paths:", Object.keys(data.paths));
        }
        process.exit(0);
    })
    .catch(e => {
        console.error("Error:", e);
        process.exit(1);
    });
