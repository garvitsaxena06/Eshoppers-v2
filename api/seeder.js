const mongoose = require('mongoose')
const dotenv = require('dotenv')
const colors = require('colors')
const Product = require('./models/Product')
const products = require('./data/products')

dotenv.config()

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log(`Connected to MongoDB`.underline.cyan.bold)
  }
)

const importData = async () => {
  try {
    await Product.deleteMany()

    const vendorId = '639232770bcc5e50fc2e6704'

    const sampleProducts = products.map((product) => ({
      ...product,
      user: vendorId,
    }))

    // seed the sample products
    await Product.insertMany(sampleProducts)

    console.log('Data Imported!'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`Error: ${error.message}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    // delete all the products
    await Product.deleteMany()

    console.log('Data Destroyed!'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(`Error: ${error.message}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d' || process.argv[2] === '-D') {
  destroyData()
} else {
  importData()
}
