// if (process.env.NODE_ENV !== "production") {
//     require('dotenv').config();
// }

//starts express
// const express = require('express');
// const morgan = require('morgan');

import express from 'express';
import morgan from 'morgan';
const app = express();
app.use(morgan('dev'));

//for server status report
//morgan helps dev by auto generating request details,
//response time, status code, route in terminal

//for data communication between client port and server port
//const cors = require('cors');
import cors from 'cors';

const corsOptions = {
  origin: 'http://localhost:5173', // This should be the port Vite is using
};
app.use(cors(corsOptions));
app.use(express.json());

//mongoDB: mongoose helps to connect to MongoDB
// const mongoose = require('mongoose');

import mongoose from 'mongoose';
const dbUrl = 'mongodb://127.0.0.1:27017/teamFive';
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));
db.once('open', () => {
  console.log('mongo Connection open!');
});

//Routes
import loginRoute from './routes/login.js';
import userRoute from './routes/user.js';
import documentRoute from './routes/document.js';

app.use("/", loginRoute)
app.use('/user', userRoute);
app.use('/document', documentRoute);


//Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get('*', (req, res) => {
  res.send('invalid url');
});

app.listen(8000, () => {
  console.log('listening on port 8000');
});
