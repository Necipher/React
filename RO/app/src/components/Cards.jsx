import React from 'react'
import { useState } from 'react'
import CardItem from './CardItem'


// Cards
function Cards({ data, state, action }) {
  return (
    data.map((recipe, index) =>
      <CardItem
        action={action}
        state={state}
        key={recipe.id}
        data={recipe}
      />
    )
  )
}

export default Cards
