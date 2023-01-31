
module.exports = {
    custom_sort:function (a, b) {
        return new Date(a.searched_date + a.searched_time).getTime() - new Date(a.searched_date + a.searched_time).getTime();
    }
}    