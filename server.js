const express = require('express');

const app = express();

app.get('/api/customers', (req, res) => {
    const customers = [
        {id: 1, firstName: 'Sean', lastName: 'Cahill'},
        {id: 2, firstName: 'John', lastName: 'Wall'},
        {id: 1, firstName: 'Dustin', lastName: 'Moskovitz'}

    ];
    res.json(customers);
})

const port = 5000;

app.listen(port, () => console.log(`server started on port ${port}`))