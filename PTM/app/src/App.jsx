import React from 'react'
import { useState, useEffect, useRef } from 'react'

const App = () => {
  const manage = appController()  /* Loads functions, state and logic from the appController custom hook */

  return (
    manage.state.isLoading ?
      <h1 className='center'>Loading Data...</h1> :
      <div className='main-grid' style={manage.state.displayClassic ? {
        gridTemplateColumns: `clamp(10%, ${manage.state.sideWidth}%, 25%) 1fr`
      } :
        { gridTemplateColumns: '2% 1fr' }
      }>
        <SideBar
          userlists={manage.state.allUserLists}
          setSelectedList={manage.action.setSelectedList}
          handleClick={manage.action.setShowAddNewTask}
          saveNewListName={manage.action.saveNewListNameToServer}
          deleteList={manage.action.deleteListFromServer}
          remainingTasks={manage.state.listData}
          nameUpdate={manage.action.updateNameOnServer}
          setWidth={manage.action.setSideWidth}
          handleDisplayStyle={manage.action.setDisplayClassic}
          displayClassic={manage.state.displayClassic}
          handleNumberOfPages={manage.action.setNumberOfPages}
          numberOfPages={manage.state.numberOfPages}
        />
        {manage.state.displayClassic ?
          <Page>
            <Header
              pageName={manage.state.selectedList}
              numberOfRemainingTasks={manage.state.unCompletedSelectedListTasks.length}
              numberOfCompletedTasks={manage.state.completedSelectedListTasks.length}
              handleClick={manage.action.setShowAddNewTask}
              setShowCompleted={manage.action.setShowCompleted}
              showCompleted={manage.state.showCompleted}
            />
            <Content
              handleClick={manage.action.setShowAddNewTask}
              showAddState={manage.state.showAddNewTask}
            >
              {/* Renders list of yet to be completed items */}
              <List
                tasks={manage.state.unCompletedSelectedListTasks}
                handleDelete={manage.action.deleteFromServer}
                handleEdit={manage.action.editOnServer}
                handleClick={manage.action.setShowAddNewTask}
                showAddState={manage.state.showAddNewTask}
              />
              {/* After the uncompleted list, renders a list of completed items */}
              {!manage.state.showCompleted ? "" :
                <List
                  tasks={manage.state.completedSelectedListTasks}
                  handleDelete={manage.action.deleteFromServer}
                  handleEdit={manage.action.editOnServer}
                  handleClick={manage.action.setShowAddNewTask}
                  showAddState={manage.state.showAddNewTask}
                />}
              {/* When a state is true it will show and offer to add to the list */}

              {manage.state.showAddNewTask ?
                <AddTask
                  handleSubmit={manage.action.handleSubmit}
                /> : ""
              }
            </Content>
          </Page> :
          <div className='flex'>
            {manage.state.numberOfPages.map((page, index) => (
              <Page>
                <Header
                  pageName={page.selectedList}
                  handleClick={manage.action.setShowAddNewTask}
                  setShowCompleted={manage.action.setShowCompleted}
                  showCompleted={manage.state.showCompleted}
                />
                <Content
                  handleClick={manage.action.setShowAddNewTask}
                  showAddState={manage.state.showAddNewTask}
                >
                  {/* Renders list of yet to be completed items */}
                  <List
                    tasks={manage.state.unCompletedSelectedListTasks}
                    handleDelete={manage.action.deleteFromServer}
                    handleEdit={manage.action.editOnServer}
                    handleClick={manage.action.setShowAddNewTask}
                    showAddState={manage.state.showAddNewTask}
                  />
                  {/* After the uncompleted list, renders a list of completed items */}
                  {!manage.state.showCompleted ? "" :
                    <List
                      tasks={manage.state.completedSelectedListTasks}
                      handleDelete={manage.action.deleteFromServer}
                      handleEdit={manage.action.editOnServer}
                      handleClick={manage.action.setShowAddNewTask}
                      showAddState={manage.state.showAddNewTask}
                    />}
                  {/* When a state is true it will show and offer to add to the list */}

                  {manage.state.showAddNewTask ?
                    <AddTask
                      handleSubmit={manage.action.handleSubmit}
                    /> : ""
                  }
                </Content>
              </Page>
            ))}
          </div>
        }
      </div>
  )
}

export default App

// Custom hook that houses all function and states so the main app component handles just the UI
function appController() {
  // States
  const [listData, setListData] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const [selectedList, setSelectedList] = useState("Home Page")
  const [numberOfPages, setNumberOfPages] = useState([{ id: crypto.randomUUID(), selectedList: "Home Page" }, { id: crypto.randomUUID(), selectedList: "Home Page" }, { id: crypto.randomUUID(), selectedList: "Home Page" }])
  const [showAddNewTask, setShowAddNewTask] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)
  const [sideWidth, setSideWidth] = useState(12)
  const [displayClassic, setDisplayClassic] = useState(true)

  // Generating lists from loaded data
  const selectedListTasks = isLoading ? [] : listData[selectedList].pageContent
  const unCompletedSelectedListTasks = selectedListTasks.filter(task => task.checked == false)
  const completedSelectedListTasks = selectedListTasks.filter(task => task.checked == true)
  const allUserLists = isLoading ? [] : Object.keys(listData).map(key => ({ "listName": key, "id": listData[key].id }))

  // Data from server
  async function getData() {
    const req = await fetch('http://localhost:8002/api');
    const data = await req.json();
    setListData(data);
    setIsLoading(false);
  }

  useEffect(() => {
    getData();
  }, [])

  // Send to server 
  async function sendToServer(dataToSend) {
    const res = await fetch('http://localhost:8002/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend)
    })
    getData();
  }

  async function saveNewListNameToServer(dataToSave) {
    const req = await fetch('http://localhost:8002/api:newList', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...dataToSave })
    })
    getData();
  }

  // OnSubmit to send data to server
  function handleSubmit(newData) {
    const dataToPost = { ...newData, "id": crypto.randomUUID(), "forPage": selectedList }
    sendToServer(dataToPost);

  }

  // Delete data from server
  async function deleteFromServer(idForDeletetion) {
    const req = await fetch('http://localhost:8002/api', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "idForDeletion": idForDeletetion, "forPage": selectedList })
    })
    getData();
  }

  async function deleteListFromServer(idForDeletion, listPage) {
    const req = await fetch('http://localhost:8002/api:deleteList', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "idForDeletion": idForDeletion, "listName": listPage })
    })
    getData();
  }

  async function editOnServer(subtituteData) {
    const req = await fetch('http://localhost:8002/api', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...subtituteData, "forPage": selectedList })
    })
    getData();
  }

  async function updateNameOnServer(oldName, newName, id) {
    const req = await fetch('http://localhost:8002/api:editName', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "oldName": oldName, "newName": newName, "id": id })
    })
    getData();
  }


  return {
    state: {
      listData,
      isLoading,
      selectedList,
      showAddNewTask,
      showCompleted,
      unCompletedSelectedListTasks,
      completedSelectedListTasks,
      allUserLists,
      sideWidth,
      numberOfPages,
      displayClassic
    },
    action: {
      setSelectedList,
      setShowAddNewTask,
      setShowCompleted,
      sendToServer,
      handleSubmit,
      deleteFromServer,
      editOnServer,
      saveNewListNameToServer,
      deleteListFromServer,
      updateNameOnServer,
      setSideWidth,
      setDisplayClassic,
      setNumberOfPages
    }
  }
}

function Page({ children }) {
  return (
    <div className='page-grid'>
      {children}
    </div>
  )
}

function AddTask({ handleSubmit }) {
  const [inputData, setInputData] = useState({ "title": "", "description": "", "checked": false })

  return (

    <form
      className='addTaskItem'
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          handleSubmit(inputData)
        }
      }}
    >
      <input
        type='checkbox'
        className='checked-status inputCheckMark'
        checked={inputData.checked}
        onChange={() => setInputData({ ...inputData, "checked": !inputData.checked })}
      />
      <input
        autoFocus
        type='text'
        placeholder='Write a Title...'
        className='inputTitle' value={inputData.title}
        onChange={e => setInputData({ ...inputData, "title": e.target.value })}
      ></input>
      <input
        type='text'
        placeholder='Write a Description...'
        className='inputDescription'
        value={inputData.description}
        onChange={e => setInputData({ ...inputData, "description": e.target.value })}
      ></input>
    </form>
  )
}

function List({
  tasks,
  handleDelete,
  handleEdit,
  handleClick,
}) {
  return (
    tasks.map(task =>
      <ListItem
        key={task.id}
        titleText={task.title}
        descriptionText={task.description}
        checked={task.checked}
        id={task.id}
        handleDelete={() => handleDelete(task.id)}
        handleEdit={handleEdit}
        handleClick={handleClick}
      />
    )
  )
}

// Created task field component
function ListItem({
  titleText = "Title of a task",
  descriptionText = "Optional Description...",
  checked,
  id,
  handleDelete,
  handleEdit,
  handleClick,
}) {
  const [isEditOn, setIsEditOn] = useState(false)
  const [localData, setLocalData] = useState({
    "title": titleText,
    "description": descriptionText,
    "checked": checked,
    "id": id
  })

  return (
    <div className={localData.checked ? 'listItem-grid completed' : 'listItem-grid'}
      onClick={(e) => e.stopPropagation()}
      tabIndex="-1"
      onFocus={(e) => {
        if (e.target.name !== 'complete-button') {
          setIsEditOn(true);
        }
        handleClick(false)

      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsEditOn(false);
          handleEdit(localData);
        }
      }}
    >   {/* Grid wrapper for CSS organization */}
      <div className='listItem-main-row'>   {/* Main-row, always vissible with quick access to editing its content and checked status*/}
        <input
          name='complete-button'
          className='checked-status'
          type='checkbox'
          checked={localData.checked}
          onChange={() => {
            const change = { ...localData, "checked": !localData.checked }
            setLocalData(change)
            handleEdit(change)
          }}
        />
        {!isEditOn ?
          <p>{localData.title}</p> :
          <input
            autoFocus
            type='text'
            className='inputTitle'
            value={localData.title}
            onChange={(e) => setLocalData({ ...localData, "title": e.target.value })}
          />}
      </div>
      <div className='listItem-second-row'>   {/* Second-row, shows only if a description is inputed or when editing of the Main-row is clicked */}
        {!isEditOn && !localData.description ? "" :
          !isEditOn ? <p className="desc" onClick={() => setIsEditOn(!isEditOn)}>{localData.description}</p> :
            <input
              type='text'
              className='inputDescription'
              value={localData.description}
              onChange={(e) => setLocalData({ ...localData, "description": e.target.value })}
            />}
      </div>

      {!isEditOn ? "" :
        <div className='listItem-third-row'>
          <button className='delete-button' onClick={() => handleDelete()}></button>
          <div>
            <button className='urgency-button-resting'>!</button>
            <button className='urgency-button-resting'>!!</button>
            <button className='urgency-button-clicked'>!!!</button>
          </div>
        </div>}
      {/* Third-row shows with Second-row second condition and houses the delete button, urgency ... */}
    </div>
  )
}

// Create a Header for the showed page
function Header({ numberOfRemainingTasks, numberOfCompletedTasks, pageName, handleClick, showCompleted, setShowCompleted }) {

  return (
    <div className='header'>
      <p className='pageName'>{pageName}</p>
      <p className='numberOfRemainingTasks'>{numberOfRemainingTasks}</p>
      <div className='right-bottom-corner'>
        <button className='add-button' onClick={() => handleClick(true)}>+</button>
      </div>
      <p className='numberOfCompletedTasks'>Completed: {numberOfCompletedTasks}  | <button className='show-hide-button' onClick={() => setShowCompleted(!showCompleted)}>{showCompleted ? "Hide" : "Show"}</button></p>
    </div>
  )
}

// Create sidebar`
function SideBar({
  userlists,
  setSelectedList,
  handleClick,
  saveNewListName,
  deleteList,
  remainingTasks,
  nameUpdate,
  setWidth,
  handleDisplayStyle,
  displayClassic,
  handleNumberOfPages,
  numberOfPages
}) {
  const [showAddList, setShowAddList] = useState(false)
  const [newListName, setNewListName] = useState("")
  const isResizing = useRef(false)

  // useEffect for handling resizing of side bar, uses useRef for keeping value inbetween renders
  useEffect(() => {
    function onMouseMove(e) {
      if (!isResizing.current) return
      setWidth((e.clientX / window.innerWidth) * 100)
    }

    function onMouseUp() {
      isResizing.current = false
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

  }, [])


  return displayClassic ? // Depends on the state value will show either classic single page or switch into rendering multiple pages
    (<div className='sideBar-grid' onClick={() => handleClick(false)}>   {/* Function to disable showing "Add new task" when clicked on sidebar */}
      <div className='sideBar-main'>    {/* // Location for a "landing" button */}
        <button className='landing-button' onClick={(e) => setSelectedList(e.target.textContent)}>Home Page</button>    {/* Button for returning to Main "landing" page */}
      </div>
      <div className='sideBar-lists'>   {/* // Renders user added lists */}
        <h4>Lists:</h4>
        {userlists.map((entry, index) =>
          <SideBarItem
            listName={entry.listName}
            id={entry.id}
            index={index}
            setSelectedList={setSelectedList}
            deleteList={deleteList}
            remainingTasks={remainingTasks}
            nameUpdate={nameUpdate}
          />)}
        <div className='sideBar-control'>   {/* Houses buttons for adding a new list or switching display mode from single to multiple pages */}
          <button
            className='edit-list-button'
            onClick={() => {
              // Based on user input and conditions, creates a new list item and sends it to server for rendering
              if (showAddList && newListName != "") {
                saveNewListName({ "newListName": newListName, id: crypto.randomUUID(), pageContent: [] })
                setNewListName("")
              }
              setShowAddList(!showAddList)
            }}>
            {showAddList && newListName != "" ? "+" : showAddList ? "-" : "+"}    {/* Adds simple conditioning for the button, depending on inside value to show button symbols */}
          </button>
          {showAddList ? <input autoFocus className='inputList' value={newListName} onChange={(e) => setNewListName(e.target.value)} /> : ""}   {/* Input field for the add new list name */}
        </div>
      </div>
      <button className='add-button at-end' onClick={() => handleDisplayStyle(!displayClassic)}>| |</button>   {/* Button for changing the display status */}
      <div className='handle' onMouseDown={(e) => {
        e.preventDefault()
        isResizing.current = true
      }}>
      </div>
    </div>)
    :
    <div className='side-control'>
      <button className='add-button' onClick={() => handleDisplayStyle(!displayClassic)}>| |</button>
      <button className='add-button' onClick={() => handleNumberOfPages([...numberOfPages, { id: crypto.randomUUID(), selectedList: "Home Page" }])}>+</button>
      <button className='add-button' onClick={() => handleNumberOfPages([...numberOfPages].slice(0, -1))}>-</button>
    </div>

}

function SideBarItem({ listName, id, index, setSelectedList, deleteList, remainingTasks, nameUpdate }) {
  const [showMoreButtons, setShowMoreButtons] = useState(false)
  const [localSideBarData, setLocalSideBarData] = useState({ "listName": listName, "id": id })

  return (
    <div className='list'>
      <button
        className='edit-list-button'
        onClick={() => {
          setShowMoreButtons(!showMoreButtons)
          if (showMoreButtons && localSideBarData.listName && listName !== localSideBarData.listName) {
            nameUpdate(listName, localSideBarData.listName, id)
          }
        }
        }>{showMoreButtons ? '<' : '>'}</button>
      {showMoreButtons ?
        <button className='edit-list-button delete-list-button' onClick={() => { deleteList(id, listName); setSelectedList("Home Page") }}>x</button> : ""}
      {showMoreButtons ?
        <input
          autoFocus
          type='text'
          className='inputList'
          value={localSideBarData.listName}
          onChange={(e) => setLocalSideBarData({ ...localSideBarData, "listName": e.target.value })}
        /> :
        <button key={index} onClick={() => setSelectedList(localSideBarData.listName)} onDoubleClick={() => setShowMoreButtons(true)} className='listName-button'>{localSideBarData.listName}</button>}
      <p className='tracker'>{remainingTasks[listName].pageContent.filter(task => task.checked === false).length}</p>
    </div>
  )
}

function Content({ children, handleClick, showAddState }) {
  return (
    <div className='content'
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClick(!showAddState)
        }
      }}
    >
      {children}
    </div>
  )
}




