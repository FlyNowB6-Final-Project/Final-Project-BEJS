const cityService = require("../service/city_service")

const getAllCity = async (req, res, next) => {
    let { find } = req.query
    let data = await cityService.get(find);
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
    getAllCity
}