import React from 'react'
import PropTypes from 'prop-types'
import { IoIosStar, IoMdStarHalf, IoMdStarOutline } from 'react-icons/io'

const Ratings = ({ value, text, color }) => {
  return (
    <div className='rating'>
      <div>
        <span>
          {value >= 1 ? (
            <IoIosStar color={color} />
          ) : value >= 0.5 ? (
            <IoMdStarHalf color={color} />
          ) : (
            <IoMdStarOutline color={color} />
          )}
        </span>
        <span>
          {value >= 2 ? (
            <IoIosStar color={color} />
          ) : value >= 1.5 ? (
            <IoMdStarHalf color={color} />
          ) : (
            <IoMdStarOutline color={color} />
          )}
        </span>
        <span>
          {value >= 3 ? (
            <IoIosStar color={color} />
          ) : value >= 2.5 ? (
            <IoMdStarHalf color={color} />
          ) : (
            <IoMdStarOutline color={color} />
          )}
        </span>
        <span>
          {value >= 4 ? (
            <IoIosStar color={color} />
          ) : value >= 3.5 ? (
            <IoMdStarHalf color={color} />
          ) : (
            <IoMdStarOutline color={color} />
          )}
        </span>
        <span>
          {value >= 5 ? (
            <IoIosStar color={color} />
          ) : value >= 4.5 ? (
            <IoMdStarHalf color={color} />
          ) : (
            <IoMdStarOutline color={color} />
          )}
        </span>
        <span> {text && text}</span>
      </div>
      <div>{value} rating</div>
    </div>
  )
}

Ratings.defaultProps = {
  color: 'rgb(237, 219, 0)',
}

Ratings.propTypes = {
  value: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
}

export default Ratings
