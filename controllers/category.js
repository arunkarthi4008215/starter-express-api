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


router.get('/getCategoryList',async function (req, res, next) {
  let sqlQueryStr = "SELECT *  FROM supplybuy.product_category"
  let rs =await client.execute( sqlQueryStr);
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
          message: "Data Successfully Recieved!"
        }
      );
    }
  });


router.post('/inserttenant', async function (req, res, next){
  let id = req.body.id;
  let type = req.body.type;
  let account = parseInt(req.body.account);
  let active = req.body.active;
  let address1 = req.body.address1;
  let address2 = req.body.address2;
  let brand = req.body.brand;
  let brand_id = req.body.brand_id ;
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

    let sqlQueryStr ="INSERT INTO supplybuy.tenant "
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


  console.log("results=",sqlQueryStr);
  let results =await client.execute( sqlQueryStr);
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

module.exports = router ;