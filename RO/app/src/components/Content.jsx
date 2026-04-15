import React from 'react'
import { useState } from 'react'
import Cards from './Cards'


function Content({ state, paginatedData, data, action, changeState }) {

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
        user={true}
        changeState={changeState}
      />
      <Cards
        action={action}
        data={paginatedData.library}
        state={state}
        user={false}
      />

    </div>
  )
}

export default Content
