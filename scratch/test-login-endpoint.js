async function testAdminLogin() {
    try {
        const res = await fetch("http://localhost:3000/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: "sulagadleaishwarya@gmail.com",
                password: "212405"
            })
        });

        console.log("Status:", res.status);
        console.log("Headers set-cookie:", res.headers.get("set-cookie"));
        const data = await res.json();
        console.log("Response Body:", data);
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

testAdminLogin();
