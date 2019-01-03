import * as React from 'react'
import PanelLeft from './panel/left'
import PanelRight from './panel/right'
import WeatherWidget from './weather/widget'


export default function Main () {
  return (
    <main>
      <WeatherWidget />

      <div className="container">
        <div className="row">
          <PanelLeft />
          <PanelRight />
        </div>
      </div>
    </main>
  )
}
