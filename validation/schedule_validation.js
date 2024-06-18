const joi = require("joi")

const scheduleValidation = joi.object({
    city_arrive_id: joi.string().required(),
    city_destination_id: joi.string().required(),
    date_departure: joi.string().required(),
    seat_class: joi.number().required(),
    passenger: joi.object({
        children: joi.number(),
        adult: joi.number(),
    }),
    sorting: joi.object({
        timeAsc: joi.boolean(),
        time_departure_from: joi.string(),
        time_departure_to: joi.string(),
        price_from: joi.number(),
        price_to: joi.number(),
    })
})


module.exports = {
    scheduleValidation
}