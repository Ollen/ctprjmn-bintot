const conn = require('./db_connect');

function getAverageTrashCurrentYear() {
    return new Promise((resolve, reject) => {
        conn.query(
        `
        SELECT avg(waste_height) AS waste_height
        FROM sensor_data
        WHERE year(data_timestamp) = year(CURRENT_TIMESTAMP);
        `,
        (err,res,field) => {
            if (err) {
                console.log(`Error at getAverageTrashCurrentYear:${err.message}`)
                reject();
            }
            console.log(res);
            resolve(res);
        });
    });
}

function getAverageTrashPerYear() {
    return new Promise((resolve, reject) => {
        conn.query(
        `
        SELECT avg(waste_height) AS waste_height, 
        year(data_timestamp) AS year
        FROM sensor_data
        GROUP BY year
        ORDER BY year;
        `,
        (err,res,field) => {
            if (err) {
                console.log(`Error at getAverageTrashPerYear:${err.message}`)
                reject();
            }
            console.log(res);
            resolve(res);
        });
    });
}

function getTopTenMostTrashCurrentYear() {
    return new Promise((resolve, reject) => {
        conn.query(
        `
        SELECT dt.bin_id, dt.name AS bin_name, dt_waste_height AS waste_height
        FROM (
        SELECT b.bin_id, b.name, max(sd.waste_height) AS dt_waste_height
        FROM bin b, sensor_data sd
        WHERE b.bin_id = sd.bin_id
        AND year(sd.data_timestamp) = year(CURRENT_TIMESTAMP)
        AND sd.waste_height != 0
        GROUP BY dayofyear(sd.data_timestamp)
        ) AS dt
        ORDER BY waste_height DESC
        LIMIT 10;
        `,
        (err,res,field) => {
            if (err) {
                console.log(`Error at getTopTenMostTrashCurrentYear:${err.message}`)
                reject();
            }
            console.log(res);
            resolve(res);
        });
    });
}

function getMostTrashPerYear() {
    return new Promise((resolve, reject) => {
        conn.query(
        `
        SELECT dt.bin_id, bin_name, max(dt_waste_height) AS waste_height, year
        FROM (
        SELECT b.bin_id, b.name AS bin_name, max(sd.waste_height) AS dt_waste_height, 
        (year(sd.data_timestamp) * 1000) + dayofyear(sd.data_timestamp) AS year_day,
        year(sd.data_timestamp) AS year
        FROM bin b, sensor_data sd
        WHERE b.bin_id = sd.bin_id
        AND sd.waste_height != 0
        GROUP BY year_day
        ) AS dt
        GROUP BY year
        ORDER BY year;
        `,
        (err,res,field) => {
            if (err) {
                console.log(`Error at getMostTrashPerYear:${err.message}`)
                reject();
            }
            console.log(res);
            resolve(res);
        });
    });
}

function getTopTenMostHumidCurrentYear() {
    return new Promise((resolve, reject) => {
        conn.query(
        `
        SELECT dt.bin_id, dt.name AS bin_name, dt_humidity AS humidity
        FROM (
        SELECT b.bin_id, b.name, max(sd.humidity) AS dt_humidity
        FROM bin b, sensor_data sd
        WHERE b.bin_id = sd.bin_id
        AND year(sd.data_timestamp) = year(CURRENT_TIMESTAMP)
        AND sd.humidity != 0
        GROUP BY dayofyear(sd.data_timestamp)
        ) AS dt
        ORDER BY humidity DESC
        LIMIT 10;
        `,
        (err,res,field) => {
            if (err) {
                console.log(`Error at getTopTenMostHumidCurrentYear:${err.message}`)
                reject();
            }
            console.log(res);
            resolve(res);
        });
    });
}

function getMostHumidPerYear() {
    return new Promise((resolve, reject) => {
        conn.query(
        `
        SELECT dt.bin_id, bin_name, max(dt_humidity) AS humidity, year
        FROM (
        SELECT b.bin_id, b.name AS bin_name, max(sd.humidity) AS dt_humidity, 
        (year(sd.data_timestamp) * 1000) + dayofyear(sd.data_timestamp) AS year_day,
        year(sd.data_timestamp) AS year
        FROM bin b, sensor_data sd
        WHERE b.bin_id = sd.bin_id
        AND sd.humidity != 0
        GROUP BY year_day
        ) AS dt
        GROUP BY year
        ORDER BY year;
        `,
        (err,res,field) => {
            if (err) {
                console.log(`Error at getMostHumidPerYear:${err.message}`)
                reject();
            }
            console.log(res);
            resolve(res);
        });
    });
}

function getTopTenMostWeightCurrentYear() {
    return new Promise((resolve, reject) => {
        conn.query(
        `
        SELECT dt.bin_id, dt.name AS bin_name, dt_weight AS weight
        FROM (
        SELECT b.bin_id, b.name, max(sd.weight) AS dt_weight
        FROM bin b, sensor_data sd
        WHERE b.bin_id = sd.bin_id
        AND year(sd.data_timestamp) = year(CURRENT_TIMESTAMP)
        AND sd.weight != 0
        GROUP BY dayofyear(sd.data_timestamp)
        ) AS dt
        ORDER BY weight DESC
        LIMIT 10;
        `,
        (err,res,field) => {
            if (err) {
                console.log(`Error at getTopTenMostWeightCurrentYear:${err.message}`)
                reject();
            }
            console.log(res);
            resolve(res);
        });
    });
}

function getMostWeightPerYear() {
    return new Promise((resolve, reject) => {
        conn.query(
        `
        SELECT dt.bin_id, bin_name, max(dt_weight) AS weight, year
        FROM (
        SELECT b.bin_id, b.name AS bin_name, max(sd.weight) AS dt_weight, 
        (year(sd.data_timestamp) * 1000) + dayofyear(sd.data_timestamp) AS year_day,
        year(sd.data_timestamp) AS year
        FROM bin b, sensor_data sd
        WHERE b.bin_id = sd.bin_id
        AND sd.weight != 0
        GROUP BY year_day
        ) AS dt
        GROUP BY year
        ORDER BY year;
        `,
        (err,res,field) => {
            if (err) {
                console.log(`Error at getMostWeightPerYear:${err.message}`)
                reject();
            }
            console.log(res);
            resolve(res);
        });
    });
}

function getTrashPeakDayCurrentYear() {
    return new Promise((resolve, reject) => {
        conn.query(
        `
        SELECT day, max(ctr_waste_height) AS peak_waste_count, day_name
        FROM (
        SELECT dayofyear(sd.data_timestamp) AS day, count(sd.waste_height) AS ctr_waste_height,
        (year(sd.data_timestamp) * 1000) + dayofyear(sd.data_timestamp) AS year_day,
        dayname(sd.data_timestamp) AS day_name
        FROM sensor_data sd, bin b
        WHERE year(sd.data_timestamp) = year(CURRENT_TIMESTAMP)
        AND sd.waste_height > (b.height * 0.75)
        GROUP BY year_day
        ) AS dt;
        `,
        (err,res,field) => {
            if (err) {
                console.log(`Error at getTrashPeakDayCurrentYear:${err.message}`)
                reject();
            }
            console.log(res);
            resolve(res);
        });
    });
}

function getTrashPeakDayPerYear() {
    return new Promise((resolve, reject) => {
        conn.query(
        `
        SELECT day, max(ctr_waste_height) AS peak_waste_count, year, day_name
        FROM (
        SELECT dayofyear(sd.data_timestamp) AS day, year(sd.data_timestamp) AS year,
        count(sd.waste_height) AS ctr_waste_height,
        dayname(sd.data_timestamp) AS day_name,
        (year(sd.data_timestamp) * 1000) + dayofyear(sd.data_timestamp) AS year_day
        FROM sensor_data sd, bin b
        WHERE sd.waste_height > (b.height * 0.75)
        GROUP BY year_day
        ) AS dt
        GROUP BY year
        ORDER BY year;
        `,
        (err,res,field) => {
            if (err) {
                console.log(`Error at getTrashPeakDayPerYear:${err.message}`)
                reject();
            }
            console.log(res);
            resolve(res);
        });
    });
}

module.exports = {
    getAverageTrashCurrentYear,
    getAverageTrashPerYear,
    getTopTenMostTrashCurrentYear,
    getMostTrashPerYear,
    getTopTenMostHumidCurrentYear,
    getMostHumidPerYear,
    getTopTenMostWeightCurrentYear,
    getMostWeightPerYear,
    getTrashPeakDayCurrentYear,
    getTrashPeakDayPerYear,
};