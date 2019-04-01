var express = require("express");
const fetch = require("node-fetch");

var app = express();
app.use(express.json());
var fs = require("fs");

app.get("/", function(req, res) {
  //  fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
  console.log("hiiiiiiiiiiiiii");
  return res.json(["shivam"]);
});
app.post("/getComData", function(req, res) {
  console.log(req.body);
  var body =
    '{"_source":["order_id","email","customer_full_name","taxful_total_price","total_quantity","customer_gender","customer_id","order_date","category","currency"]}';
  t = fetch(
    "https://my-eastic-9635104622.ap-southeast-2.bonsaisearch.net/kibana_sample_data_ecommerce/_search?size=50",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          new Buffer("fzlrciwfl5" + ":" + "h6u44fqxzm").toString("base64")
      },
      method: "POST",
      body: body
    }
  )
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      var temp = [];
      myJson.hits.hits.forEach(element => temp.push(element._source));
      return temp;
    })
    .then(data => {
      return res.json({ data: data, columns: Object.keys(data[0]) });
    });
});

var server = app.listen(8081, function() {
  var host = "127.0.0.1";
  var port = 8081;
  console.log("Example app listening at http://%s:%s", host, port);
});
