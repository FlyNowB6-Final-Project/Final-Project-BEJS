const seatClassService = require("../service/seat_class_service")

const getAllSeatClass = async (req, res, next) => {
    let data = await seatClassService.getAll();
    if (!data) {
        res.status(400).json({
            status: false,
            message: "failed retrive city data",
            data: null
        })
    }

    res.status(200).json({
        status: true,
        message: "success retrive city data",
        data
    })
}

module.exports = {
    getAllSeatClass
}