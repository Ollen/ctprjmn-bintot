require('./db_connect');

const   all     = require('./all_query');
const   week    = require('./weekly_query');
const   month   = require('./monthly_query');
const   year    = require('./yearly_query');

all.getAllBinData();
all.getAllSensorData();
all.getTotalNumberofBins();

week.getAverageTrashCurrentWeek();
week.getAverageTrashPerWeek();
week.getTopTenMostTrashCurrentWeek();
week.getMostTrashPerWeek();
week.getTopTenMostHumidCurrentWeek();
week.getMostHumidPerWeek();
week.getTopTenMostWeightCurrentWeek();
week.getMostWeightPerWeek();
week.getTrashPeakDayCurrentWeek();
week.getTrashPeakDayPerWeek();


Promise.all([
    month.getAverageTrashPerMonth(),
    month.getAverageTrashCurrentMonth(),
    month.getTopTenMostTrashCurrentMonth(),
    month.getMostTrashPerMonth(),
    month.getTopTenMostHumidCurrentMonth(),
    month.getMostHumidPerMonth(),
    month.getTopTenMostWeightCurrentMonth(),
    month.getMostWeightPerMonth(),
    month.getTrashPeakDayCurrentMonth(),
    month.getTrashPeakDayPerMonth()
]).then(list => {
    console.log(list);
}).catch(err => {
    console.log('Error');
});