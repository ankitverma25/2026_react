import Product from "../models/product.model.js";

export const getAllProducts = async (req, res, next) => {
  try {

    // const category = req.query.category;
    // const products = !category
    //   ? await Product.find()
    //   : await Product.find({ category: category });
    // res.status(200).json(products);
    const category = req.query.category;
    const query = !category
      ? Product.find()
      : Product.find({ category: category });
    const isPopulate = req.query.populate;
    const products =
      isPopulate === "true"
        ? await query.populate("createdBy", "-password")
        : await query;
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!productId) {
      const error = new Error("There is no product with this id");
      error.status(400);
      throw error;
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const newProduct = await Product.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

export const updatedProduct = async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
    );
    if (!updatedProduct) {
      const error = new Error("No product was there.");
      error.status = 404;
      throw error;
    }
    res.json({ message: "Product is updated successfully", updatedProduct });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      const error = new Error("No product was there.");
      error.status = 404;
      throw error;
    }
    res.json({ message: "Product is deleted successfully", deletedProduct });
  } catch (error) {
    next(error);
  }
};
