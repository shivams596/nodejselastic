var express = require("express");
const fetch = require("node-fetch");
var request = require("request");

var app = express();
app.use(express.json());
// app.use(express.urlencoded());
global.Headers = global.Headers || require("fetch-headers");

var fs = require("fs");

var AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-2" });

var uuid = require("node-uuid");

function createESQuery(data) {
  var payloadStart = `{
     "query" : {
        "constant_score" : { 
           "filter" : {
              "bool" : {
                "must" : [
                  `;
  var payloadEnd = `]
                }
             }
           }
        }
     }`;
  var filters = "";
  for (var key in data.slots) {
    if (data.slots.hasOwnProperty(key)) {
      console.log(key + " -> " + data.slots[key]);
      if (data.slots[key] != null) {
        filters +=
          `{ "term" : {"` +
          key +
          `": "` +
          data.slots[key] +
          `"}},
        `;
      }
    }
  }
  var payload =
    payloadStart + filters.substring(0, filters.length - 1) + payloadEnd;
  console.log(payload);
  return payload;
}

function fetchESData(request_body) {
  console.log("in fetchESData");
  var fff = "dhivsmas";
  var headers = new Headers();
  console.log("Loading data");
  headers.append(
    "Authorization",
    "Basic " + Buffer.from("fzlrciwfl5" + ":" + "h6u44fqxzm").toString("base64")
  );
  var body =
    '{"_source":["order_id","email","customer_full_name","taxful_total_price","total_quantity","customer_gender","customer_id","order_date","category","currency"]}';
  headers.append("Content-Type", "application/json");

  // var myJSONObject = { ... };
  // request(
  //   {
  //     url:
  //       "https://my-eastic-9635104622.ap-southeast-2.bonsaisearch.net/kibana_sample_data_ecommerce/_search?size=50",
  //     headers: headers,
  //     method: "POST",
  //     body: body
  //   },
  //   function(error, response, body) {
  //     console.log(body + "12654");
  //   }
  // );

  return fetch(
    "https://my-eastic-9635104622.ap-southeast-2.bonsaisearch.net/kibana_sample_data_ecommerce/_search?size=1",
    { headers: headers, method: "POST", body: body }
  )
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      // console.log(JSON.stringify(myJson));
      var temp = [];
      myJson.hits.hits.forEach(element => temp.push(element._source));
      // console.log(temp);
      return temp;
      // console.log(JSON.stringify(t));
      // console.log(Object.keys(t));
    })
    .then(data => {
      // console.log(JSON.stringify(data));
      console.log(Object.keys(data[0]));
      console.log("sent data");
      // fff = data;
      return data;
      // state = data;
      // this.setState({ columns: Object.keys(data[0]) });
      // this.setState({ data: data });
    });
  // console.log(state + "bkbcsdcbbjcbsdcjsdbcjsdnj" + d);
  // return state;
}

app.post("/nlu", function(req, res) {
  console.log(req.body);
  let final;
  const question = req.body.question;
  var params = {
    botAlias: "bot" /* required */,
    botName: "lexdemo" /* required */,
    inputText: question /* required */,
    userId: "shivam" //, /* required */
  };
  var lexruntime = new AWS.LexRuntime();
  lexruntime.postText(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      res.status(400).send({
        message: "This is an error!"
      });
    } else {
      console.log(data); // successful response
      console.log(data.intentName);
      if (data.intentName != null) {
        query_string = createESQuery(data);
        // console.log(query_string);
        info = fetchESData(query_string);
        info.then(data => {
          console.log(data);
          final = data;
          return data;
        });
        // console.log(typeof info + "12315");
        // console.log(info);

        // return res.json([info]);
      }
      Promise.all([info]).then(results => {
        console.log(JSON.stringify(results));
        return res.json(final);
      });
      // return res.json(data);
    }
  });

  // request_lex.on("success", function(data) {
  //   console.log(data);
  //   console.log("shivam");
  //   // return res.json(data);
  // });

  // return res.json(req.body);
});

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
