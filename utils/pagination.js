function paginationPage(page = 1) {
    let skip = 0
    let take = 10

    skip = (page - 1) * take
    return {
        skip,
        take
    }
}


module.exports = paginationPage