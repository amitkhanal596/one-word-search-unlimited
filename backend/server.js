const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

app.get("/api/puzzle/:date", async (req, res) => {
    const { date } = req.params;
    const apiUrl = `https://onewordsearch.com/${date}.json`;
    
    const options = {
        method: "GET",
        headers: {
            "User-Agent": "Mozilla/5.0",
            Referer: "https://onewordsearch.com/",
        },
    };

    try {
        const fetch = (await import("node-fetch")).default;
        const response = await fetch(apiUrl, options);
        if (!response.ok) throw new Error("Failed to fetch puzzle");

        const data = await response.json();
        console.log(data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch puzzle" });
    }
});

const PORT = process.env.PORT || 5001;;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
