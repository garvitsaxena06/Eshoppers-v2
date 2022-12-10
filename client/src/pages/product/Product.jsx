import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import Ratings from '../../components/ratings/Ratings'
import Skeleton from 'react-loading-skeleton'
import { listProductDetails } from '../../store/actions/productActions'
import Topbar from '../../components/topbar/Topbar'

const Product = ({ history }) => {
  const [qty, setQty] = useState(1)

  const dispatch = useDispatch()
  const params = useParams()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, product } = productDetails

  useEffect(() => {
    dispatch(listProductDetails(params.id))
  }, [dispatch, params.id])

  const addToCartHandler = () => {
    history.push(`/cart/${params.id}?qty=${qty}`)
  }

  return (
    <>
      <Topbar />
      <div className='container'>
        <Link className='btn btn-light my-3' to='/'>
          Go Back
        </Link>
        {loading ? (
          [...Array(2).keys()].map((el, i) => (
            <div key={i} className='mt-3'>
              <div className='d-flex align-items-center pe-3 py-2'>
                <div>
                  <Skeleton circle width={40} height={40} />
                </div>
                <div className='ps-3'>
                  <Skeleton count={2} width={200} />
                </div>
                <div className='w-100 ps-3'>
                  <Skeleton width={100} />
                </div>
              </div>
              <Skeleton count={2} />
              <Skeleton height={180} />
              <div className='d-flex align-items-center pe-3 py-2'>
                <div>
                  <Skeleton circle width={40} height={40} />
                </div>
                <div className='ps-3'>
                  <Skeleton width={200} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>

            <Col md={6}>
              <Row>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <h4 className='fw-bold text-decoration-underline'>
                      {product.name}
                    </h4>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Ratings
                      value={product.rating}
                      text={`${product.numReviews} reviews`}
                    />
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Price: <span className='fw-bold'>Rs. {product.price}</span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Description: {product.description}
                  </ListGroup.Item>
                </ListGroup>
              </Row>
              <Row className='mt-4'>
                <Card>
                  <ListGroup variant='flush'>
                    <ListGroup.Item>
                      <Row>
                        <Col>Price: </Col>
                        <Col className='fw-bold'>Rs. {product.price}</Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>Status: </Col>
                        <Col>
                          {product.countInStock > 0 ? (
                            <span className='text-success fw-bold'>
                              In Stock
                            </span>
                          ) : (
                            <span className='text-danger fw-bold'>
                              Out Of Stock
                            </span>
                          )}
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    {product.countInStock > 0 && (
                      <ListGroup.Item>
                        <Row>
                          <Col>Qty</Col>
                          <Col>
                            <Form.Control
                              as='select'
                              value={qty}
                              onChange={(e) => setQty(e.target.value)}
                            >
                              {[...Array(product.countInStock).keys()].map(
                                (x) => (
                                  <option value={x + 1} key={x + 1}>
                                    {x + 1}
                                  </option>
                                )
                              )}
                            </Form.Control>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    )}

                    <ListGroup.Item>
                      <Button
                        className='btn-block cta-btn my-2'
                        type='button'
                        disabled={product.countInStock === 0}
                        onClick={addToCartHandler}
                      >
                        Add To Cart
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Row>
            </Col>
          </Row>
        )}
      </div>
    </>
  )
}

export default Product
