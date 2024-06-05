const voter = require("../models/voter.model");

exports.signup = async (req, res) => {
    try {
        const { categoryName, description } = req.body;
        const newCategory = await Category.create({ categoryName, description });
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
