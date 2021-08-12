const express = require('express');
const router = express.Router();

/* GET lessons page. */
router.get('/', (req, res, next) => {

  // date-fns function declarations
  const utcToZonedTime    = require('date-fns-tz/utcToZonedTime');
  const startOfMonth      = require('date-fns/startOfMonth');
  const eachDayOfInterval = require('date-fns/eachDayOfInterval');
  const subDays           = require('date-fns/subDays');
  const endOfMonth        = require('date-fns/endOfMonth');
  const addDays           = require('date-fns/addDays');

  // Declare variables for lessons calendar
  const todayUTC = new Date();
  const today    = utcToZonedTime(todayUTC, 'America/New_York');

  // First and last day of current month
  const firstDayOfMonth = startOfMonth(today);
  const lastDayOfMonth  = endOfMonth(today);

  // Array to hold Date objects for previous month/current month
  var dates = [];

  // Get filler days from previous month for first week of current month
  if (firstDayOfMonth.getDay() > 0) {
    // Start date from previous month
    const prevMonthStart = subDays(firstDayOfMonth, firstDayOfMonth.getDay());

    const prevMonthDays = eachDayOfInterval({
      start: prevMonthStart,
      end: endOfMonth(prevMonthStart)
    });

    prevMonthDays.forEach(date => {
      dates.push(date);
    });

  } // if (firstDayOfMonth.getDay() > 0)

  // Add days from current month
  const currMonthDays = eachDayOfInterval({
    start:firstDayOfMonth,
    end: lastDayOfMonth
  });

  currMonthDays.forEach(date => {
    dates.push(date);
  });

  // Get filler days from following month for last week of current month
  if (lastDayOfMonth.getDay() < 6) {
    // First day of next month
    const nextMonthStart = addDays(lastDayOfMonth, 1);

    // End day from next month
    const nextMonthEnd = addDays(lastDayOfMonth, 6 - lastDayOfMonth.getDay());

    const nextMonthDays = eachDayOfInterval({
      start: nextMonthStart,
      end: nextMonthEnd
    });

    nextMonthDays.forEach(date => {
      dates.push(date);
    });

  } // if (lastDayOfMonth.getDay() < 6)

  // Additional date-fns functions to pass to calendar.ejs
  const isThisMonth = require('date-fns/isThisMonth');
  const isToday     = require('date-fns/isToday');
  const isPast      = require('date-fns/isPast');
  const isWednesday = require('date-fns/isWednesday');
  const isFriday    = require('date-fns/isFriday');
  const isSaturday  = require('date-fns/isSaturday');
  const isSunday    = require('date-fns/isSunday');
  const format      = require('date-fns/format');

  res.render('lessons',
            {
              dates: dates,
              utcToZonedTime: utcToZonedTime,
              isThisMonth: isThisMonth,
              isToday: isToday,
              isPast: isPast,
              isWednesday: isWednesday,
              isFriday: isFriday,
              isSaturday: isSaturday,
              isSunday: isSunday,
              format: format
            });
});

module.exports = router;