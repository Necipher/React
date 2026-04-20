import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

function DropDownMenu() {
  const [showOptions, setShowOptions] = useState(false)

  const options = [
    { label: 'Home', path: '/' },
    { label: 'Ingredients', path: '/ingredients' },
    { label: 'My Recipes', path: '/myRecipes' }
  ]

  return (
    <div
      style={{ display: "contents", outline: "none" }}
    >
      <div
        className='drop-down-menu-button'
        onClick={() => setShowOptions(!showOptions)}
        autoFocus
        tabIndex="-1"
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
            to={option.path}
            onMouseDown={(e) => e.preventDefault()} 
            onClick={() => setShowOptions(false)}
          >
            {option.label}
          </Link>)}
      </div>
    </div>
  )
}

export default DropDownMenu
