const { body, param, query, validationResult } = require("express-validator")
const { ValidationError } = require("../utils/errors")

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
      value: error.value,
    }))
    return next(new ValidationError("Validation failed", errorMessages))
  }
  next()
}

// User validation rules
const userValidation = {
  register: [
    body("username")
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be between 3 and 30 characters")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage("Username can only contain letters, numbers, and underscores")
      .toLowerCase(),
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage("Password must contain at least one lowercase letter, one uppercase letter, and one number"),
    body("firstName")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("First name must be between 2 and 50 characters"),
    body("lastName").trim().isLength({ min: 2, max: 50 }).withMessage("Last name must be between 2 and 50 characters"),
    body("phone").optional().isMobilePhone("th-TH").withMessage("Please provide a valid Thai phone number"),
    handleValidationErrors,
  ],

  login: [
    body("username").trim().isLength({ min: 3 }).withMessage("Username is required").toLowerCase(),
    body("password").notEmpty().withMessage("Password is required"),
    handleValidationErrors,
  ],

  updateProfile: [
    body("firstName")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("First name must be between 2 and 50 characters"),
    body("lastName")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Last name must be between 2 and 50 characters"),
    body("phone").optional().isMobilePhone("th-TH").withMessage("Please provide a valid Thai phone number"),
    body("dateOfBirth").optional().isISO8601().withMessage("Please provide a valid date"),
    handleValidationErrors,
  ],

  // เพิ่ม validation สำหรับการเช็ค username availability
  checkUsername: [
    body("username")
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be between 3 and 30 characters")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage("Username can only contain letters, numbers, and underscores")
      .toLowerCase(),
    handleValidationErrors,
  ],
}

// Product validation rules
const productValidation = {
  create: [
    body("name").trim().isLength({ min: 3, max: 200 }).withMessage("Product name must be between 3 and 200 characters"),
    body("description").trim().isLength({ min: 10 }).withMessage("Description must be at least 10 characters long"),
    body("pricing.regularPrice").isFloat({ min: 0 }).withMessage("Regular price must be a positive number"),
    body("pricing.salePrice").optional().isFloat({ min: 0 }).withMessage("Sale price must be a positive number"),
    body("categoryId").isMongoId().withMessage("Please provide a valid category ID"),
    handleValidationErrors,
  ],

  update: [
    param("id").isMongoId().withMessage("Please provide a valid product ID"),
    body("name")
      .optional()
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage("Product name must be between 3 and 200 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters long"),
    body("pricing.regularPrice").optional().isFloat({ min: 0 }).withMessage("Regular price must be a positive number"),
    handleValidationErrors,
  ],
}

// Order validation rules
const orderValidation = {
  create: [
    body("items").isArray({ min: 1 }).withMessage("Order must contain at least one item"),
    body("items.*.type").isIn(["product", "service"]).withMessage("Item type must be either product or service"),
    body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be a positive integer"),
    body("addresses.shipping").notEmpty().withMessage("Shipping address is required"),
    body("addresses.shipping.firstName").trim().isLength({ min: 2 }).withMessage("First name is required"),
    body("addresses.shipping.lastName").trim().isLength({ min: 2 }).withMessage("Last name is required"),
    body("addresses.shipping.phone").isMobilePhone("th-TH").withMessage("Please provide a valid phone number"),
    body("addresses.shipping.addressLine1").trim().isLength({ min: 5 }).withMessage("Address line 1 is required"),
    handleValidationErrors,
  ],
}

// Query validation rules
const queryValidation = {
  pagination: [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
    handleValidationErrors,
  ],

  search: [
    query("q").optional().trim().isLength({ min: 2 }).withMessage("Search query must be at least 2 characters long"),
    handleValidationErrors,
  ],
}

module.exports = {
  userValidation,
  productValidation,
  orderValidation,
  queryValidation,
  handleValidationErrors,
}
