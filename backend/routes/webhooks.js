const express = require("express")

const router = express.Router()

// @route   POST /api/webhooks/payment
// @desc    Handle payment webhooks
// @access  Public (but verified)
router.post("/payment", async (req, res, next) => {
  try {
    // Payment webhook handling will be implemented when integrating with payment gateway
    res.json({
      success: true,
      message: "Webhook received",
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
