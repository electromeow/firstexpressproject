const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require("constants");
const express = require("express");
var app = express();
const port = 80;
const fs = require("fs");
const login = require("./login");
const register = require("./register");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  fs.readFile("./index.html", "utf-8", (err, data) => {
    if (err) console.error(err);
    else {
      fs.readFile("./database.json", "utf-8", (err, data1) => {
        if (err) console.error(err);
        var database = JSON.parse(data1);
        if (req.headers.cookie == undefined) {
          res.send(
            data
              .replace(
                "{}",
                "<a href=\"/register\"><p>Register</p></a><a href=\"/login\"><p>Login</p></a>"
              )
              .replace("{cookie}", "")
              .replace("{script}", "")
              .replace("{logout}", "")
          );
        } else {
          var cookies = String(req.headers.cookie)
            .split(";")
            .map((x) => x.split("="));
          var cookiejson = {};
          cookies.forEach((x) => {
            cookiejson[x[0]] = x[1];
          });
          console.log(database);
          console.log(cookiejson);
          console.log(database[cookiejson?.email][1]);

          if (cookiejson[" password"] == database[cookiejson?.email][1]) {
            console.log("giriş yapıldı");
            res.send(
              data
                .replace("{}", `<p>${cookiejson["email"]}</p>`)
                .replace("{cookie}", "")
                .replace(
                  "{script}",
                  `<script type="text/javascript">
                function logout(){
                    document.cookie = "email=; expires=Thu, 1 Jan 1970";
                    document.cookie = "password=; expires=Thu, 1 Jan 1970";
                    location.reload();
                }
                </script>`
                )
                .replace(
                  "{logout}",
                  "<button name=\"logout\" id=logout onclick=\"logout()\">Logout</button>"
                )
            );
          } else {
            console.log("giriş yapmadı");
            res.send(
              data
                .replace(
                  "{}",
                  "<a href=\"/register\"><p>Register</p></a><a href=\"/login\"><p>Login</p></a>"
                )
                .replace("{cookie}", "")
                .replace("{script}", "")
                .replace("{logout}", "")
            );
          }
        }
      });
    }
  });
});

app.get("/login", (req, res) => {
  (async (req,res) => {
    await login.get(req,res);
  });
});

app.post("/login", (req, res) => {
  (async (req,res) => {
    await login.post(req,res);
  });
});

app.post("/register", (req, res) => {
  (async (req,res) => {
    await register.post(req,res);
  });
  
});

app.get("/register", (req, res) => {
  (async (req,res) => {
    register.get(req,res);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
