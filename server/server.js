/**
 * Smart Trash Bin Web Application
 * - An LBY-IOT Project
 * 
 * Author: Allendale Nato <natoallendale@gmail.com>
 */

// Dependencies
const express       = require('express');
const socket        = require('./socket');
const hbs           = require('hbs');
// DB Connection
require('./db/db_connect');
// MQTT Live-Data
const mqtt          = require('./mqtt_sub');
// Express Router
const bin_route     = require('./routes/bin_route');
const emp_route     = require('./routes/employee_route');
// Web App Port #
const port = 3000;

const app = express();
const server = require('http').createServer(app);
const realTimeSocket = socket.listen(server);

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('json', context => {
    return JSON.stringify(context);
});

app.use('/scripts', express.static(__dirname + '/../node_modules'));
app.use('/dashboard', express.static(__dirname + '/views'));

app.use('/smart-trash/bin', bin_route);
app.use('/smart-trash/emp', emp_route);

app.get('/smart-trash', (req, res) => {
    res.send('home_dash.hbs');
});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
    mqtt.manageMQTTData('mqtt://10.145.217.172', 'smart-trash', realTimeSocket);
    
});
