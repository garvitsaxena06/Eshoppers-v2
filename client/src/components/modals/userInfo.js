import { useState, useEffect } from 'react'
import { Modal, Button, Form, Col } from 'react-bootstrap'

export default function UserInfo({ show, handleClose, handleSubmit, user }) {
  const [validated, setValidated] = useState(false)
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    city: '',
  })

  useEffect(() => {
    user && setState({ ...state, ...user })
    // eslint-disable-next-line
  }, [user])

  const checkValidation = (event) => {
    const form = event.currentTarget
    event.preventDefault()
    if (form.checkValidity() === false) {
      event.stopPropagation()
    }

    setValidated(true)
    handleSubmit(state)
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>User information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={checkValidation}>
          <Form.Group as={Col} className="mb-3" controlId="firstName">
            <Form.Label>First name</Form.Label>
            <Form.Control
              required
              type="text"
              minLength={5}
              placeholder="First name"
              name="firstName"
              value={state.firstName}
              onChange={(event) =>
                setState({ ...state, [event.target.name]: event.target.value })
              }
              //   defaultValue="Mark"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please provide a valid First name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} className="mb-3" controlId="lastName">
            <Form.Label>Last name</Form.Label>
            <Form.Control
              required
              type="text"
              minLength={5}
              placeholder="Last name"
              name="lastName"
              value={state.lastName}
              onChange={(event) =>
                setState({ ...state, [event.target.name]: event.target.value })
              }
              //   defaultValue="Otto"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please provide a valid First name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} className="mb-3" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              name="city"
              type="text"
              placeholder="City"
              required
              value={state.city}
              onChange={(event) =>
                setState({ ...state, [event.target.name]: event.target.value })
              }
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid city.
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              style={{ marginLeft: '12px' }}
              onClick={handleSubmit}
              type="submit"
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
