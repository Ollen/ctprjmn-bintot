const conn = require('./db_connect');

function getAllBinData() {
    return new Promise((resolve, reject) => {
        conn.query(`
            SELECT b.bin_id, b.name 
                AS bin_name, b.height AS bin_height, l.address, l.city, l.state
            FROM bin b, location l
            WHERE b.location_id = l.location_id;
         `, (err, res, field) => {
            if(err) {
                console.log(`Error at getAllBinData: ${err.message}`);
                reject();
            }
    
            resolve (res);
        });

    });
}

function getAllSensorData() {
    return new Promise((resolve, reject) => {
        conn.query(`
            SELECT sd.data_id, b.name AS bin_name, 
            sd.waste_height, sd.temperature, 
            sd.humidity, sd.weight, sd.data_timestamp
            FROM bin b, sensor_data sd
            WHERE b.bin_id = sd.bin_id
            ORDER BY sd.data_timestamp;
        `, (err, res, field) => {
            if(err) {
                console.log(`Error at getAllSensorData: ${err.message}`);
                reject();
            }
            resolve(res);
        })
    });
}

function getTotalNumberofBins() {
    return new Promise((resolve, reject) => {
        conn.query(`
            SELECT COUNT(b.bin_id) AS bin_total
            FROM bin b;
        `, (err, res, field) => {
            if(err) {
                console.log(`Error at getNumberofBins: ${err.message}`);
                reject();
            }
            resolve(res);
        })
    })
}

module.exports = {
    getAllBinData,
    getAllSensorData,
    getTotalNumberofBins
}