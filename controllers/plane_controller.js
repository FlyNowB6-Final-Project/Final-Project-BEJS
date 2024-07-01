const { createPlaneData, createDetailPlane, getAirlinesData, checkPlaneSeries, getDetailPlane } = require("../service/plane_service")
const jsonResponse = require("../utils/response")
const planeValidation = require("../validation/plane_validataion")
const { validate } = require("../validation/validation")


const createPlane = async (req, res, next) => {
    try {
        const reqBody = validate(planeValidation, req.body)

        const isAvailable = await checkPlaneSeries(reqBody.series)
        if (isAvailable > 0) {
            return jsonResponse(res, 400, {
                status: false,
                message: "Series already in exist"
            })
        }
        let planeData = await createPlaneData({
            name: reqBody.name,
            brand: reqBody.series,
            series: reqBody.series,
            capacity: reqBody.capacity,
            airline_id: reqBody.airline_id
        })

        let detailDataPlane = reqBody.detail_plane.map(element => {
            return {
                seat_class_id: element.seat_class_id,
                total_seat: element.total_seat,
                plane_id: planeData.id
            }
        });

        const detailPlane = await createDetailPlane(detailDataPlane)

        const dataDetail = await getDetailPlane(planeData.id)

        if (!planeData && !detailPlane && !dataDetail) {
            return jsonResponse(res, 400, {
                status: false,
                message: "failed add new plane"
            })
        }

        planeData.detail_plane = dataDetail

        return jsonResponse(res, 200, {
            message: "success retrive data",
            data: planeData
        })
    } catch (error) {
        next(error)
    }
}

const getAirlines = async (req, res, next) => {
    try {
        const data = await getAirlinesData()
        if (!data) {
            return jsonResponse(res, 400, {
                status: false,
                message: "Airlines data empty",
            })
        }
        return jsonResponse(res, 400, {
            status: true,
            message: "Success retrive airlines",
            data
        })
    } catch (error) {
        next(error)
    }
}



module.exports = {
    createPlane,
    getAirlines
}