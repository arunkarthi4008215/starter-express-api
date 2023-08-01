var express = require("express");
var app = express();
var router = express.Router();
const bodyParser = require("body-parser")
const Utill = require('../service/utill')
var client = require('../connections/astra_connection');

app.use(bodyParser.urlencoded({
  extended: true
}));
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/getSkuProductList', async function (req, res, next) {
  let sqlQueryStr = "SELECT category,subcategory,code,name,variant_name,uom,gst_percentage,cost_per_unit,order_qty_threshold_min,tenant_id,description  FROM supplybuy.tenant_product where status='approved' and ispublished = true and isenabled = true and isdelete = false ALLOW FILTERING;"
  let rs = await client.execute(sqlQueryStr);
  if (!rs) {
    res.send({
      status: 404,  
      message: "No Reords Found!"
    });
  } else {
    let productsList = rs.rows
    let sqlQueryStr = "SELECT id,name,brand FROM supplybuy.tenant"
    let tenant = await client.execute(sqlQueryStr);
    let tenantList = tenant.rows
    productsList.forEach(item =>{
      tenantIdx = tenantList.findIndex(temp => temp.id.toString() == item.tenant_id.toString())
      if (tenantIdx == -1){
        item.tenant_id = "-"
        
      }else{

        item.tenant_id = tenantList[tenantIdx].name
      }
    })
    res.send(
      {
        status: 200,
        data: productsList,
        count:productsList.length,
        message: "Data Successfully Recieved!"
      }
    );
  }
});
router.get('/getProductList', async function (req, res, next) {
  let sqlQueryStr = "SELECT name,variant_name,image_set,category  FROM supplybuy.tenant_product where status='approved' and ispublished = true and isenabled = true and isdelete = false ALLOW FILTERING;"
  let rs = await client.execute(sqlQueryStr);
  if (!rs) {
    res.send({
      status: 404,  
      message: "No Reords Found!"
    });
  } else {
    res.send(
      {
        status: 200,
        data: rs.rows,
        count:rs.rows.length,
        message: "Data Successfully Recieved!"
      }
    );
  }
});
router.get('/getSearchProductList', async function (req, res, next) {
  let [start, end] = Utill.getWeekDates();
  let sqlQueryStr = "SELECT tenant_id,search_product,search_term,searched_date,searched_time,created_at FROM supplybuy.user_search_term WHERE created_at >= '" + start.toString() + "' AND created_at <= '"+ end.toString()+"' allow filtering;"
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
        if (tenantIndex != -1 && element.tenant_id.toString() !="00133519-17a5-4a5a-953c-90edfc6d9ddf") {
          element.tenant_id = tenantFilterList[tenantIndex].name
          tenantData.push(element);
        }
    });
    tenantData = tenantData.sort((a, b) =>  b.created_at - a.created_at );
    res.send({
      tenantData
    });
  }
})

router.get('/getProductCount', async function (req, res, next) {
  let sqlQueryStr = "SELECT id,tenant_id,name,code,image_set,image_url,status,delivered_by,mark_updown_amount,mark_updown_percentage  FROM supplybuy.tenant_product where mark_updown_amount >= '' ALLOW FILTERING;"
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

    let tenantQueryStr = "SELECT id,account,name,email,type  FROM supplybuy.tenant"
    let tenants = await client.execute(tenantQueryStr);

    let tenantNameList = tenants.rows
    let tenantFilterList = []
    tenantList.forEach(val =>{
      const tenant = tenantNameList.find(tenants => (tenants.id.toString() === val && tenants.type != 'badmin'))
      if(tenant){
        tenantFilterList.push(tenant)
      }
    })
    // console.log(tenantFilterList);
    dataList.forEach(element => {
      tenantFilterList.forEach(item => {
        const tenantIndex = tenantData.findIndex(temp => temp.id === item.id.toString())
        if (tenantIndex == -1) {
          tenantData.push({
            "id": item.id.toString(),
            "Name":item.name,
            "Account_Id":item.account,
            "Total_Products": element.tenant_id.toString() === item.id.toString() ? 1 :0,
            "Approved_Products": (element.status == 'approved' && element.tenant_id.toString() === item.id.toString() )? 1 : 0,
            "Pending_Products": (element.status == 'pending' && element.tenant_id.toString() === item.id.toString() )? 1 : 0,
            "Rejected_Products": (element.status == 'rejected' && element.tenant_id.toString() === item.id.toString() )? 1 : 0,
            "Third_Party_Delivery": (element.delivered_by == '1' && element.tenant_id.toString() === item.id.toString() )? 1 : 0,
            "Own_Delivery": (element.delivered_by == '2' && element.tenant_id.toString() === item.id.toString() )? 1 : 0,
            "Product_Without_Image":(element.image_set.web_view == ''  && element.tenant_id.toString() === item.id.toString()) ? 1 : 0,
            "Product_With_Image": (element.image_set.web_view != '' && element.tenant_id.toString() === item.id.toString()) ? 1 : 0,
            "Product_With_Image": (element.mark_updown_amount != '' && element.tenant_id.toString() === item.id.toString()) ? 1 : 0
          })
        } else {
          tenantData[tenantIndex] = {
            "id": item.id.toString(),
            "Name":item.name,
            "Account_Id":item.account,
            "Total_Products": element.tenant_id.toString() === item.id.toString() ? tenantData[tenantIndex].Total_Products + 1 : tenantData[tenantIndex].Total_Products,
            "Approved_Products": (element.status == 'approved' && element.tenant_id.toString() === item.id.toString() ) ? tenantData[tenantIndex].Approved_Products + 1 : tenantData[tenantIndex].Approved_Products,
            "Pending_Products": (element.status == 'pending' && element.tenant_id.toString() === item.id.toString() ) ? tenantData[tenantIndex].Pending_Products + 1 : tenantData[tenantIndex].Pending_Products,
            "Rejected_Products": (element.status == 'rejected' && element.tenant_id.toString() === item.id.toString() ) ? tenantData[tenantIndex].Rejected_Products + 1 : tenantData[tenantIndex].Rejected_Products,
            "Third_Party_Delivery": (element.delivered_by == '1' && element.tenant_id.toString() === item.id.toString() )? tenantData[tenantIndex].Third_Party_Delivery + 1 : tenantData[tenantIndex].Third_Party_Delivery,
            "Own_Delivery": (element.delivered_by == '2' && element.tenant_id.toString() === item.id.toString() )? tenantData[tenantIndex].Own_Delivery + 1 : tenantData[tenantIndex].Own_Delivery,
            "Product_Without_Image": (element.image_set.web_view == ''&& element.tenant_id.toString() === item.id.toString()) ? tenantData[tenantIndex].Product_Without_Image + 1 : tenantData[tenantIndex].Product_Without_Image,
            "Product_With_Image": (element.image_set.web_view != '' && element.tenant_id.toString() === item.id.toString()) ? tenantData[tenantIndex].Product_With_Image + 1 : tenantData[tenantIndex].Product_With_Image
          }
        }

      })
    });
    totalProductcount = dataList.length
    res.send({
      tenantData
    })
  }
});


router.post('/inserttenant', async function (req, res, next) {
  // console.log(req.body);
  let id = req.body.id;
  let type = req.body.type;
  let account = parseInt(req.body.account);
  let active = req.body.active;
  let address1 = req.body.address1;
  let address2 = req.body.address2;
  let brand = req.body.brand;
  let brand_id = req.body.brand_id;
  let brand_url = req.body.brand_url;
  let category = req.body.category;
  let city = req.body.city;
  let country = req.body.country;
  let created_at = req.body.created_at;
  let created_by = req.body.created_by;
  let document_url = req.body.document_url;
  let email = req.body.email;
  let fssai = req.body.fssai;
  let mobile = req.body.mobile;
  let name = req.body.name;
  let postalcode = req.body.postalcode;
  let referal = req.body.referal;
  let state = req.body.state;
  let status = req.body.status;
  let taxid = req.body.taxid;
  let verified_by = req.body.verified_by;
  let verified_date = req.body.verified_date;
  
  // let sqlQueryStr = "INSERT INTO supplybuy.Tenant (id,type,account,active,address1,address2,brand,brand_id,brand_url,category,city,country,created_at,created_by,email,fssai,mobile,name,postalcode,referal,state,status,taxid,verified_by,verified_date) VALUES (" + id + ", " + type + ", " + account + "," + active + ",'" + address1 + "'," + address2 + "," + brand + "," + brand_id + ",'" + brand_url + "'," + category + ",'" + city + "','" + country + "','" + created_at + "','" + created_by + "','" + email + "','" + fssai + "','" + mobile + "','" + name + "','" + postalcode + "','" + referal + "','" + state + "','" + status + "','" + taxid + "','" + verified_by + "'," + verified_date + ");"
  // console.log(sqlQueryStr);
  // let sqlQueryStr = "INSERT INTO supplybuy.Tenant (id,type,account,active,address1,address2,brand,brand_id,brand_url,category,city,country,created_at,created_by,document_url,email,fssai,mobile,name,postalcode,referal,state,status,taxid,verified_by,verified_date) VALUES (00a6fa25-df29-4701-6067-557932591770,'node',3456.6,true,'west street','east street','Supplybuy',{7d1b7cc2-9f55-449c-bdbe-14a998004b44},'https://www.w3schools.com/nodejs/nodejs_mysql.asp',{'Grocery & Condiments'},'Kumbakonam','India','2022-11-28 11:43:51.115',00a6fa25-df29-4701-6067-557932591768,{'Image':'https://cassandra.apache.org/doc/latest/cassandra/cql/types.html'},'allpos@allpos.software',0.0,'9876543210','allpos','612602','any','dert','erte','22AAAAA0000A1ZZ',00a6fa25-df29-4701-6067-557932591768,'2022-11-28 11:43:51.115');"
  // client.execute("INSERT INTO people.subscribers (id, name, address, email, phone) VALUES (now(), '" + input.name + "', '" + input.address + "', '" + input.email + "', '" + input.phone + "')",[], function(err, result){

  let sqlQueryStr = "INSERT INTO supplybuy.tenant "
    + "(id,type,account,active,address1,address2,"
    + "brand,brand_id,brand_url,category,city,country,created_at,created_by,email,"
    + "fssai,mobile,name,postalcode,referal,state,status,"
    + "taxid,verified_by,verified_date)"
    // + "VALUES(uuid(),'node',4.5555,true,'chennai','chennai','central chennai','india','smy123@gamil.com','23456745','sesff','2343443','234we234')";
    + "VALUES(" + id + "," + type + "," + account + "," + active + "," + address1 + "," + address2 + ","
    + " " + brand + "," + brand_id + "," + brand_url + "," + category + "," + city + "," + country + ","
    + " " + created_at + "," + created_by + "," + email + ","
    + " " + fssai + "," + mobile + "," + name + "," + postalcode + "," + referal + "," + state + ","
    + " " + status + "," + taxid + "," + verified_by + "," + verified_date + ");";


  console.log("results=", sqlQueryStr);
  let results = await client.execute(sqlQueryStr);
  if (!results) {
    res.send(
      {
        status: 404,
        success: true,
        data: "Affected rows :" + JSON.stringify(results),
        message: "Insert Failed"
      })
  }
  else {

    res.send(
      {
        status: 200,
        success: true,
        message: "Inserted Sucessfully"
      }
    );
  }

});

module.exports = router;