import React, { useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import FormContainer from '../../components/formContainer/FormContainer'
import { savePaymentMethod } from '../../store/actions/cartActions'
import CheckoutSteps from '../../components/checkoutSteps/CheckoutSteps'
import { useHistory } from 'react-router-dom'

const Payment = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  if (!shippingAddress) {
    history.push('/shipping')
  }

  const [paymentMethod, setPaymentMethod] = useState('Razorpay')

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    history.push('/placeorder')
  }

  return (
    <FormContainer>
      <CheckoutSteps step2 />
      <h4 className='fw-bold text-decoration-underline'>Payment Method</h4>

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label
            as='legend'
            className='fw-semibold mb-3'
            style={{ fontSize: 13 }}
          >
            Select Method
          </Form.Label>
          <Col className='mt-5 ms-3'>
            <Form.Check
              type='radio'
              label='Razorpay'
              className='loginInput'
              id='Razorpay'
              defaultChecked
              name='paymentMethod'
              value='Razorpay'
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-3 cta-btn'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default Payment
