import React, { useEffect } from 'react'
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Container,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import CheckoutSteps from '../../components/checkoutSteps/CheckoutSteps'
import { createOrder, payOrderAction } from '../../store/actions/orderActions'
import { useHistory } from 'react-router-dom'
import Topbar from '../../components/topbar/Topbar'
import { message } from 'antd'
import logo from '../../assets/logo.png'

const PlaceOrder = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const {
    cart,
    user: { user },
  } = useSelector((state) => state)
  const { cartItems, shippingAddress, paymentMethod } = cart

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }
  const itemsPrice = addDecimals(
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  )
  const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 100)
  const taxPrice = addDecimals(Number((0.1 * itemsPrice).toFixed(2)))
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2)

  const orderCreate = useSelector((state) => state.orderCreate)
  const { success: paySuccess, order: payOrder } = useSelector(
    (state) => state.orderPay
  )
  const { order, success } = orderCreate

  useEffect(() => {
    if (paySuccess && payOrder._id) {
      message.success('Order placed successfully!')
      history.push(`/`)
    }
  }, [paySuccess, payOrder, history])

  useEffect(() => {
    if (success && order && order.id) {
      new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => {
          resolve(true)
        }
        script.onerror = () => {
          resolve(false)
        }
        document.body.appendChild(script)
      }).then((res) => {
        const { amount, id: order_id, currency, orderId } = order

        const options = {
          key: 'rzp_test_hGL6N8M5oGjVNF', // Enter the Key ID generated from the Dashboard
          amount: amount.toString(),
          currency: currency,
          name: 'EShoppers',
          description:
            'The next generation of e-commerce platform that you can trust',
          image: { logo },
          order_id: order_id,
          handler: async function (response) {
            dispatch(
              payOrderAction(orderId, {
                orderCreationId: order_id,
                status: 'success',
                email: user.email,
              })
            )
          },
          prefill: {
            name: user.username,
            email: user.email,
            contact: '',
          },
          notes: {
            address: `${shippingAddress.address}, ${shippingAddress.city} ${shippingAddress.postalCode}, ${shippingAddress.country}`,
          },
          theme: {
            color: '#0a053a',
          },
        }

        const paymentObject = new window.Razorpay(options)
        paymentObject.open()
      })
    }
  }, [order, shippingAddress, user, success, history, dispatch])

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        shippingPrice,
        taxPrice,
        totalPrice,
        userId: user._id,
      })
    )
  }

  return (
    <>
      <Topbar />
      <Container className='my-4 min-vh-100'>
        <CheckoutSteps step3 />
        <Row className='h-100 min-vh-100'>
          <Col md={8} className='border-end'>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h4 className='fw-bold text-decoration-underline'>Shipping</h4>

                <p>
                  <strong>Address: </strong>
                  {shippingAddress.address}, {shippingAddress.city}{' '}
                  {shippingAddress.postalCode}, {shippingAddress.country}
                </p>
              </ListGroup.Item>

              <ListGroup.Item className='py-4'>
                <h4 className='fw-bold text-decoration-underline'>
                  Payment Method
                </h4>

                <strong>Method: </strong>
                {paymentMethod}
              </ListGroup.Item>

              <ListGroup.Item className='py-4'>
                <h4 className='fw-bold text-decoration-underline'>
                  Order Items
                </h4>
                {cartItems.length === 0 ? (
                  <h6 className='fw-bold mt-4'>
                    <span className='me-2'>Your cart is empty</span>
                    <Link to='/'>
                      <Button className='cta-btn-small'>Go Back</Button>
                    </Link>
                  </h6>
                ) : (
                  <ListGroup className='mt-4' variant='flush'>
                    {cartItems.map((item, index) => (
                      <ListGroup.Item className='py-3' key={index}>
                        <Row className='bg-light border py-3 px-4 align-items-center justify-content-between'>
                          <Col md={1}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Col>
                          <Col>
                            <Link
                              to={`/product/${item.product}`}
                              className='fs-6 fw-bold'
                            >
                              {item.name}
                            </Link>
                          </Col>
                          <Col md={4}>
                            <span
                              className='fw-semibold'
                              style={{ fontSize: 12 }}
                            >
                              <u>Price:</u> Rs.{' '}
                              {item.price?.toLocaleString('en-IN')} x {item.qty}{' '}
                              = <br />
                              <span
                                className='fw-bold text-decoration-underline'
                                style={{ fontSize: 14 }}
                              >
                                Rs.{' '}
                                {Number(
                                  (item.qty * item.price).toFixed(2)
                                )?.toLocaleString('en-IN')}
                              </span>
                            </span>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={4}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h5 className='fw-bold text-decoration-underline'>
                    Order Summary
                  </h5>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>
                      <span className='fw-bold'>
                        Rs. {Number(itemsPrice)?.toLocaleString('en-IN')}
                      </span>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>
                      <span className='fw-bold'>
                        Rs. {Number(shippingPrice)?.toLocaleString('en-IN')}
                      </span>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>
                      <span className='fw-bold'>
                        Rs. {Number(taxPrice)?.toLocaleString('en-IN')}
                      </span>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total</Col>
                    <Col>
                      <span className='fw-bold'>
                        Rs. {Number(totalPrice)?.toLocaleString('en-IN')}
                      </span>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    type='button'
                    className='btn-block cta-btn my-2'
                    disabled={cartItems.length === 0}
                    onClick={placeOrderHandler}
                  >
                    Place Order
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default PlaceOrder
