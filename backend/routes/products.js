// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { v4: uuidv4, validate: uuidValidate } = require('uuid'); // Add uuid for validation

// GET /api/products - ดึงข้อมูลสินค้าทั้งหมดพร้อมการกรองและเรียงลำดับ
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = "",
      search = '',
      category = '',
      sortBy = 'popular',
      minPrice,
      maxPrice,
      inStock
    } = req.query;

    // สร้าง query object
    const query = {};

    // กรองตามคำค้นหา
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // กรองตามหมวดหมู่
    if (category && category !== 'ทั้งหมด') {
      query.category = category;
    }

    // กรองตามราคา
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // กรองตามสถานะสินค้า
    if (inStock !== undefined) {
      query.inStock = inStock === 'true';
    }

    // กำหนดการเรียงลำดับ
    let sort = {};
    switch (sortBy) {
      case 'price-low':
        sort = { price: 1 };
        break;
      case 'price-high':
        sort = { price: -1 };
        break;
      case 'rating':
        sort = { rating: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'popular':
      default:
        sort = { reviews: -1 };
        break;
    }

    // คำนวณ pagination
    const skip = (Number(page) - 1) * Number(limit);
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / Number(limit));

    // ดึงข้อมูลสินค้า
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalProducts,
          hasNextPage: Number(page) < totalPages,
          hasPrevPage: Number(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า'
    });
  }
});

// GET /api/products/categories - ดึงหมวดหมู่สินค้าทั้งหมด
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({
      success: true,
      data: ['ทั้งหมด', ...categories]
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่'
    });
  }
});

// GET /api/products/:id - ดึงข้อมูลสินค้าตาม ID
router.get('/:id', async (req, res) => {
  try {
    // Validate UUID
    if (!uuidValidate(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'รหัสสินค้าไม่ถูกต้อง'
      });
    }

    const product = await Product.findOne({ _id: req.params.id });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบสินค้าที่ต้องการ'
      });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า'
    });
  }
});

// POST /api/products - เพิ่มสินค้าใหม่
router.post('/', async (req, res) => {
  try {
    // Generate UUID if _id is not provided
    if (!req.body._id) {
      req.body._id = uuidv4();
    } else if (!uuidValidate(req.body._id)) {
      return res.status(400).json({
        success: false,
        message: 'รหัสสินค้าไม่ถูกต้อง'
      });
    }

    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      success: true,
      data: product,
      message: 'เพิ่มสินค้าสำเร็จ'
    });

  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเพิ่มสินค้า',
      error: error.message
    });
  }
});

// PUT /api/products/:id - อัปเดตสินค้า
router.put('/:id', async (req, res) => {
  try {
    // Validate UUID
    if (!uuidValidate(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'รหัสสินค้าไม่ถูกต้อง'
      });
    }

    // Prevent changing _id
    if (req.body._id && req.body._id !== req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'ไม่สามารถเปลี่ยนรหัสสินค้าได้'
      });
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบสินค้าที่ต้องการอัปเดต'
      });
    }

    res.json({
      success: true,
      data: product,
      message: 'อัปเดตสินค้าสสำเร็จ'
    });

  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปเดตสินค้า',
      error: error.message
    });
  }
});

// DELETE /api/products/:id - ลบสินค้า
router.delete('/:id', async (req, res) => {
  try {
    // Validate UUID
    if (!uuidValidate(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'รหัสสินค้าไม่ถูกต้อง'
      });
    }

    const product = await Product.findOneAndDelete({ _id: req.params.id });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบสินค้าที่ต้องการลบ'
      });
    }

    res.json({
      success: true,
      message: 'ลบสินค้าสำเร็จ'
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบสินค้า'
    });
  }
});

module.exports = router;