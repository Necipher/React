import React from 'react'
import { useState } from 'react'

const App = () => {
  return (
    <>
      <TopBar />
      <p className='Main-title'>Big Beautifull Name</p>
      <div className='main'>
        <Cards data={recipe.library} />
        <Cards data={recipe.user} />
      </div>
    </>
  )
}

export default App


// Future custom hook for handling state
function useAppState() {
}

// Future custom hook for handling functions
function useAppFunction() {

}

// Top Bar for showing basic moving around 
function TopBar() {
  return (
    <div className='Hero'>
      <SearchBar />
      <DropDownMenu />
    </div>
  )

}

function SearchBar() {
  return (
    <input placeholder='Search...' className='search-bar' />
  )
}

function DropDownMenu() {
  const [showOptions, setShowOptions] = useState(false)

  const options = ['Home', 'Ingredients',]

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
      <div className={`drop-menu ${showOptions ? "open" : ""}`}>
        <button className='menu-button'>Hello</button>
        <button className='menu-button'>Hello</button>
        <button className='menu-button'>Hello</button>
      </div>
    </>
  )
}

// Cards
function Cards({ data }) {
  return (
    data.map(recipe =>
      <CardItem
        key={recipe.id}
        data={recipe}
      />
    )
  )
}

// Reusable function for Middle section
function SectionList({ title, items }) {
  return (
    <section className='Ingredients'>
      <p className='title-section'>{title}</p>
      <div className='items-section'>
        <ul>
          {items.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
      </div>
    </section>
  )
}

// Card item - that houses the recepie and ingredients
function CardItem({ data }) {
  const [expanded, setExpanded] = useState(false)

  return (
    // Div-Wrapper container for styling 
    <div
      className='CardItem'
      tabIndex={-1}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setExpanded(false)
        }
      }}
    >
      {/* Title section: name and photo */}
      <header className='CardItem-firstRow' onClick={() => setExpanded(!expanded)}>
        <p className='title-main'>{data.name}</p>
        <img
          src={data.photo}
          className='photo-title' />
      </header>

      {/* Middle section: Ingredients and Instructions, is collapsable/expandable */}
      <div className={`CardItem-secondRow ${expanded ? "open" : ""}`}>
        <SectionList title={"Ingredients:"} items={data.ingredients} />
        <SectionList title={"Instructions:"} items={data.instructions} />
      </div>

      {/* Footer section: buttons */}
      <footer className='CardItem-thirdRow'>    {/* Section for functionality buttons */}
        <section>
          <button className='round-elongated-button'>Open Recepie</button>
        </section>
        <section>
          <button className={`round-button favorite ${data.favorite ? 'active' : ""}`}></button>
        </section>
      </footer>
    </div>
  )
}


// Content - nests everything exept the top bar
function Content() {

}

const recipe =
{
  "user": [],
  "library": [
    {
      "id": crypto.randomUUID(),
      "favorite": true,
      "photo": 'https://imgs.search.brave.com/Ao5EZZKbsLyMWesO7LNhsLdLhu_of78Jf6mY5dBdN-k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjUv/MTg1LzI2MS9zbWFs/bC9ncmlsbGVkLWdv/dXJtZXQtc2FuZHdp/Y2gtb24tY2lhYmF0/dGEtd2l0aC1mcmVz/aC12ZWdldGFibGVz/LWdlbmVyYXRlZC1i/eS1haS1mcmVlLXBo/b3RvLmpwZw',
      "name": "Tomato/Ham Sandwich",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"],
      "instructions": ["Do this while doing this", "After this do this"],
    },
    {
      "id": crypto.randomUUID(),
      "favorite": false,
      "photo": 'https://www.allrecipes.com/thmb/p4F_knUDCrUNusNOTyjY_dCp8d4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/13338-quick-and-easy-vegetable-soup-DDMFS-4x3-402702f59e7a41519515cecccaba1b80.jpg',
      "name": "Garlic Soup",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3", "ingredient 4"],
      "instructions": ["Do this while doing this", "After this do this", "Continue doing this"],
    },
    {
      "id": crypto.randomUUID(),
      "favorite": true,
      "photo": 'https://imgs.search.brave.com/Ao5EZZKbsLyMWesO7LNhsLdLhu_of78Jf6mY5dBdN-k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjUv/MTg1LzI2MS9zbWFs/bC9ncmlsbGVkLWdv/dXJtZXQtc2FuZHdp/Y2gtb24tY2lhYmF0/dGEtd2l0aC1mcmVz/aC12ZWdldGFibGVz/LWdlbmVyYXRlZC1i/eS1haS1mcmVlLXBo/b3RvLmpwZw',
      "name": "Cheese Sandwich",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"],
      "instructions": ["Do this while doing this", "After this do this"],
    },
    {
      "id": crypto.randomUUID(),
      "favorite": false,
      "photo": 'https://www.allrecipes.com/thmb/p4F_knUDCrUNusNOTyjY_dCp8d4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/13338-quick-and-easy-vegetable-soup-DDMFS-4x3-402702f59e7a41519515cecccaba1b80.jpg',
      "name": "Garlic Soup",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3", "ingredient 4"],
      "instructions": ["Do this while doing this", "After this do this", "Continue doing this"],
    },
    {
      "id": crypto.randomUUID(),
      "favorite": true,
      "photo": 'https://imgs.search.brave.com/Ao5EZZKbsLyMWesO7LNhsLdLhu_of78Jf6mY5dBdN-k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjUv/MTg1LzI2MS9zbWFs/bC9ncmlsbGVkLWdv/dXJtZXQtc2FuZHdp/Y2gtb24tY2lhYmF0/dGEtd2l0aC1mcmVz/aC12ZWdldGFibGVz/LWdlbmVyYXRlZC1i/eS1haS1mcmVlLXBo/b3RvLmpwZw',
      "name": "Cheese Sandwich",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"],
      "instructions": ["Do this while doing this", "After this do this"],
    },
    {
      "id": crypto.randomUUID(),
      "favorite": true,
      "photo": 'https://www.allrecipes.com/thmb/p4F_knUDCrUNusNOTyjY_dCp8d4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/13338-quick-and-easy-vegetable-soup-DDMFS-4x3-402702f59e7a41519515cecccaba1b80.jpg',
      "name": "Garlic Soup",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3", "ingredient 4"],
      "instructions": ["Do this while doing this", "After this do this", "Continue doing this"],
    },
    {
      "id": crypto.randomUUID(),
      "photo": 'https://imgs.search.brave.com/Ao5EZZKbsLyMWesO7LNhsLdLhu_of78Jf6mY5dBdN-k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjUv/MTg1LzI2MS9zbWFs/bC9ncmlsbGVkLWdv/dXJtZXQtc2FuZHdp/Y2gtb24tY2lhYmF0/dGEtd2l0aC1mcmVz/aC12ZWdldGFibGVz/LWdlbmVyYXRlZC1i/eS1haS1mcmVlLXBo/b3RvLmpwZw',
      "name": "Cheese Sandwich",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"],
      "instructions": ["Do this while doing this", "After this do this"]
    },
    {
      "id": crypto.randomUUID(),
      "photo": 'https://www.allrecipes.com/thmb/p4F_knUDCrUNusNOTyjY_dCp8d4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/13338-quick-and-easy-vegetable-soup-DDMFS-4x3-402702f59e7a41519515cecccaba1b80.jpg',
      "name": "Garlic Soup",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3", "ingredient 4"],
      "instructions": ["Do this while doing this", "After this do this", "Continue doing this"]
    },
    {
      "id": crypto.randomUUID(),
      "photo": 'https://imgs.search.brave.com/Ao5EZZKbsLyMWesO7LNhsLdLhu_of78Jf6mY5dBdN-k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjUv/MTg1LzI2MS9zbWFs/bC9ncmlsbGVkLWdv/dXJtZXQtc2FuZHdp/Y2gtb24tY2lhYmF0/dGEtd2l0aC1mcmVz/aC12ZWdldGFibGVz/LWdlbmVyYXRlZC1i/eS1haS1mcmVlLXBo/b3RvLmpwZw',
      "name": "Cheese Sandwich",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"],
      "instructions": ["Do this while doing this", "After this do this"]
    },
    {
      "id": crypto.randomUUID(),
      "photo": 'https://www.allrecipes.com/thmb/p4F_knUDCrUNusNOTyjY_dCp8d4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/13338-quick-and-easy-vegetable-soup-DDMFS-4x3-402702f59e7a41519515cecccaba1b80.jpg',
      "name": "Garlic Soup",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3", "ingredient 4"],
      "instructions": ["Do this while doing this", "After this do this", "Continue doing this"]
    },
    {
      "id": crypto.randomUUID(),
      "photo": 'https://imgs.search.brave.com/Ao5EZZKbsLyMWesO7LNhsLdLhu_of78Jf6mY5dBdN-k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjUv/MTg1LzI2MS9zbWFs/bC9ncmlsbGVkLWdv/dXJtZXQtc2FuZHdp/Y2gtb24tY2lhYmF0/dGEtd2l0aC1mcmVz/aC12ZWdldGFibGVz/LWdlbmVyYXRlZC1i/eS1haS1mcmVlLXBo/b3RvLmpwZw',
      "name": "Cheese Sandwich",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"],
      "instructions": ["Do this while doing this", "After this do this"]
    },
    {
      "id": crypto.randomUUID(),
      "photo": 'https://www.allrecipes.com/thmb/p4F_knUDCrUNusNOTyjY_dCp8d4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/13338-quick-and-easy-vegetable-soup-DDMFS-4x3-402702f59e7a41519515cecccaba1b80.jpg',
      "name": "Garlic Soup",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3", "ingredient 4"],
      "instructions": ["Do this while doing this", "After this do this", "Continue doing this"]
    },
    {
      "id": crypto.randomUUID(),
      "photo": 'https://imgs.search.brave.com/Ao5EZZKbsLyMWesO7LNhsLdLhu_of78Jf6mY5dBdN-k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjUv/MTg1LzI2MS9zbWFs/bC9ncmlsbGVkLWdv/dXJtZXQtc2FuZHdp/Y2gtb24tY2lhYmF0/dGEtd2l0aC1mcmVz/aC12ZWdldGFibGVz/LWdlbmVyYXRlZC1i/eS1haS1mcmVlLXBo/b3RvLmpwZw',
      "name": "Cheese Sandwich",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"],
      "instructions": ["Do this while doing this", "After this do this"]
    },
    {
      "id": crypto.randomUUID(),
      "photo": 'https://imgs.search.brave.com/Ao5EZZKbsLyMWesO7LNhsLdLhu_of78Jf6mY5dBdN-k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjUv/MTg1LzI2MS9zbWFs/bC9ncmlsbGVkLWdv/dXJtZXQtc2FuZHdp/Y2gtb24tY2lhYmF0/dGEtd2l0aC1mcmVz/aC12ZWdldGFibGVz/LWdlbmVyYXRlZC1i/eS1haS1mcmVlLXBo/b3RvLmpwZw',
      "name": "Cheese Sandwich",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"],
      "instructions": ["Do this while doing this", "After this do this"]
    },
    {
      "id": crypto.randomUUID(),
      "photo": 'https://www.allrecipes.com/thmb/p4F_knUDCrUNusNOTyjY_dCp8d4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/13338-quick-and-easy-vegetable-soup-DDMFS-4x3-402702f59e7a41519515cecccaba1b80.jpg',
      "name": "Garlic Soup",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3", "ingredient 4"],
      "instructions": ["Do this while doing this", "After this do this", "Continue doing this"]
    },
    {
      "id": crypto.randomUUID(),
      "photo": 'https://imgs.search.brave.com/Ao5EZZKbsLyMWesO7LNhsLdLhu_of78Jf6mY5dBdN-k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjUv/MTg1LzI2MS9zbWFs/bC9ncmlsbGVkLWdv/dXJtZXQtc2FuZHdp/Y2gtb24tY2lhYmF0/dGEtd2l0aC1mcmVz/aC12ZWdldGFibGVz/LWdlbmVyYXRlZC1i/eS1haS1mcmVlLXBo/b3RvLmpwZw',
      "name": "Cheese Sandwich",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"],
      "instructions": ["Do this while doing this", "After this do this"]
    },
    {
      "id": crypto.randomUUID(),
      "photo": 'https://www.allrecipes.com/thmb/p4F_knUDCrUNusNOTyjY_dCp8d4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/13338-quick-and-easy-vegetable-soup-DDMFS-4x3-402702f59e7a41519515cecccaba1b80.jpg',
      "name": "Garlic Soup",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3", "ingredient 4"],
      "instructions": ["Do this while doing this", "After this do this", "Continue doing this"]
    },
    {
      "id": crypto.randomUUID(),
      "photo": 'https://imgs.search.brave.com/Ao5EZZKbsLyMWesO7LNhsLdLhu_of78Jf6mY5dBdN-k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjUv/MTg1LzI2MS9zbWFs/bC9ncmlsbGVkLWdv/dXJtZXQtc2FuZHdp/Y2gtb24tY2lhYmF0/dGEtd2l0aC1mcmVz/aC12ZWdldGFibGVz/LWdlbmVyYXRlZC1i/eS1haS1mcmVlLXBo/b3RvLmpwZw',
      "name": "Cheese Sandwich",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"],
      "instructions": ["Do this while doing this", "After this do this"]
    },
    {
      "id": crypto.randomUUID(),
      "photo": 'https://imgs.search.brave.com/Ao5EZZKbsLyMWesO7LNhsLdLhu_of78Jf6mY5dBdN-k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjUv/MTg1LzI2MS9zbWFs/bC9ncmlsbGVkLWdv/dXJtZXQtc2FuZHdp/Y2gtb24tY2lhYmF0/dGEtd2l0aC1mcmVz/aC12ZWdldGFibGVz/LWdlbmVyYXRlZC1i/eS1haS1mcmVlLXBo/b3RvLmpwZw',
      "name": "Cheese Sandwich",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"],
      "instructions": ["Do this while doing this", "After this do this"]
    },
    {
      "id": crypto.randomUUID(),
      "photo": 'https://www.allrecipes.com/thmb/p4F_knUDCrUNusNOTyjY_dCp8d4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/13338-quick-and-easy-vegetable-soup-DDMFS-4x3-402702f59e7a41519515cecccaba1b80.jpg',
      "name": "Garlic Soup",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3", "ingredient 4"],
      "instructions": ["Do this while doing this", "After this do this", "Continue doing this"]
    },
    {
      "id": crypto.randomUUID(),
      "photo": 'https://imgs.search.brave.com/Ao5EZZKbsLyMWesO7LNhsLdLhu_of78Jf6mY5dBdN-k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjUv/MTg1LzI2MS9zbWFs/bC9ncmlsbGVkLWdv/dXJtZXQtc2FuZHdp/Y2gtb24tY2lhYmF0/dGEtd2l0aC1mcmVz/aC12ZWdldGFibGVz/LWdlbmVyYXRlZC1i/eS1haS1mcmVlLXBo/b3RvLmpwZw',
      "name": "Cheese Sandwich",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"],
      "instructions": ["Do this while doing this", "After this do this"]
    },
    {
      "id": crypto.randomUUID(),
      "photo": 'https://www.allrecipes.com/thmb/p4F_knUDCrUNusNOTyjY_dCp8d4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/13338-quick-and-easy-vegetable-soup-DDMFS-4x3-402702f59e7a41519515cecccaba1b80.jpg',
      "name": "Garlic Soup",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3", "ingredient 4"],
      "instructions": ["Do this while doing this", "After this do this", "Continue doing this"]
    },
    {
      "id": crypto.randomUUID(),
      "photo": 'https://imgs.search.brave.com/Ao5EZZKbsLyMWesO7LNhsLdLhu_of78Jf6mY5dBdN-k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjUv/MTg1LzI2MS9zbWFs/bC9ncmlsbGVkLWdv/dXJtZXQtc2FuZHdp/Y2gtb24tY2lhYmF0/dGEtd2l0aC1mcmVz/aC12ZWdldGFibGVz/LWdlbmVyYXRlZC1i/eS1haS1mcmVlLXBo/b3RvLmpwZw',
      "name": "Cheese Sandwich",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"],
      "instructions": ["Do this while doing this", "After this do this"]
    }
  ]
}
