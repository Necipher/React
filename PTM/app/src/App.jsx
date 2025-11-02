import React from 'react'
import { useState, useEffect } from 'react'

const App = () => {
  const manage = appController()  /* Loads the functions, state and logic from the appController custom hook */

  return (
    manage.state.isLoading ?
      <h1 className='center'>Loading Data...</h1> :
      <div className='main-grid'>
        <SideBar
          userlists={manage.state.allUserLists}
          setSelectedList={manage.action.setSelectedList}
        />
        <div className='page-grid'>
          <Header
            numberOfRemainingTasks={manage.state.unCompletedSelectedListTasks.length}
            numberOfCompletedTasks={manage.state.completedSelectedListTasks.length}
            pageName={manage.state.selectedList}
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
        </div>
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
  const [showAddNewTask, setShowAddNewTask] = useState(true)
  const [showCompleted, setShowCompleted] = useState(false)

  // Generating lists from loaded data
  const selectedListTasks = isLoading ? [] : listData[selectedList]
  const unCompletedSelectedListTasks = selectedListTasks.filter(task => task.checked == false)
  const completedSelectedListTasks = selectedListTasks.filter(task => task.checked == true)
  const allUserLists = isLoading ? [] : Object.keys(listData)


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

  // OnSubmit to send data to server
  function handleSubmit(newData, restartNewData) {
    const dataToPost = { ...newData, "id": crypto.randomUUID(), "forPage": selectedList }
    sendToServer(dataToPost);
    restartNewData({ "title": "", "description": "", "checked": false })
    setShowAddNewTask(false)
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

  async function editOnServer(subtituteData) {
    const req = await fetch('http://localhost:8002/api', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...subtituteData, "forPage": selectedList })
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
      allUserLists
    },
    action: {
      setSelectedList,
      setShowAddNewTask,
      setShowCompleted,
      sendToServer,
      handleSubmit,
      deleteFromServer,
      editOnServer
    }
  }
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
      onFocus={() => {
        setIsEditOn(true);
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
          !isEditOn ? <p onClick={() => setIsEditOn(!isEditOn)}>{localData.description}</p> :
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
      <button className='add-button' onClick={() => handleClick(true)}>+</button>
      <p className='numberOfCompletedTasks'>Completed: {numberOfCompletedTasks}  | <button className='show-hide-button' onClick={() => setShowCompleted(!showCompleted)}>{showCompleted ? "Hide" : "Show"}</button></p>
    </div>
  )
  // Page name taken from the list name
  // Show stats: Nr. of Completed and  Nr. of Remaining tasks
  // Togle for completed items
}

// Create sidebar`
function SideBar({ userlists, setSelectedList }) {
  return (
    <div className='sideBar-grid'>
      <div className='sideBar-main'>    {/* // Landing page where it shows all reminders */}
        <button className='listName-button' onClick={(e) => setSelectedList(e.target.textContent)}>Home Page</button>
      </div>
      <div className='sideBar-lists'>   {/* // Showed users lists */}
        <h4>Lists:</h4>
        {userlists.map((listName, index) => <button key={index} onClick={() => setSelectedList(listName)} className='listName-button'>{listName}</button>)}
      </div>
      <div className='sideBar-control'>
        {/* // Add a list button */}
        <button>Add list</button>
        {/* // Delete a list button */}
        <button></button>
      </div>
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




