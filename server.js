/*********************************************************************************
 *  WEB322 – Assignment 3
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Nishit Shah Student ID: 130 176 217 Date: 14th Oct 2022
 *
 *  Online (Cyclic) URL: https://real-erin-pike-hem.cyclic.app/
 *
 ********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;

var express = require("express");
var app = express();

const path = require("path");
const blogService = require("./blog-service.js");

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

//Cloudinary configuration
cloudinary.config({
  cloud_name: "dxvlwfmrc",
  api_key: "928595832913832",
  api_secret: "26z1hiYkHgHvKph2y8KSq9xo7aM",
  secure: true,
});

const upload = multer(); // no { storage: storage } since we are not using disk storage

app.use(express.static(path.join(__dirname + "/public")));

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", (req, res) => {
  res.redirect("/about");
});

app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/views/about/about.html");
});

app.get("/blog", (req, res) => {
  blogService
    .getPublishedPosts()
    .then((data) => {
      res.json(data);
    })
    .catch(function (err) {
      console.log("Unable to open the file: " + err);
    });
});

app.get("/posts", (req, res) => {
  if (req.query.category) {
    blogService
      .getPostsByCategory(req.query.category)
      .then((data) => {
        res.json(data);
      })
      .catch(function (err) {
        res.json({ message: err });
      });
  } else if (req.query.minDate) {
    blogService
      .getPostsByMinDate(req.query.minDate)
      .then((data) => {
        res.json(data);
      })
      .catch(function (err) {
        res.json({ message: err });
      });
  } else {
    blogService
      .getAllPosts()
      .then((data) => {
        res.json(data);
      })
      .catch(function (err) {
        console.log("Unable to open the file: " + err);
      });
  }
});

app.get("/post/:id", (req, res) => {
  blogService
    .getPostById(req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch(function (err) {
      res.json({ message: err });
    });
});

app.get("/categories", (req, res) => {
  blogService
    .getCategories()
    .then((data) => {
      res.json(data);
    })
    .catch(function (err) {
      console.log("Unable to open the file: " + err);
    });
});

app.get("/posts/add", (req, res) => {
  res.sendFile(__dirname + "/views/addPost/addPost.html");
});

app.post("/posts/add", upload.single("featureImage"), (req, res) => {
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };
  async function upload(req) {
    let result = await streamUpload(req);
    console.log(result);
    return result;
  }
  upload(req).then((uploaded) => {
    req.body.featureImage = uploaded.url;
    // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
    blogService
      .addPost(req.body)
      .then(() => {
        res.redirect("/posts");
      })
      .catch((data) => {
        res.send(data);
      });
  });
});

app.get("*", (req, res) => {
  res.status(404).sendFile(__dirname + "/views/error/error.html");
});

blogService
  .initialize()
  .then(function () {
    app.listen(HTTP_PORT, onHttpStart);
  })
  .catch(function (err) {
    console.log("Unable to open the file: " + err);
  });
