const scheduleService = require("../service/schedule_service")
const { formatTimeToUTC, formatAddZeroFront, convertToIso } = require("../utils/formattedDate")

const findSchedule = async (req, res, next) => {
    const { city_arrive_id, city_destination_id, date_departure, seat_class, passenger } = req.body
    if (!city_arrive_id || !city_destination_id || !date_departure || !seat_class || !passenger) {
        return res.status(400).json({
            status: false,
            message: "field cant empty",
            data: null
        })
    }


    let [day, month, year] = date_departure.split('-');

    day = formatAddZeroFront(day)
    month = formatAddZeroFront(month)

    let isoDate = convertToIso({ day, month, year })
    let data = await scheduleService.getDataFind(city_arrive_id, city_destination_id, isoDate)
    if (!data) {
        return res.status(400).json({
            status: false,
            message: "failed retrive schedule data",
            data: null
        })
    }

    data.forEach((v) => {

        v.time_arrive = formatTimeToUTC(v.time_arrive)
        v.time_departure = formatTimeToUTC(v.time_departure)

        let day = v.date_flight.getUTCDate();
        let month = v.date_flight.getUTCMonth() + 1;
        let year = v.date_flight.getUTCFullYear();

        day = day.toString().padStart(2, '0')
        month = month.toString().padStart(2, '0')

        let fullDate = `${day}-${month}-${year}`;
        v.date_flight = fullDate
    })
    return res.status(200).json({
        status: true,
        message: "success retrive schedule data",
        data
    })
}



module.exports = {
    findSchedule
}