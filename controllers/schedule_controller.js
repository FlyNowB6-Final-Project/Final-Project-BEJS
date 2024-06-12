const orderService = require("../service/order_service")
const scheduleService = require("../service/schedule_service")
const { formatTimeToUTC, formatAddZeroFront, convertToIso } = require("../utils/formattedDate")
const paginationPage = require("../utils/pagination")

const findSchedule = async (req, res, next) => {
    const { city_arrive_id, city_destination_id, date_departure, seat_class, passenger } = req.body
    let { page } = req.query
    if (!city_arrive_id || !city_destination_id || !date_departure || !seat_class || !passenger) {
        return res.status(400).json({
            status: false,
            message: "field cant empty",
            data: null
        })
    }



    let pagination = paginationPage(page)

    let [day, month, year] = date_departure.split('-');

    day = formatAddZeroFront(day)
    month = formatAddZeroFront(month)

    let isoDate = convertToIso({ day, month, year })

    totalPasenger = calculateTotalPassengers(passenger)

    let allData = []

    let data = await scheduleService.getDataFind(city_arrive_id, city_destination_id, isoDate, pagination.skip, pagination.take)

    if (!data || data.length === 0) {
        return res.status(400).json({
            status: false,
            message: "failed retrive schedule data",
            data: null
        })
    }
    for (const value of data) {
        let detailFlight = await scheduleService.getDetailFlightByFlightId(value.id);
        let mergedData = detailFlight
            .filter(flightDetail => flightDetail.detailPlaneId.seat_class.id === seat_class)
            .map(flightDetail => ({
                flightDetailId: flightDetail.id,
                price: flightDetail.price,
                totalPrice: flightDetail.price * totalPasenger,
                flightSeat: flightDetail.detailPlaneId.seat_class.type_class,
                flightPlane: flightDetail.detailPlaneId.plane.name,
                ...value,
            }));

        allData.push(...mergedData);
    }

    allData.forEach((v) => {
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



    allData.sort((a, b) => {
        let timeA = new Date(`1970-01-01T${a.time_departure}Z`);
        let timeB = new Date(`1970-01-01T${b.time_departure}Z`);
        return timeA - timeB;
    });

    return res.status(200).json({
        status: true,
        message: "success retrive schedule data",
        data: allData
    })
}

const mostPurchaseSchedule = async (req, res, next) => {
    const { continent } = req.query
    let isContinent = false
    let data
    if (continent != null) {
        isContinent = true
        data = await orderService.getDataForRecomendationByContinent(Number(continent))
    } else {
        data = await orderService.getDataForRecomendation()
    }

    data.forEach((countryObject) => {
        countryObject.order_count = Number(countryObject.order_count);
    });

    data.sort((a, b) => b.order_count - a.order_count);

    data = data.slice(0, 5)

    for (let item of data) {
        item.detail = await scheduleService.getDetailFlightById(item.detail_flight_id);
    }
    if (data.length == 0 && !isContinent) {
        data = await scheduleService.getDetailFlight()
    }


    if (!data) {
        return res.status(400).json({
            status: false,
            message: "failed retrive schedule data",
            data: null
        })
    }
    return res.status(200).json({
        status: true,
        message: "success retrive schedule data",
        data
    })
}

function calculateTotalPassengers(passenger) {
    const { adult, children } = passenger
    return Number(adult) + Number(children)
}




module.exports = {
    findSchedule,
    mostPurchaseSchedule
}