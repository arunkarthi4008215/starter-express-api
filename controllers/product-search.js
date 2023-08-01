var express = require("express");
var app = express();
var router = express.Router();
const bodyParser = require("body-parser")
var client = require('../connections/astra_connection');
const Utill = require('../service/utill')

app.use(bodyParser.urlencoded({
  extended: true
}));
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/getAutoSearchProductList', async function (req, res, next) {
    let [start, end] = Utill.getWeekDates();
    let sqlQueryStr = "SELECT tenant_id,search_term,searched_date,searched_time,created_at FROM supplybuy.user_autocomplete_term WHERE created_at >= '" + start.toString() + "' AND created_at <= '"+ end.toString()+"' allow filtering;"
    let rs = await client.execute(sqlQueryStr);
    if (!rs) {
      res.send({  
        status: 404,
        message: "No Reords Found!"
      });
    } else {
      dataList = rs.rows;
      console.log('Autocomlete count',dataList.length)
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
      let tenantQueryStr = "SELECT id,account,name,email,type FROM supplybuy.tenant where type = 'b' allow filtering"
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
          if (tenantIndex != -1 && element.tenant_id.toString() !="00133519-17a5-4a5a-953c-90edfc6d9ddf"  ) {
            element.tenant_id = tenantFilterList[tenantIndex].name
            tenantData.push(element);
          }
      });
      tenantData = tenantData.sort((a, b) =>  b.created_at - a.created_at );
      res.send({
        tenantData
      });
    }
  });

router.get('/getActionToCartList', async function (req, res, next) {
    let [start, end] = Utill.getWeekDates();
    let sqlQueryStr = "SELECT * FROM supplybuy.tenant_buyer_cart WHERE created_at >= '" + start.toString() + "' AND created_at <= '"+ end.toString()+"' allow filtering;"
    let rs = await client.execute(sqlQueryStr);
    if (!rs) {
      res.send({  
        status: 404,
        message: "No Reords Found!"
      });
    } else {
      dataList = rs.rows;
      console.log('Autocomlete count',dataList.length)
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
      
      let tenantQueryStr = "SELECT id,account,name,email,type FROM supplybuy.tenant where type = 'b' allow filtering"
      let tenants = await client.execute(tenantQueryStr);
      
      let tenantNameList = tenants.rows
      let tenantFilterList = []
      tenantList.forEach(val =>{
        const tenant = tenantNameList.find(tenants => (tenants.id.toString() === val))
        if(tenant){
          tenantFilterList.push(tenant)
        }
      });
      dataList.forEach(async element => {
          const tenantIndex = tenantFilterList.findIndex(temp => temp.id.toString().trim() === element.tenant_id.toString().trim())
          if (tenantIndex != -1 && element.tenant_id.toString() !="00133519-17a5-4a5a-953c-90edfc6d9ddf"  ) {
            element.tenant_id = tenantFilterList[tenantIndex].name
            tenantData.push(element);
          }
      });
      tenantData = tenantData.sort((a, b) =>  b.created_at - a.created_at );

      tenantData.forEach( async element=>{
        let productQueryStr = "SELECT name,variant_name FROM supplybuy.tenant_product where id = " + element.product_id +';';
        let products = await client.execute(productQueryStr);
        element.product_id = products.rows[0].name +"-"+ products.rows[0].variant_name
        // console.log('Product',element.product_id)
      }
      );
      res.send({tenantData});      
    }
  });


  // router.get('/getAllproducts', async function (req, res, next) {
  //   let sqlQueryStr = "SELECT id,tenant_id,branchid,code,name,variant_name,cost_per_unit,uom FROM supplybuy.tenant_product"
  //   let rs = await client.execute(sqlQueryStr);
  //   if (!rs) {
  //     res.send({  
  //       status: 404,
  //       message: "No Reords Found!"
  //     });
  //   } else {
  //     let tenantData = rs.rows
  //     tenantData = tenantData.sort((a, b) =>  b.created_at - a.created_at );
  //     res.send({
  //       tenantData
  //     });
  //   }
  // });
  module.exports = router;