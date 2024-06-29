import express from "express";
import bodyParser from "body-parser";
import request from "request";
import { fileURLToPath } from "url"; //                These
import { dirname } from "path"; //                       four lines
const __filename = fileURLToPath(import.meta.url); //    for __dirname
const __dirname = dirname(__filename); //                to send file to server
import https from "https";

const app = express();

app.use(bodyParser.urlencoded({ extended: true })); // get the data of form

app.use(express.static("public")); //  our web site not able to use css and image of file becouse they local to our system thus we use this line

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html"); // send a file to the server
});

// app.get("/", function (req, res) {
//   res.send("<h1>Newsletter Signup Page</h1>");
// });

app.post("/", function (req, res) {
  ///  post the action on home root
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  // console.log(firstName);
  // console.log(lastName);
  // console.log(email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us22.api.mailchimp.com/3.0/lists/a9bc6e0d95";
  const option = {
    method: "post",
    auth: "Aditya:782f7296189ff31eff0c9ea6dcd5b4e0-us22",
  };
  const request = https.request(url, option, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else res.sendFile(__dirname + "/failure.html");
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  
  request.write(jsonData);
  
  request.end();
});

app.post("/failure.html", function (req, res) {
  res.redirect("/");
});
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000"); // set up the server
});

