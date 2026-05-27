const express = require('express');
const cors = require('cors');

let app = express();
const port = 8080;

app.use(cors({
    origin: 'https://mygram-phi.vercel.app'
}));

app.use(express.json());

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = { app, express };
