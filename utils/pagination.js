function paginationPage(page = 1) {
    let skip = 0
    let take = 10

    skip = (page - 1) * take
    return {
        skip,
        take
    }
}

function paginationPageTotal(totalData, dataPerPage = 10) {
    if (dataPerPage <= 0) {
        throw new Error("dataPerPage must be greater than 0");
    }

    return Math.ceil(totalData / dataPerPage);
}


module.exports = {
    paginationPage,
    paginationPageTotal
}