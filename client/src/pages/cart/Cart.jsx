import React, { useEffect } from 'react'
import { Link, useLocation, useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { BsFillTrashFill } from 'react-icons/bs'
import { Row, Col, ListGroup, Form, Button, Image, Card } from 'react-bootstrap'
import { addToCart, removeCartHandler } from '../../store/actions/cartActions'
import Topbar from '../../components/topbar/Topbar'

const Cart = () => {
  const params = useParams()
  const location = useLocation()
  const history = useHistory()

  const prodId = params.id
  const qty = location.search ? Number(location.search.split('=')[1]) : 1

  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  useEffect(() => {
    dispatch(addToCart(prodId, qty))
  }, [dispatch, prodId, qty])

  const removeFromCartHandler = (id) => {
    dispatch(removeCartHandler(id))
  }

  const checkOutHandler = () => {
    history.push('/shipping')
  }
  return (
    <>
      <Topbar />
      <div className='container my-4 min-vh-100'>
        <Row className='h-100 min-vh-100'>
          <Col md={8} className='border-end'>
            <h4 className='fw-bold text-decoration-underline'>Shopping Cart</h4>
            {cartItems.length === 0 ? (
              <h6 className='fw-bold mt-4'>
                <span className='me-2'>Your cart is empty </span>
                <Link to='/'>
                  <Button className='cta-btn-small'>Go Back</Button>
                </Link>
              </h6>
            ) : (
              <ListGroup className='mt-4' variant='flush'>
                {cartItems.map((item, index) => (
                  <ListGroup.Item className='py-3' key={index}>
                    <Row className='bg-light border py-3 px-4 align-items-center justify-content-between'>
                      <Col md={2}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col md={6}>
                        <Link
                          to={`/product/${item.product}`}
                          className='fs-6 fw-bold'
                        >
                          {item.name}
                        </Link>{' '}
                        <br />
                        <span className='fw-semibold'>
                          <u>Price:</u> Rs.{' '}
                          {item.price?.toLocaleString('en-IN')} x {item.qty}
                        </span>
                      </Col>
                      <Col md={2}>
                        <Form.Control
                          as='select'
                          value={item.qty}
                          onChange={(e) =>
                            dispatch(
                              addToCart(item.product, Number(e.target.value))
                            )
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option value={x + 1} key={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                      <Col md={1}>
                        <Button
                          type='button'
                          className='cta-btn'
                          variant='light'
                          onClick={() => removeFromCartHandler(item.product)}
                        >
                          <BsFillTrashFill />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>
          <Col md={4} className='mt-3'>
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h5 className='fw-bold text-decoration-underline'>
                    Subtotal (
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
                  </h5>
                  <span className='fw-bold'>
                    Rs.{' '}
                    {Number(
                      cartItems
                        .reduce((acc, item) => acc + item.price * item.qty, 0)
                        .toFixed(2)
                    )?.toLocaleString('en-IN')}
                  </span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    type='button'
                    className='btn-block cta-btn my-2'
                    disabled={cartItems.length === 0}
                    onClick={checkOutHandler}
                  >
                    Proceed To Checkout
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Cart
