// code away!
require('dotenv').config();

const server = require('./server');

const port = process.env.PORT || 5000;

server.listen(port, () =>
    console.log(`\n **API running on port ${port}  **\n`)
)