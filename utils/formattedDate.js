const formatTimeToUTC = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

const formatDateToUTC = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

const checkDateLater = (daysLater) => {
  var now = new Date();
  const totalDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  let day = now.getDate();
  let dayLater = day + daysLater
  let month = now.getMonth() + 1;
  let year = now.getFullYear();


  if (dayLater > totalDate) {
    dayLater = dayLater - totalDate

    let nextDate = new Date(year, (month - 1) + 1, dayLater);
    return nextDate
  }
  nextDate = new Date(year, month - 1, dayLater);
  return nextDate
}

const utcTimePlus7 = () => {
  const date = new Date();
  const utcOffset = date.getTimezoneOffset() * 60000;
  const wibOffset = 7 * 60 * 60000;
  const wibTime = new Date(date.getTime() + utcOffset + wibOffset);
  return wibTime;
}

module.exports = {
  utcTimePlus7,
  checkDateLater,
  formattedDate: (timestamp) => {
    let date = new Date(timestamp);
    let options = { day: "numeric", month: "long", year: "numeric" };
    let formattedDate = new Intl.DateTimeFormat("id-ID", options).format(date);
    return formattedDate;
  },

  convertToIso: ({ day = "00", month = "01", year, hour = "00", minutes = "00", second = "00" }) => {
    return `${year}-${month}-${day}T${hour}:${minutes}:${second}.000Z`
  },

  convertTOManual: ({ day = "00", month = "01", year }) => {
    return `${year}-${month}-${day}`
  },


  formatTimeToUTC,
  formatDateToUTC,

  formatDateTimeToUTC: (dateString) => {
    return `${formatDateToUTC(dateString)} ${formatTimeToUTC(dateString)}`
  },

  formatAddZeroFront: (data) => {
    if (data.length < 2) {
      data = '0' + data;
    }
    return data
  },

  getNextWeekDate: () => {
    const currentDate = new Date();

    const nextWeekDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    return nextWeekDate;
  }
};