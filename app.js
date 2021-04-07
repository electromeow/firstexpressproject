const express = require("express");
var app = express();
const port = 80;
const fs = require("fs");

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
          res.send(data
            .replace(
              "{}",
              "<a href=\"/register\"><p>Register</p></a><a href=\"/login\"><p>Login</p></a>"
            )
            .replace("{cookie}", "")
            .replace("{script}", "")
            .replace("{logout}","")
          );
        }
        else {
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
            res.send(data
              .replace("{}", `<p>${cookiejson["email"]}</p>`)
              .replace("{cookie}", "")
              .replace("{script}",`<script type="text/javascript">
                function logout(){
                    document.cookie = "email=; expires=Thu, 1 Jan 1970";
                    document.cookie = "password=; expires=Thu, 1 Jan 1970";
                    location.reload();
                }
                </script>`)
              .replace("{logout}","<button name=\"logout\" id=logout onclick=\"logout()\">Logout</button>")
            );
          }
          else {
            console.log("giriş yapmadı");
            res.send(data
              .replace(
                "{}",
                "<a href=\"/register\"><p>Register</p></a><a href=\"/login\"><p>Login</p></a>"
              )
              .replace("{cookie}", "")
              .replace("{script}","")
              .replace("{logout}","")
            );
          }
        }
      });
    }
  });
});

app.get("/login", (req, res) => {
  fs.readFile("./login.html", "utf-8", (err, data) => {
    if (err) console.error(err);
    else res.send(data.replace("{error}", ""));
  });
});

app.post("/login", (req, res) => {
  fs.readFile("./database.json", "utf-8", (err, data) => {
    if (err) console.error(err);
    else {
      var jsonData = JSON.parse(data);
      console.log(jsonData);

      if (req.body.mail != undefined) {
        if (req.body.password == jsonData[req.body.mail][1]) {
          fs.readFile("./loginsuccess.html", "utf-8", (err, data1) => {
            if (err) console.error(err);
            else
              res.send(
                data1
                  .replace("{}", req.body.mail)
                  .replace("[]", req.body.password)
              );
          });
        } else {
          fs.readFile("./login.html", "utf-8", (err, data1) => {
            res.send(
              data1.replace("{error}", "<p>Wrong password or email.</p>")
            );
          });
        }
      } else {
        fs.readFile("./login.html", "utf-8", (err, data1) => {
          res.send(
            data1.replace(
              "{error}",
              "<p>This mail is unregistered. <a href=\"/register\">Click</a> to register.</p>"
            )
          );
        });
      }
    }
  });
});

app.post("/register", (req,res) => {
  fs.readFile("./database.json", "utf-8", (err,database) => {
    var dbJson = JSON.parse(database);
    if(req.body.name==="" ||
      req.body.mail==="" ||
      req.body.password==="" ||
      req.body.passwordagain===""
    ){
      fs.readFile("./register.html", "utf-8", (err,data) => {
        if(err) console.error(err);
        else res.send(data.replace("{0}", "Please fill in all the blanks.")
          .replace("{1}","")
          .replace("{mail}",req.body?.mail)
          .replace("{name}",req.body?.name)
        );
      });
    }
    else if(dbJson[req.body.mail]!==undefined){
      fs.readFile("./register.html", "utf-8", (err,data) => {
        if(err) console.error(err);
        else res.send(data.replace("{0}", "There is already an account with this mail.")
          .replace("{1}","")
          .replace("{mail}",req.body.mail)
          .replace("{name}",req.body.name)
        );
      });
    }
    else if(req.body.password!==req.body.passwordagain){
      fs.readFile("./register.html", "utf-8", (err,data) => {
        if(err) console.error(err);
        else res.send(data.replace("{0}", "")
          .replace("{1}","Passwords don't match.")
          .replace("{mail}",req.body.mail)
          .replace("{name}",req.body.name)
        );
      });
    }
    else{
      dbJson[req.body.mail] = [req.body.name,req.body.password];
      fs.writeFile("./database.json",JSON.stringify(dbJson), err => console.error(err));
      fs.readFile("./loginsuccess.html", "utf-8", (err, loginsuccess) => {
        if(err) console.error(err);
        else res.send(loginsuccess.replace("{}",req.body.mail).replace("[]", req.body.password));
      });
    }
  });
});


app.get("/register", (req, res) => {
  console.log("/register get request");
  fs.readFile("./register.html", "utf-8", (err, data) => {
    if (err) console.error(err);
    else {
      res.send(
        data
          .replace("{0}", "")
          .replace("{1}", "")
          .replace("{mail}", "")
          .replace("{name}", "")
      );
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
