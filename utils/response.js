
const jsonResponse = (res, code = 200, { status = true, message = "Success", data = null, page = null, perPage = null, pageCount = null, totalCount = null }) => {
    return res.status(code).json({
        status,
        message,
        data,
        page,
        perPage,
        pageCount,
        totalCount
    })
}

module.exports = jsonResponse
