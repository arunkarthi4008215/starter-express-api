
module.exports = {
    custom_sort:function (a, b) {
        return new Date(a.searched_date + a.searched_time).getTime() - new Date(a.searched_date + a.searched_time).getTime();
    },
    getWeekDates:function() {

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago in milliseconds
        const startDate = sevenDaysAgo.toISOString().substr(0, 10) + ' 00:00:00+0000'; // Start of day 7 days ago in CQL timestamp format
        const endDate = now.toISOString().substr(0, 10) + ' 23:59:59+0000';
      
        return [startDate, endDate];
    }
}    