const express = require('express')
let app = express();
const port = 8080;
app.listen(port);

module.exports = {app,express}