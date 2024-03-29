const Order = require('../models/Order')
const router = require('express').Router()
const Razorpay = require('razorpay')

//get orders of a specific user
router.get('/myorders/:id', async (req, res) => {
  const userId = req.params.id
  try {
    const orders = await Order.find({ user: userId })
    res.status(200).json(orders)
  } catch (err) {
    res.status(500).json(err)
  }
})

//update order to paid
router.put('/pay/:id', async (req, res) => {
  const orderId = req.params.id
  try {
    const order = await Order.findById(orderId)

    const { orderCreationId, status, email } = req.body
    if (order) {
      order.isPaid = true
      order.paidAt = Date.now()
      order.paymentResult = {
        id: orderCreationId,
        status,
        update_time: Date.now(),
        email_address: email,
      }

      const updatedOrder = await order.save()
      res.status(200).json(updatedOrder)
    } else {
      res.status(404).json('Order not found')
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

//get order by id
router.get('/:id', async (req, res) => {
  const orderId = req.params.id
  try {
    const order = await Order.findById(orderId).populate('user', 'name email')
    if (order) {
      res.status(200).json(order)
    } else {
      res.status(404).json('Order not found')
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

//add order items
router.post('/', async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice,
    userId,
  } = req.body
  try {
    if (orderItems && orderItems.length === 0) {
      res.status(400).json('No order items')
    } else {
      const order = new Order({
        orderItems,
        user: userId,
        shippingAddress,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice,
      })

      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
      })

      const options = {
        amount: Number(totalPrice) * 100,
        currency: 'INR',
        receipt: order._id.toString(),
      }

      const razorpayOrder = await instance.orders.create(options)

      await order.save()
      res.status(201).json({ ...razorpayOrder, orderId: order._id })
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

//mark product to delivered
router.put('/delivered/:id', async (req, res) => {
  const orderId = req.params.id
  try {
    const order = await Order.findById(orderId)
    if (order) {
      order.isDelivered = true
      const updatedOrder = await order.save()
      res.status(200).json(updatedOrder)
    } else {
      res.status(404).json('Order not found')
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
