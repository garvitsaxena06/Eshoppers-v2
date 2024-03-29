import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Ratings from '../ratings/Ratings'

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded'>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} alt={product.name} variant='top' />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as='div'>
          <div className='my-3'>
            <Ratings
              value={product.rating}
              text={`${product.numReviews} reviews`}
            />
          </div>
        </Card.Text>

        <Card.Text as='h6' className='fw-semibold'>
          Rs. {product.price?.toLocaleString('en-IN')}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
