import Article from "../models/Article.js";
import User from "../models/User.js";

export const createArticle = async (req, res) => {
  const { title, description, published_id, image } = req.body;

  const imagePath = req.file ? req.file.filename : null;

  try {
    const user = await User.findByPk(published_id);
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    const article = await Article.create({
      title,
      description,
      published_id,
      image: imagePath,
    });

    res.status(201).json({
      status: "success",
      data: article,
      message: "Article created successfully",
    });
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      include: [
        {
          model: User,
          as: "published",
          attributes: ["id", "fullname"],
          required: true,
        },
      ],
    });

    res.status(200).json({
      status: "success",
      data: articles,
      message: "Articles fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const getArticleById = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await Article.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "published",
          attributes: ["id", "fullname"],
          required: true,
        },
      ],
    });

    if (!article) {
      return res.status(404).json({
        status: "error",
        message: "Article not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: article,
      message: "Article fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const updateArticleById = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  console.log(updates);

  try {
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({
        status: "error",
        message: "Article not found",
      });
    }

    const allowedFields = ["title", "description", "published_id", "image"];

    Object.entries(updates).forEach(([key, value]) => {
      if (
        allowedFields.includes(key) &&
        value !== undefined &&
        value !== null
      ) {
        article[key] = value;
      }
    });

    if (req.file) {
      article.image = req.file.filename;
    }

    await article.save();

    res.status(200).json({
      status: "success",
      data: article,
      message: "Article updated successfully",
    });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
