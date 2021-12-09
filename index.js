import express from "express";

const app = express();

app.get('/health', function (req, res) {
    res.send('ok')
})

app.listen(3001);
