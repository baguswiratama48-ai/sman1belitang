const url = "https://wiyhmzoudoddshdcdete.supabase.co/rest/v1/berita?limit=1";
const apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpeWhtem91ZG9kZHNoZGNkZXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNTM5ODMsImV4cCI6MjA4MjcyOTk4M30.fJ9ZSubY8U7BVljIL8MISMaV5KGxoLiCa_8N33UZ1ig";

fetch(url, {
    headers: {
        'apikey': apikey,
        'Authorization': 'Bearer ' + apikey
    }
})
    .then(r => r.json())
    .then(data => {
        console.log("Response:", JSON.stringify(data, null, 2));
        process.exit(0);
    })
    .catch(e => {
        console.error("Error:", e);
        process.exit(1);
    });
