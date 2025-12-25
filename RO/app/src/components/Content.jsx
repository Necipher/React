import React from 'react'
import { useState } from 'react'
import Cards from './Cards'


function Content({ state, data, action }) {

  if (!data) {
    return (
      <p>Loading...</p>
    )
  }

  return (
    <div className={state.displayCards ? 'main-vertical' : 'main-horizontal'}>
      <Cards
        action={action}
        data={data.library}
        state={state}
      />
      <Cards
        action={action}
        data={data.user}
        state={state}
      />
    </div>
  )
}

export default Content
