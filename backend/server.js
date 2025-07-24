const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
app.use(express.json());
const db = require('./Config/db')
const bookRoutes = require('./Routes/BookRoutes')
const borrowerRoutes = require('./Routes/BorrowerRoutes')
const transactionsRoutes = require('./Routes/TransactionRoutes')
app.use(cors());


app.use('/api/books', bookRoutes);
app.use('/api/borrowers', borrowerRoutes)
app.use('/api/transactions', transactionsRoutes)


app.get('/', (request, response) => {
    return response.json("Starting node server..");
})

app.listen(8081, ()=> {
    console.log("listening");
})