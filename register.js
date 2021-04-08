const fs = require("fs");
const express = require("express");

async function postToRegister(req,res){
  fs.readFile("./database.json", "utf-8", (err, database) => {
    var dbJson = JSON.parse(database);
    if (
      req.body.name === "" ||
          req.body.mail === "" ||
          req.body.password === "" ||
          req.body.passwordagain === ""
    ) {
      fs.readFile("./html/register.html", "utf-8", (err, data) => {
        if (err) console.error(err);
        else
          res.send(
            data
              .replace("{0}", "Please fill in all the blanks.")
              .replace("{1}", "")
              .replace("{mail}", req.body?.mail)
              .replace("{name}", req.body?.name)
          );
      });
    } else if (dbJson[req.body.mail] !== undefined) {
      fs.readFile("./html/register.html", "utf-8", (err, data) => {
        if (err) console.error(err);
        else
          res.send(
            data
              .replace("{0}", "There is already an account with this mail.")
              .replace("{1}", "")
              .replace("{mail}", req.body.mail)
              .replace("{name}", req.body.name)
          );
      });
    } else if (req.body.password !== req.body.passwordagain) {
      fs.readFile("./html/register.html", "utf-8", (err, data) => {
        if (err) console.error(err);
        else
          res.send(
            data
              .replace("{0}", "")
              .replace("{1}", "Passwords don't match.")
              .replace("{mail}", req.body.mail)
              .replace("{name}", req.body.name)
          );
      });
    } else {
      dbJson[req.body.mail] = [req.body.name, req.body.password];
      fs.writeFile("./database.json", JSON.stringify(dbJson), (err) =>
        console.error(err)
      );
      fs.readFile("./html/loginsuccess.html", "utf-8", (err, loginsuccess) => {
        if (err) console.error(err);
        else
          res.send(
            loginsuccess
              .replace("{}", req.body.mail)
              .replace("[]", req.body.password)
          );
      });
    }
  });
}


async function getRegister(req,res){
  console.log("/register get request");
  fs.readFile("./html/register.html", "utf-8", (err, data) => {
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
}


module.exports = {
  "get":getRegister,
  "post":postToRegister
};