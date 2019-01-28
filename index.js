const express = require('express');
const app = express();
const api = require('./router/api');
const cors = require('cors');

const PORT = 3000;
app.use(cors());

app.use('/api', api);
app.use(express.static(__dirname + '/'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`server running on Port ${PORT}`);
})



