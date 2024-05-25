const scheduleService = require("../service/schedule_service")

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

    if (day.length < 2) {
        day = '0' + day;
    }
    if (month.length < 2) {
        month = '0' + month;
    }

    let isoDate = `${year}-${month}-${day}T00:00:00.000Z`;
    let data = await scheduleService.getDataFind(city_arrive_id, city_destination_id, isoDate)
    if (!data) {
        return res.status(400).json({
            status: false,
            message: "failed retrive schedule data",
            data: null
        })
    }

    data.forEach((v) => {
        v.time_arrive = new Date(v.time_arrive).getUTCHours()
        v.time_departure = new Date(v.time_departure).getUTCHours()

        let day = v.date_flight.getUTCDate();
        let month = v.date_flight.getUTCMonth() + 1;
        let year = v.date_flight.getUTCFullYear();
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