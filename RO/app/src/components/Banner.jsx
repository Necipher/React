import React from 'react'
import { useState } from 'react'
import Carousel from './Carousel'

function Banner({ state, action, data }) {

  if (!data) {
    return (
      <p>Loading...</p>
    )
  }

  return (
    <div className='banner-grid' >

      <button
        className='change-display-button'
        onClick={action.toggleDisplayFunction}
      >
        {state.displayCards ? "Pockets" : "Cards"}
      </button>
      <p className='Main-title'>Site Name</p>

      {state.displayCards &&
        <Carousel
          state={state}
          data={data}
        />}
    </div>
  )
}

export default Banner
