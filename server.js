

const express = require('express');
const app = express();
const port = 8387;



app.use(express.static('public'));
app.use(express.json());

app.listen(port,() => console.log(`Server has started on port: ${port}`));


