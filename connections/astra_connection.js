const { Client } = require("cassandra-driver");
var client;
async function run(){
//**************** */ Develop*****************
//    client = new Client({
//          cloud: {
//          secureConnectBundle: "./Connections/secure-connect-allmartb2b-dev.zip",
//          },
//          credentials: {
//          username: "eKqUgOeXQzlefEXBxRwRPfHW",
//          password: "o1jJ7jdN86E9_S8hMMaFlJp-84+gmhhUgb,8B9.P1HB+dZ3TOgvfZsj5fUPAftar3i+3s5Jz9PI35MaSzlfMRmLPkL4kTam3tr4uYH83bEOtX,dsgq-ZRT2_c-9hdeNy",
//          },
//       });
//**************** */ Live *****************
   client = new Client({
         cloud: {
         secureConnectBundle: "./Connections/secure-connect-allmartb2bprod.zip",
         },
         credentials: {
         username: "ZybozuQdrPjtwCgXlIwOQfxD",
         password: "ZqzocNRhrlqMxXO8RIC1W8ee72uzgXZRKXF,X1PQ4zQA3vb57iFB9GUaTLmCS0MMHY6znIHWwRR0o465LyQYbZJMiFw.+8kac9r6iwkpQ+eqfYWU1koCIKivJd3cg596",
         },
      });

      await client.connect();
      
   
}

run()

module.exports = client;