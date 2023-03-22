const express = require("express");
const { findByIdAndDelete } = require("../models/category.model");
const categoryRoute = express.Router();
const CategoryModel = require("../models/category.model");

categoryRoute.get("/rand", (req, res) => {
  // get 3 random category
  CategoryModel.aggregate([{ $sample: { size: 3 } }])
    .then((data) => {
      return res.send(data);
    })
    .catch((err) => {
      res.status(420).send(err);
    });
});

categoryRoute.get("/all", getAllCategories);

categoryRoute.post(
  "/add",
  (req, res, next) => {
    let body = req.body;
    if (!body.categoryName) {
      return res.status(422).send("Error");
    }
    next();
  },
  async (req, res) => {
    try {
      const newCategory = await CategoryModel.create(req.body);
      newCategory.save();
      return res.send("OK");
    } catch (err) {
      res.status(420).send(err);
    }
  }
);

categoryRoute.delete(
  "/:id",
  (req, res, next) => {
    try {
      const { id } = req.params;
      CategoryModel.findByIdAndDelete(id)
        .then(() => {
          next();
        })
        .catch((err) => {
          return res.status(422).send(err);
        });
    } catch (err) {
      res.status(422).send("error");
    }
  },
  getAllCategories
);

categoryRoute.put("/update", (req, res) => {
  const body = req.body;
  const filter = { _id: body._id };
  CategoryModel.updateOne(filter, body, (error, data) => {
    if (error) {
      console.log(error);
      return res.status(434).send("Error on update category");
    }
    res.send("Successfully updated category.");
  });
});

categoryRoute.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    CategoryModel.findOne({ _id: id })
      .then((category) => {
        return res.status(220).send(category);
      })
      .catch((err) => {
        return res.status(422).send(err);
      });
  } catch (err) {
    res.status(422).send("error");
  }
});

function getAllCategories(req, res) {
  CategoryModel.find({})
    .then((data) => {
      return res.send(data);
    })
    .catch((err) => {
      res.status(422).send(err);
    });
}

module.exports = categoryRoute;
