import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import FormContainer from '../../components/formContainer/FormContainer'
import { saveShippingAddress } from '../../store/actions/cartActions'
import CheckoutSteps from '../../components/checkoutSteps/CheckoutSteps'
import { useHistory } from 'react-router-dom'

const Shipping = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  const [address, setAddress] = useState(shippingAddress.address)
  const [city, setCity] = useState(shippingAddress.city)
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
  const [country, setCountry] = useState(shippingAddress.country)

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(saveShippingAddress({ address, city, postalCode, country }))
    history.push('/payment')
  }
  return (
    <FormContainer>
      <CheckoutSteps step1 />
      <h4 className='fw-bold text-decoration-underline'>Shipping</h4>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='address' className='py-2'>
          <Form.Label className='fw-semibold' style={{ fontSize: 13 }}>
            Address
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter address'
            className='loginInput'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='city' className='py-2'>
          <Form.Label className='fw-semibold' style={{ fontSize: 13 }}>
            City
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter city'
            className='loginInput'
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='postalCode' className='py-2'>
          <Form.Label className='fw-semibold' style={{ fontSize: 13 }}>
            Postal code
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter postal code'
            className='loginInput'
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='country' className='py-2'>
          <Form.Label className='fw-semibold' style={{ fontSize: 13 }}>
            Country
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter postal code'
            className='loginInput'
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-3 cta-btn'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default Shipping
