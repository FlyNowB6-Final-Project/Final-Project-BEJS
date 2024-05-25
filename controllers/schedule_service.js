const scheduleService = require("../service/schedule_service")

const findSchedule = async (req, res, next) => {
    const { city_arrive_id, city_destination_id} = req.body
    if (!city_arrive_id || !city_destination_id) {
        return res.status(400).json({
            status: false,
            message: "field cant empty",
            data: null
        })
    }
    let data = await scheduleService.getDataFind(city_arrive_id, city_destination_id)
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


module.exports = {
    findSchedule
}