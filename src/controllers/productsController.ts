import { Response } from "express";
import { Product } from "../models/Product";
import { AuthenticatedRequest } from "../@types";
import { upload } from "../server";
import logger from "../services/logger";
import { User } from "../models/User";

export const getAllProducts = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const page = parseInt(req.query.page as string) || 1;
  const itemsPerPage = parseInt(req.query.itemsPerPage as string) || 10;

  const offset = (page - 1) * itemsPerPage;

  try {
    const { count, rows } = await Product.findAndCountAll({
      attributes: ["description", "name", "price", "stock", "image", "id"],
      include: {
        model: User,
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      },
      limit: itemsPerPage,
      offset: offset,
    });

    const totalPages = Math.ceil(count / itemsPerPage);

    res.json({
      products: rows.map((item) => item.toJSON()),
      currentPage: page,
      totalPages: totalPages,
      totalItems: count,
      itemsPerPage: itemsPerPage,
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching products" });
  }
};

export const getProductsById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;

  const item = await Product.findOne({ where: { id: id } });
  if (item) {
    res.json(item.toJSON());
  } else {
    res.status(404).json({ message: "Products not found" });
  }
};

export const getProductsByUser = (req: AuthenticatedRequest, res: Response) => {
  res.status(201).json({ message: "get user products" });
};

export const createProducts = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        res.status(400).json({ message: "Error uploading image" });
      } else if (err) {
        res.status(500).json({ message: "Error uploading image" });
      }
    });

    const { name, description, price, stock } = req.body;
    if (!name || !description || !price) {
      res.status(400).json({ message: "Please fill in all fields" });
    } else {
      const image = req.file ? `/uploads/${req.file.filename}` : undefined;

      const item = await Product.create({
        name,
        description,
        price,
        stock,
        image,
        userId: req.user.id,
      });

      res
        .status(201)
        .json({ message: "successfully created", item: item.toJSON() });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Error creating product", error });
  }
};

export const updateProducts = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;

  const item = await Product.findOne({ where: { id } });

  if (item) {
    // item.
    res.json(item.toJSON());
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

export const deleteProducts = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;

  const item = await Product.findOne({ where: { id } });
  if (item) {
    await item.destroy();
    res.status(204).send();
  } else {
    res.status(404).json({ message: "Products not found" });
  }
};
