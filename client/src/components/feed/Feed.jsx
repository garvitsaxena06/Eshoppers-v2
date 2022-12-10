import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import Skeleton from 'react-loading-skeleton'
import { listProducts } from '../../store/actions/productActions'
import Product from './Product'
import './feed.css'

export default function Feed() {
  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, products } = productList

  useEffect(() => {
    dispatch(listProducts())
  }, [dispatch])

  return (
    <div className='feed'>
      <div className='feedWrapper'>
        <h4 className='fw-bold text-decoration-underline mt-2'>
          Latest Products
        </h4>
        {!loading ? (
          <Row>
            {products?.map((product, index) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        ) : (
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
        )}
      </div>
    </div>
  )
}
