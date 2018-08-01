/*** Initial Queries ***/

USE trash;

SELECT * FROM bin b;
SELECT * FROM employee e;
SELECT * FROM employee_activity ea;
SELECT * FROM location l;
SELECT * FROM sensor_data sa;

/*** Bar/Line Graph Queries ***/

-- average trash accumulated (in height) of the month 
-- --------------------------------------------------------------------------
  SELECT avg(waste_height) AS waste_height
    FROM sensor_data
   WHERE month(data_timestamp) = month(CURRENT_TIMESTAMP);

-- average trash accumulated (in height) per month 
-- --------------------------------------------------------------------------
  SELECT avg(waste_height) AS waste_height, 
         month(data_timestamp) AS month, 
	     monthname(data_timestamp) AS month_name, year(data_timestamp) AS year
    FROM sensor_data
   WHERE year(data_timestamp) = year(CURRENT_TIMESTAMP)
GROUP BY month
ORDER BY month;

-- bin that has the top 10 most trash (in height) of the month
-- --------------------------------------------------------------------------
  SELECT dt.bin_id, dt.name AS bin_name, dt_waste_height AS waste_height
    FROM (
		   SELECT b.bin_id, b.name, max(sd.waste_height) AS dt_waste_height
             FROM bin b, sensor_data sd
            WHERE b.bin_id = sd.bin_id
              AND month(sd.data_timestamp) = month(CURRENT_TIMESTAMP)
              AND sd.waste_height != 0
         GROUP BY day(sd.data_timestamp)
         ) AS dt
ORDER BY waste_height DESC
   LIMIT 10;
   
-- bin that has the most trash (in height) per month
-- --------------------------------------------------------------------------
  SELECT dt.bin_id, bin_name, max(dt_waste_height) AS waste_height, 
         month, month_name, year
    FROM (
		   SELECT b.bin_id, b.name AS bin_name, max(sd.waste_height) AS dt_waste_height, 
                  month(sd.data_timestamp) AS month, monthname(sd.data_timestamp) 
				  AS month_name, year(sd.data_timestamp) AS year
             FROM bin b, sensor_data sd
			WHERE b.bin_id = sd.bin_id
	          AND year(sd.data_timestamp) = year(CURRENT_TIMESTAMP)
              AND sd.waste_height != 0
		 GROUP BY day(sd.data_timestamp)
	     ) AS dt
GROUP BY month
ORDER BY month;

-- bin that has the top 10 most humid of the month
-- --------------------------------------------------------------------------
  SELECT dt.bin_id, dt.name AS bin_name, dt_humidity AS humidity
    FROM (
		   SELECT b.bin_id, b.name, max(sd.humidity) AS dt_humidity
             FROM bin b, sensor_data sd
            WHERE b.bin_id = sd.bin_id
              AND month(sd.data_timestamp) = month(CURRENT_TIMESTAMP)
              AND sd.humidity != 0
         GROUP BY day(sd.data_timestamp)
         ) AS dt
ORDER BY humidity DESC
   LIMIT 10;

-- trash that has the most humid per month
-- --------------------------------------------------------------------------
  SELECT dt.bin_id, bin_name, max(dt_humidity) AS humidity, month, month_name, year
    FROM (
		   SELECT b.bin_id, b.name AS bin_name, max(sd.humidity) AS dt_humidity, 
                  month(sd.data_timestamp) AS month, monthname(sd.data_timestamp) 
				  AS month_name, year(sd.data_timestamp) AS year
             FROM bin b, sensor_data sd
			WHERE b.bin_id = sd.bin_id
	          AND year(sd.data_timestamp) = year(CURRENT_TIMESTAMP)
              AND sd.humidity != 0
		 GROUP BY day(sd.data_timestamp)
	     ) AS dt
GROUP BY month
ORDER BY month;

-- bin that has the top 10 most weight of the month
-- --------------------------------------------------------------------------
  SELECT dt.bin_id, dt.name AS bin_name, dt_weight AS weight
    FROM (
		   SELECT b.bin_id, b.name, max(sd.weight) AS dt_weight
             FROM bin b, sensor_data sd
            WHERE b.bin_id = sd.bin_id
              AND month(sd.data_timestamp) = month(CURRENT_TIMESTAMP)
              AND sd.weight != 0
         GROUP BY day(sd.data_timestamp)
         ) AS dt
ORDER BY weight DESC
   LIMIT 10;

-- trash that has the most weight per month
-- --------------------------------------------------------------------------
  SELECT dt.bin_id, bin_name, max(dt_weight) AS weight, month, month_name, year
    FROM (
		   SELECT b.bin_id, b.name AS bin_name, max(sd.weight) AS dt_weight, 
                  month(sd.data_timestamp) AS month, monthname(sd.data_timestamp) 
				  AS month_name, year(sd.data_timestamp) AS year
             FROM bin b, sensor_data sd
			WHERE b.bin_id = sd.bin_id
	          AND year(sd.data_timestamp) = year(CURRENT_TIMESTAMP)
              AND sd.weight != 0
		 GROUP BY day(sd.data_timestamp)
	     ) AS dt
GROUP BY month
ORDER BY month;

-- peak day that reached trash threshold of the month
-- --------------------------------------------------------------------------
  SELECT day, max(ctr_waste_height) AS peak_waste_count, day_name
    FROM (
           SELECT day(sd.data_timestamp) AS day, count(sd.waste_height) AS ctr_waste_height,
                  dayname(sd.data_timestamp) AS day_name
			 FROM sensor_data sd, bin b
            WHERE month(sd.data_timestamp) = month(CURRENT_TIMESTAMP)
              AND sd.waste_height > (b.height * 0.75)
		 GROUP BY day
         ) AS dt;

-- peak day that reached trash threshold per month
-- --------------------------------------------------------------------------
  SELECT day, max(ctr_waste_height) AS peak_waste_count, month, month_name, day_name
    FROM (
           SELECT dayofyear(sd.data_timestamp) AS day, count(sd.waste_height) AS ctr_waste_height,
                  dayname(sd.data_timestamp) AS day_name, month(sd.data_timestamp) 
                  AS month, monthname(sd.data_timestamp) AS month_name
		     FROM sensor_data sd, bin b
            WHERE year(sd.data_timestamp) = year(CURRENT_TIMESTAMP)
              AND sd.waste_height > (b.height * 0.75)
		 GROUP BY dayofyear(sd.data_timestamp)
		 ) AS dt
GROUP BY month
ORDER BY month;
