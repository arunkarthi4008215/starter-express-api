var express = require("express");
var app = express();
var router = express.Router();
const bodyParser = require("body-parser")
var client = require('../connections/astra_connection');

app.use(bodyParser.urlencoded({
  extended: true
}));
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/getAutoSearchProductList', async function (req, res, next) {
    let sqlQueryStr = "SELECT tenant_id,search_term,searched_date,searched_time,created_at FROM allmartprod.user_autocomplete_term"
    let rs = await client.execute(sqlQueryStr);
    if (!rs) {
      res.send({  
        status: 404,
        message: "No Reords Found!"
      });
    } else {
      dataList = rs.rows;
      tenantList = [];
      tenantData = [];
      dataList.forEach(element => {
        if (tenantList.length > 0) {
          if (!tenantList.includes(element.tenant_id.toString().trim())) {
            tenantList.push(element.tenant_id.toString().trim())
          }
        } else {
          tenantList.push(element.tenant_id.toString().trim())
        }
      });
      let tenantQueryStr = "SELECT id,account,name,email,type FROM allmartprod.tenant where type = 'b' allow filtering"
      let tenants = await client.execute(tenantQueryStr);
      
      let tenantNameList = tenants.rows
      let tenantFilterList = []
      tenantList.forEach(val =>{
        const tenant = tenantNameList.find(tenants => (tenants.id.toString() === val))
        if(tenant){
          tenantFilterList.push(tenant)
        }
      });
      dataList.forEach(element => {
          const tenantIndex = tenantFilterList.findIndex(temp => temp.id.toString().trim() === element.tenant_id.toString().trim())
          if (tenantIndex != -1) {
            element.tenant_id = tenantFilterList[tenantIndex].name
            tenantData.push(element);
          }else{
            // console.log(element.tenant_id.toString());
            element.tenant_id = "Testing"
            tenantData.push(element);
          }
      });
      tenantData = tenantData.sort((a, b) =>  b.created_at - a.created_at );
      res.send({
        tenantData
      });
    }
  });

  module.exports = router;