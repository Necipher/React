import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

function DropDownMenu() {
  const [showOptions, setShowOptions] = useState(false)

  const options = [
    { label: 'Home', path: '/' },
    { label: 'Ingredients', path: '/ingredients' },
    { label: 'Something Else', path: '/' }
  ]

  return (
    <>
      <div
        className='drop-down-menu-button'
        onClick={() => setShowOptions(!showOptions)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setShowOptions(false)
          }
        }}
      >
        | | |
      </div>
      <div className={`drop-menu ${showOptions && "open"}`}>
        {options.map((option, index) =>
          <Link
            key={index}
            className='menu-button'
            to={option.path}>
            {option.label}
          </Link>)}
      </div>
    </>
  )
}

export default DropDownMenu
