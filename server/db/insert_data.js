const conn = require('./db_connect');
const moment = require('moment');

// let newData = {
//     bin_id: 42,
//     waste_height: 15.32,
//     temperature: 25,
//     humidity: 43,   
//     is_open: 1,
//     data_timestamp: moment().format('YYYY:MM:DD HH:mm:ss')
// }

function sensorData(data) {
    conn.query('INSERT INTO sensor_data SET ?' ,{
        bin_id: data.trashID,
        waste_height: data.trashHeight,
        temperature: data.temperature,
        humidity: data.humidity,   
        weight: data.weight,
        data_timestamp: moment().format('YYYY:MM:DD HH:mm:ss')
    }, (err, res, fields) => {
        if (err) {
            console.log(`Error inserting sensor data: ${err.message}`);
            return;
        }

        console.log(`Inserted new sensor data`);
    })
}

module.exports = {
    sensorData
}
