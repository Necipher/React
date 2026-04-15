import React from 'react'
import { useState } from 'react'
import CardItem from './CardItem'


// Cards
function Cards({ data, state, action, user, changeState }) {
  return (
    data.map((recipe, index) =>
      <CardItem
        action={action}
        state={state}
        key={recipe.id}
        data={recipe}
        user={user}
        changeState={changeState}
      />
    )
  )
}

export default Cards
