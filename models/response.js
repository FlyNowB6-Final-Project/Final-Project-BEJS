const response = ({ status = true, message = "Success", data = null, page = null, perPage = null, pageCount = null, totalCount = null }) => {
    return {
        status,
        message,
        data,
        page,
        perPage,
        pageCount,
        totalCount
    };
};

module.exports = response
