var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 5000));

// Server index page
app.get("/", function (req, res) {
  res.send("Deployed!");
});

// Facebook Webhook
// Used for verification
app.get("/webhook", function (req, res) {
  if (req.query["hub.verify_token"] === process.env.VERIFICATION_TOKEN) {
    console.log("Verified webhook");
    res.send(req.query["hub.challenge"]);
  } else {
    console.error("Verification failed. The tokens do not match.");
    res.send("Error, wrong token");
  }
});

// All callbacks for Messenger will be POST-ed here
app.post("/webhook", function (req, res) {
  // Make sure this is a page subscription
  if (req.body.object == "page") {
    // Iterate over each entry
    // There may be multiple entries if batched
    req.body.entry.forEach(function(entry) {
      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.postback) {
          processPostback(event);
        }else if (event.message) {
          processMessage(event);
        }
      });
    });

    res.sendStatus(200);
  }
});

function processPostback(event) {
  var senderId = event.sender.id;
  var payload = event.postback.payload;

  if (payload === "Greeting") {
    // Get user's first name from the User Profile API
    // and include it in the greeting
    request({
      url: "https://graph.facebook.com/v2.6/" + senderId,
      qs: {
        access_token: process.env.PAGE_ACCESS_TOKEN,
        fields: "first_name"
      },
      method: "GET"
    }, function(error, response, body) {
      var greeting = "";
      if (error) {
        console.log("Error getting user's name: " +  error);
      } else {
        var bodyObj = JSON.parse(body);
        name = bodyObj.first_name;
        greeting = "Hi " + name + ". ";
      }
      var message = greeting + "I am a Chat Bot. I am still under developement!";
      sendMessage(senderId, {text: message});
    });
  }
}

function processMessage(event) {
  if (!event.message.is_echo) {
      var message = event.message;
      var senderId = event.sender.id;

      console.log("Received message from senderId: " + senderId);
      console.log("Message is: " + JSON.stringify(message));

      // You may get a text or attachment but not both
      if (message.text) {
          var formattedMsg = message.text.toLowerCase().trim();

          // If we receive a text message, check to see if it matches any special
          // keywords and send back the corresponding movie detail.
          // Otherwise search for new movie.

          sendMessage(senderId, {text: "Responding to text msg"});

          switch (formattedMsg) {
              case "plot":
              case "date":
              case "runtime":
              case "director":
              case "cast":
              case "rating":
                  //getMovieDetail(senderId, formattedMsg);
                  break;
              case "time":
                  break;
              default:
                  //findMovie(senderId, formattedMsg);
          }
      } else if (message.attachments) {
          sendMessage(senderId, {text: "Sorry, I don't understand your request."});
      }
  }
}


// sends message to user
function sendMessage(recipientId, message) {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: "POST",
    json: {
      recipient: {id: recipientId},
      message: message,
    }
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
    }
  });
}
