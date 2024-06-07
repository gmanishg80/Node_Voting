const voter = require("../models/voter.model");
const express = require("express");
const { validateVoter } = require("../validations/validVoter");
const { validationResult } = require("express-validator");

exports.signup = [validateVoter,async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {  
        return res.status(400).json({ errors: errors.array() });
      }

      const { categoryName, description } = req.body;
      const newCategory = await Category.create({ categoryName, description });
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
];
