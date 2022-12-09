const Product = require('../models/Product')
const router = require('express').Router()

//get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({})
    res.status(200).json(products)
  } catch (err) {
    res.status(500).json(err)
  }
})

//get product
router.get('/:id', async (req, res) => {
  const productId = req.params.id
  try {
    const product = await Product.findById(productId)
    if (product) {
      res.status(200).json(product)
    } else {
      res.status(404).json('Product not found!')
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

//update a product
router.put('/:id', async (req, res) => {
  const productId = req.params.id
  try {
    const product = await Product.findById(productId)
    const { name, description, countInStock, price, image } = req.body
    if (product) {
      product.name = name
      product.description = description
      product.countInStock = countInStock
      product.price = price
      product.image = image

      const updatedProduct = await product.save()
      res.status(200).json(updatedProduct)
    } else {
      res.status(404).json('Product not found!')
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

//create new product
router.post('/', async (req, res) => {
  const {
    name,
    image,
    images,
    description,
    brand,
    category,
    price,
    countInStock,
    rating,
    numReviews,
    vendorId,
  } = req.body
  try {
    const product = new Product({
      name,
      image,
      images,
      description,
      brand,
      category,
      price,
      countInStock,
      rating,
      numReviews,
      user: vendorId,
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
