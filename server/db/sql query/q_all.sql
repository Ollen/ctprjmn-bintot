/*** Initial Queries ***/

USE trash;

SELECT * FROM bin b;
SELECT * FROM employee e;
SELECT * FROM employee_activity ea;
SELECT * FROM location l;
SELECT * FROM sensor_data sa;

/*** Table Queries ***/

-- All bin information: name, height, location
-- -------------------------------------
  SELECT b.bin_id, b.name AS bin_name, 
         b.height AS bin_height, l.address, l.city, l.state
    FROM bin b, location l
   WHERE b.location_id = l.location_id;

-- All sensor data information: bin name, waste height, temperature, humidity, weight, data_timestamp
-- -------------------------------------
  SELECT sd.data_id, b.name AS bin_name, 
         sd.waste_height, sd.temperature, 
         sd.humidity, sd.weight, sd.data_timestamp
    FROM bin b, sensor_data sd
   WHERE b.bin_id = sd.bin_id
ORDER BY sd.data_timestamp;

-- Get number of bins
-- -------------------------------------
  SELECT COUNT(b.bin_id) AS bin_total
    FROM bin b;
