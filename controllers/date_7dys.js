const now = new Date();
const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago in milliseconds
const startDate = sevenDaysAgo.toISOString().substr(0, 10) + ' 00:00:00+0000'; // Start of day 7 days ago in CQL timestamp format
const endDate = now.toISOString().substr(0, 10) + ' 23:59:59+0000'; // End of today in CQL timestamp format

console.log(startDate); // Start timestamp for 7 days ago in CQL format
console.log(endDate); // End timestamp for today in CQL format
