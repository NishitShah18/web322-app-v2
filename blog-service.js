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

const { rejects } = require("assert");
const file = require("fs"); // required at the top of my module
const { resolve } = require("path");

//Module Data
var posts = [];
var categories = [];

//initialize()
//•	This function will read the contents of the "./data/posts.json" and "./data/categories.json" file

initialize = function () {
  return new Promise((resolve, reject) => {
    file.readFile("./data/posts.json", "utf8", (err, data) => {
      if (err) {
        reject("unable to read file");
      } else {
        posts = JSON.parse(data);
      }
    });

    file.readFile("./data/categories.json", "utf8", (err, data) => {
      if (err) {
        reject("unable to read file");
      } else {
        categories = JSON.parse(data);
      }
    });
    resolve();
  });
};

getAllPosts = function () {
  return new Promise((res, rej) => {
    if (posts.length === 0) {
      rej("no results returned");
    } else {
      res(posts);
    }
  });
};

getPublishedPosts = function () {
  return new Promise((res, rej) => {
    var filteredPosts = [];
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].published === true) {
        filteredPosts.push(posts[i]);
      }
    }

    if (filteredPosts.length === 0) {
      rej("no results returned");
    } else {
      res(filteredPosts);
    }
  });
};

getCategories = function () {
  return new Promise((res, rej) => {
    if (categories.length === 0) {
      rej("no results returned");
    } else {
      res(categories);
    }
  });
};

addPost = (postData) => {
  return new Promise(function (res, rej) {
    try {
      postData.published = postData.published ? true : false;
      postData.id = posts.length + 1;
      posts.push(postData);
      res(postData);
    } catch (err) {
      rej();
    }
  });
};

getPostsByCategory = (category) => {
  {
    return new Promise(function (res, rej) {
      var category_sort = [];
      var match = 0;
      for (var i = 0; i < posts.length; i++) {
        if (posts[i].category == category) {
          category_sort[match++] = posts[i];
        }
      }
      if (match == 0) {
        rej("no results returned");
      } else {
        res(category_sort);
      }
    });
  }
};

getPostsByMinDate = (minDateStr) => {
  {
    return new Promise(function (res, rej) {
      var date_sort = [];
      var match = 0;
      for (var i = 0; i < posts.length; i++) {
        if (new Date(posts[i].postDate) >= new Date(minDateStr)) {
          date_sort[match++] = posts[i];
        }
      }
      if (match == 0) {
        rej("no results returned");
      } else {
        res(date_sort);
      }
    });
  }
};

getPostById = (id) => {
  {
    return new Promise((res, rej) => {
      var id_sort = [];
      var match = 0;
      for (var i = 0; i < posts.length; i++) {
        if (posts[i].id == id) {
          id_sort[match++] = posts[i];
        }
      }
      if (match == 0) {
        rej("no results returned");
      } else {
        res(id_sort);
      }
    });
  }
};

module.exports = {
  initialize,
  getAllPosts,
  getPublishedPosts,
  getCategories,
  addPost,
  getPostsByCategory,
  getPostsByMinDate,
  getPostById,
};
