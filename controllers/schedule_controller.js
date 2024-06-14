const orderService = require("../service/order_service")
const scheduleService = require("../service/schedule_service")
const { formatTimeToUTC, formatAddZeroFront, convertToIso } = require("../utils/formattedDate")
const pagination = require("../utils/pagination")
const jsonResponse = require("../utils/response")

const findSchedule = async (req, res, next) => {
    const { city_arrive_id, city_destination_id, date_departure, seat_class, passenger } = req.body
    const { page } = req.query
    if (!city_arrive_id || !city_destination_id || !date_departure || !seat_class || !passenger) {
        return jsonResponse(res, 400, { status: false, message: "faield cant empty", })
    }
    let [day, month, year] = date_departure.split('-');
    day = formatAddZeroFront(day)
    month = formatAddZeroFront(month)
    let allData = []

    let isoDate = convertToIso({ day, month, year })
    let paginat = pagination.paginationPage(Number(page))
    let totalPasenger = calculateTotalPassengers(passenger)

    let data = await scheduleService.getDataFind(city_arrive_id, city_destination_id, isoDate, paginat.skip, paginat.take)
    let totalData = await scheduleService.countDataFind(city_arrive_id, city_destination_id, isoDate,)
    let totalPage = pagination.paginationPageTotal(totalData)

    if (!data || data.length === 0) {
        return jsonResponse(res, 400, { status: false, message: "failed retrive schedule data", })
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

    if (!allData) {
        return jsonResponse(res, 400, {
            status: false,
            message: "schedule data not found",
        })
    }

    return jsonResponse(res, 200, {
        message: "success retrive schedule data",
        data: allData,
        page: Number(page) ?? 1,
        perPage: allData.length,
        pageCount: totalPage,
        totalCount: totalData,
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
        return jsonResponse(res, 400, {
            status: false,
            message: "schedule data not found",
        })
    }

    return jsonResponse(res, 200, {
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