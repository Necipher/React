import React from 'react'
import { useState } from 'react'
import Cards from './Cards'


function Content({ state, paginatedData, data, action }) {

  if (!data) {
    return (
      <p>Loading...</p>
    )
  }

  return (
    <div className={state.displayCards ? 'main-vertical' : 'main-horizontal'}>
      <Cards
        action={action}
        data={data.user}
        state={state}
      />
      <Cards
        action={action}
        data={paginatedData.library}
        state={state}
      />

    </div>
  )
}

export default Content
