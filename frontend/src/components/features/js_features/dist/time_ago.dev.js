"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = timeAgo;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// function getFormattedDate(date, prefomattedDate = false, hideYear = false) {
//     const day = date.getDate();
//     const month = MONTH_NAMES[date.getMonth()];
//     const year = date.getFullYear();
//     const hours = date.getHours();
//     let minutes = date.getMinutes();
//     if (minutes < 10) {
//       // Adding leading zero to minutes
//       minutes = `0${ minutes }`;
//     }
//     if (prefomattedDate) {
//       // Today at 10:20
//       // Yesterday at 10:20
//       return `${ prefomattedDate } at ${ hours }:${ minutes }`;
//     }
//     if (hideYear) {
//       // 10. January at 10:20
//       return `${ day }. ${ month } at ${ hours }:${ minutes }`;
//     }
//     // 10. January 2017. at 10:20
//     return `${ day }. ${ month } ${ year }. at ${ hours }:${ minutes }`;
//   }
// --- Main function
function timeAgo(dateParam) {
  if (!dateParam) {
    return null;
  }

  var date = _typeof(dateParam) === 'object' ? dateParam : new Date(dateParam);
  var DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000

  var today = new Date();
  var yesterday = new Date(today - DAY_IN_MS);
  var seconds = Math.round((today - date) / 1000);
  var minutes = Math.round(seconds / 60);
  var isToday = today.toDateString() === date.toDateString();
  var isYesterday = yesterday.toDateString() === date.toDateString();
  var isThisYear = today.getFullYear() === date.getFullYear();

  if (seconds < 5) {
    return 'now';
  } else if (seconds < 60) {
    return "".concat(seconds, " seconds ago");
  } else if (seconds < 90) {
    return 'about a minute ago';
  } else if (minutes < 60) {
    return "".concat(minutes, " minutes ago");
  } else if (isToday) {
    return getFormattedDate(date, 'Today'); // Today at 10:20
  } else if (isYesterday) {
    return getFormattedDate(date, 'Yesterday'); // Yesterday at 10:20
  } else if (isThisYear) {
    return getFormattedDate(date, false, true); // 10. January at 10:20
  }

  return getFormattedDate(date); // 10. January 2017. at 10:20
}