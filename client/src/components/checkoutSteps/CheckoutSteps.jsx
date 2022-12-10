import React from 'react'
import { Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const CheckoutSteps = ({ step1, step2, step3 }) => {
  return (
    <Nav className='justify-content-center mb-4'>
      <Nav.Item className='d-flex align-items-center'>
        {step1 ? (
          <Link to='/shipping'>
            <Nav.Link
              style={{ color: '#0a053a', fontSize: 20, fontWeight: 700 }}
            >
              Shipping
            </Nav.Link>
          </Link>
        ) : (
          <Nav.Link className='fw-semibold' disabled>
            Shipping
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item className='d-flex align-items-center'>
        {step2 ? (
          <Link to='/payment'>
            <Nav.Link
              style={{ color: '#0a053a', fontSize: 20, fontWeight: 700 }}
            >
              Payment
            </Nav.Link>
          </Link>
        ) : (
          <Nav.Link className='fw-semibold' disabled>
            Payment
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item className='d-flex align-items-center'>
        {step3 ? (
          <Link to='/placeorder'>
            <Nav.Link
              style={{ color: '#0a053a', fontSize: 20, fontWeight: 700 }}
            >
              Place Order
            </Nav.Link>
          </Link>
        ) : (
          <Nav.Link className='fw-semibold' disabled>
            Place Order
          </Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  )
}

export default CheckoutSteps
