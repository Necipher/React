import React from 'react'
import { useState } from 'react'
import CardItem from './CardItem'


// Cards
function Cards({ data, state, action, user }) {
  console.log(data[0])
  return (
    data.map((recipe, index) =>
      <CardItem
        action={action}
        state={state}
        key={recipe.id}
        data={recipe}
        user={user}
      />
    )
  )
}

export default Cards
