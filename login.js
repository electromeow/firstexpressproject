const express = require("express");
const fs = require("fs");

async function getLogin(req,res){
  fs.readFile("./login.html", "utf-8", (err, data) => {
    if (err) console.error(err);
    else res.send(data.replace("{error}", ""));
  });
}


async function postToLogin(req,res){
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
}


module.exports = {
  "get": getLogin,
  "post": postToLogin
};
