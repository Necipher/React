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
          setSelectedList={manage.action.selectList}
          handleClick={manage.action.setShowAddNewTask}
          saveNewListName={manage.action.saveNewListNameToServer}
          deleteList={manage.action.deleteListFromServer}
          remainingTasks={manage.state.listData.user}
          nameUpdate={manage.action.updateNameOnServer}
          setWidth={manage.action.setSideWidth}
          handleDisplayStyle={manage.action.setDisplayClassic}
          displayClassic={manage.state.displayClassic}
          handleNumberOfPages={manage.action.setNumberOfPages}
          numberOfPages={manage.state.numberOfPages}
          setDataScope={manage.action.setDataScope}
          setHome={manage.action.setHome}
        />
        {manage.state.displayClassic ? manage.state.dataScope === "landing" ?
          <LandingPage
            state={manage.action.setDataScope}
            userlists={manage.state.allUserLists}
            setSelectedList={manage.action.selectList}
            saveNewListName={manage.action.saveNewListNameToServer}
          /> :
          <Page>
            <Header
              pageName={manage.state.selectedList}
              numberOfRemainingTasks={manage.state.unCompletedSelectedListTasks.length}
              numberOfCompletedTasks={manage.state.completedSelectedListTasks.length}
              handleClick={manage.action.setShowAddNewTask}
              setShowCompleted={manage.action.setShowCompleted}
              showCompleted={manage.state.showCompleted}
              displayClassic={manage.state.displayClassic}
              allUserLists={manage.state.allUserLists}
              handleNumberOfPages={manage.action.setNumberOfPages}
              numberOfPages={manage.state.numberOfPages}
              setSortUrgency={manage.action.setSortUrgency}
              sortUrgency={manage.state.sortUrgency}
            />
            <Content
              handleClick={manage.action.setShowAddNewTask}
              showAddState={manage.state.showAddNewTask}
              setSelectedList={manage.action.selectList}
              pageName={manage.state.selectedList}
            >
              {/* Renders list of yet to be completed items */}
              <List
                tasks={manage.state.unCompletedSelectedListTasks}
                handleDelete={manage.action.deleteFromServer}
                handleEdit={manage.action.editOnServer}
                handleClick={manage.action.setShowAddNewTask}
                showAddState={manage.state.showAddNewTask}
                handleReorder={manage.action.handleReorder}
                pageName={manage.state.selectedList}
                setSelectedList={manage.action.selectList}
              />
              {/* After the uncompleted list, renders a list of completed items */}
              {!manage.state.showCompleted ? "" :
                <List
                  tasks={manage.state.completedSelectedListTasks}
                  handleDelete={manage.action.deleteFromServer}
                  handleEdit={manage.action.editOnServer}
                  handleClick={manage.action.setShowAddNewTask}
                  showAddState={manage.state.showAddNewTask}
                  handleReorder={manage.action.handleReorder}
                  pageName={manage.state.selectedList}
                  setSelectedList={manage.action.selectList}
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
            {manage.state.numberOfPages.map(page => (
              <div className='multi-page' key={page.id}>
                {page.scope === "landing" ? (
                  <LandingPage
                    saveNewListName={manage.action.saveNewListNameToServer}
                    setMainPage={manage.action.selectList}
                    state={(newScope) => {
                      const updatedPages = manage.state.numberOfPages.map(p =>
                        p.id === page.id ? { ...p, scope: newScope } : p
                      );
                      manage.action.setNumberOfPages(updatedPages);
                    }}
                    userlists={manage.state.allUserLists}
                    setSelectedList={(listName) => {
                      const updatedPages = manage.state.numberOfPages.map(p =>
                        p.id === page.id ? { ...p, selectedList: listName, scope: "user" } : p
                      );
                      manage.action.setNumberOfPages(updatedPages);
                    }}
                  />
                ) : (
                  <Page>
                    <Header
                      pageName={page.selectedList}
                      numberOfRemainingTasks={manage.state.listData.user[page.selectedList].pageContent.filter(task => task.checked == false).length}
                      numberOfCompletedTasks={manage.state.listData.user[page.selectedList].pageContent.filter(task => task.checked == true).length}
                      handleClick={manage.action.setShowAddNewTask}
                      setShowCompleted={manage.action.setShowCompleted}
                      showCompleted={manage.state.showCompleted}
                      displayClassic={manage.state.displayClassic}
                      allUserLists={manage.state.allUserLists}
                      handleNumberOfPages={manage.action.setNumberOfPages}
                      numberOfPages={manage.state.numberOfPages}
                      id={page.id}
                      setMainPage={manage.action.selectList}
                      setSortUrgency={manage.action.setSortUrgency}
                      sortUrgency={manage.state.sortUrgency}
                    />
                    <Content
                      handleClick={manage.action.setShowAddNewTask}
                      showAddState={manage.state.showAddNewTask}
                      setSelectedList={manage.action.selectList}
                      pageName={page.selectedList}
                    >
                      {/* Renders list of yet to be completed items */}
                      <List
                        tasks={manage.state.listData.user[page.selectedList].pageContent.filter(task => task.checked == false)}
                        handleDelete={manage.action.deleteFromServer}
                        handleEdit={manage.action.editOnServer}
                        handleClick={manage.action.setShowAddNewTask}
                        showAddState={manage.state.showAddNewTask}
                        handleReorder={manage.action.handleReorder}
                        pageName={manage.state.selectedList}
                        changeToPageName={page.selectedList}
                        setSelectedList={manage.action.selectList}
                      />
                      {/* After the uncompleted list, renders a list of completed items */}
                      {!manage.state.showCompleted ? "" :
                        <List
                          tasks={manage.state.listData.user[page.selectedList].pageContent.filter(task => task.checked == true)}
                          handleDelete={manage.action.deleteFromServer}
                          handleEdit={manage.action.editOnServer}
                          handleClick={manage.action.setShowAddNewTask}
                          showAddState={manage.state.showAddNewTask}
                          handleReorder={manage.action.handleReorder}
                          pageName={manage.state.selectedList}
                          changeToPageName={page.selectedList}
                          setSelectedList={manage.action.selectList}
                        />}
                      {/* When a state is true it will show and offer to add to the list */}

                      {manage.state.showAddNewTask ?
                        <AddTask
                          handleSubmit={manage.action.handleSubmit}
                        /> : ""
                      }
                    </Content>
                  </Page>
                )}
              </div>
            ))}
          </div>
        }
      </div >
  )
}

export default App

// Custom hook that houses all function and states so the main app component handles just the UI
function appController() {
  // States
  const [listData, setListData] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const [dataScope, setDataScope] = useState("landing");
  const [selectedList, setSelectedList] = useState("Home");
  const [numberOfPages, setNumberOfPages] = useState([{ id: crypto.randomUUID(), selectedList: "Home", scope: "landing" }, { id: crypto.randomUUID(), selectedList: "Home", scope: "landing" }]);
  const [showAddNewTask, setShowAddNewTask] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [sideWidth, setSideWidth] = useState(12);
  const [displayClassic, setDisplayClassic] = useState(true);
  const [sortUrgency, setSortUrgency] = useState(false)

  // Generating lists from loaded data
  const selectedListTasks = !isLoading && listData[dataScope]?.[selectedList]?.pageContent ? listData[dataScope][selectedList].pageContent : []
  const ListTasksSortedByUrgency = [...selectedListTasks].sort((a, b) => a.urgency - b.urgency)
  const unCompletedSelectedListTasks = sortUrgency ? ListTasksSortedByUrgency.filter(task => task.checked == false) : selectedListTasks.filter(task => task.checked == false)
  const completedSelectedListTasks = selectedListTasks.filter(task => task.checked == true)
  const allUserLists = isLoading ? [] : Object.keys(listData.user).map(key => ({ "listName": key, "id": listData.user[key].id }))

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

  // Sends a task to add to a list to server 
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

  async function handleReorder(reorderedList, currentPage) {
    const req = await fetch('http://localhost:8002/api/reorderList', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "newData": reorderedList, "forPage": currentPage })
    })
    getData();
  }

  function selectList(listName) {
    setSelectedList(listName);
    setDataScope("user")
  }

  function setHome() {
    setDataScope("landing")
    setSelectedList("Home");
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
      displayClassic,
      dataScope,
      sortUrgency
    },
    action: {
      selectList,
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
      setNumberOfPages,
      setDataScope,
      setHome,
      handleReorder,
      setSortUrgency
    }
  }
}

function Page({ children }) {

  return (
    <div className='page-grid' >
      {children}
    </div>
  )
}

function AddTask({ handleSubmit }) {
  const [inputData, setInputData] = useState({ "title": "", "description": "", "checked": false, "urgency": 0 })

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
  handleReorder,
  pageName,
  changeToPageName,
  setSelectedList
}) {

  const dragRef = useRef(null)
  const dragOverRef = useRef(null)

  function switchPlaces() {
    const reordered = [...tasks]
    const draggedItem = reordered.splice(dragRef.current, 1)[0];
    reordered.splice(dragOverRef.current, 0, draggedItem);
    handleReorder(reordered, pageName)
  }

  return (
    tasks.map((task, index) =>
      <ListItem
        index={index}
        key={task.id}
        titleText={task.title}
        descriptionText={task.description}
        checked={task.checked}
        id={task.id}
        handleDelete={() => handleDelete(task.id)}
        handleEdit={handleEdit}
        handleClick={handleClick}
        urgency={task.urgency}
        dragRef={dragRef}
        dragOverRef={dragOverRef}
        switchPlaces={switchPlaces}
        changeToPageName={changeToPageName}
        setSelectedList={setSelectedList}
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
  urgency,
  switchPlaces,
  index,
  dragRef,
  dragOverRef,
  changeToPageName,
  setSelectedList
}) {
  const [isEditOn, setIsEditOn] = useState(false)
  const [localData, setLocalData] = useState({
    "title": titleText,
    "description": descriptionText,
    "checked": checked,
    "id": id,
    "urgency": urgency
  })


  return (
    <div draggable className={localData.checked ? 'listItem-grid completed' : 'listItem-grid'}
      tabIndex='-1'
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsEditOn(false);
          handleEdit(localData);
        }
      }}
      onMouseDown={() => {
        if (changeToPageName) {
          setSelectedList(changeToPageName)
        }
      }}
      onDragStart={() => dragRef.current = index}
      onDragEnter={() => dragOverRef.current = index}
      onDragEnd={() => switchPlaces()}
      onDragOver={e => e.preventDefault()}
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
          <p onClick={(e) => {
            e.stopPropagation();
          }}
            tabIndex="-1"
            onFocus={(e) => {
              if (changeToPageName) {
                setSelectedList(changeToPageName)
              }
              if (e.target.name !== 'complete-button') {
                setIsEditOn(true);
              }
              handleClick(false)

            }}
          >{localData.title}</p> :
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
            <button className={localData.urgency === 2 ? 'urgency-button-clicked' : 'urgency-button-resting'} onClick={() => setLocalData({ ...localData, "urgency": 2 })}>!</button>
            <button className={localData.urgency === 1 ? 'urgency-button-clicked' : 'urgency-button-resting'} onClick={() => setLocalData({ ...localData, "urgency": 1 })}>!!</button>
            <button className={localData.urgency === 0 ? 'urgency-button-clicked' : 'urgency-button-resting'} onClick={() => setLocalData({ ...localData, "urgency": 0 })}>!!!</button>
          </div>
        </div>}
      {/* Third-row shows with Second-row second condition and houses the delete button, urgency ... */}
    </div>
  )
}

// Create a Header for the showed page
function Header({
  setMainPage,
  numberOfRemainingTasks,
  numberOfCompletedTasks,
  pageName,
  handleClick,
  showCompleted,
  setShowCompleted,
  displayClassic,
  allUserLists,
  numberOfPages,
  handleNumberOfPages,
  id,
  setSortUrgency,
  sortUrgency
}) {
  const [isSelecting, setIsSelecting] = useState(false)

  function changeListName(newListName) {
    const updateName = numberOfPages.map(page => page.id === id ? { ...page, selectedList: newListName } : page)
    handleNumberOfPages(updateName)
    setIsSelecting(false)
  }

  return (
    <div className='header'>
      <div className='dropdown'>
        {displayClassic ? <p className='pageName'>{pageName}</p> : <button className='pageName dropdown-button' onClick={() => { setIsSelecting(!isSelecting) }}>{pageName}</button>}
        {isSelecting ? <div className='dropmenu'>{allUserLists.map(a => <ul onClick={() => { setMainPage && setMainPage(a.listName); changeListName(a.listName) }}>{a.listName}</ul>)}</div> : ""}
      </div>
      <p className='numberOfRemainingTasks'>{numberOfRemainingTasks}</p>
      <div className='right-bottom-corner'>
        <button className={!sortUrgency ? 'add-button' : 'add-button true'} onClick={() => setSortUrgency(!sortUrgency)}>U</button>
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
  numberOfPages,
  setHome,
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
        <button className='landing-button' onClick={(e) => { setHome() }}>Home</button>    {/* Button for returning to Main "landing" page */}

      </div>
      <div className='sideBar-lists'>   {/* // Renders user added lists */}
        <h4>Lists:</h4>
        {userlists.map((entry, index) =>
          <SideBarItem
            key={index}
            listName={entry.listName}
            id={entry.id}
            index={index}
            setSelectedList={setSelectedList}
            deleteList={deleteList}
            remainingTasks={remainingTasks}
            nameUpdate={nameUpdate}
            setHome={setHome}
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
      <button className='add-button at-end' onClick={() => { handleDisplayStyle(!displayClassic) }}>| |</button>   {/* Button for changing the display status */}
      <div className='handle' onMouseDown={(e) => {
        e.preventDefault()
        isResizing.current = true
      }}>
      </div>
    </div>)
    :
    <div className='side-control'>
      <button className='add-button' onClick={() => handleDisplayStyle(!displayClassic)}>| |</button>
      <button className='add-button' onClick={() => handleNumberOfPages([...numberOfPages, { id: crypto.randomUUID(), selectedList: "Home", scope: "landing" }])}>+</button>
      <button className='add-button' onClick={() => handleNumberOfPages([...numberOfPages].slice(0, -1))}>-</button>
    </div>
}

function SideBarItem({ listName, id, index, setSelectedList, deleteList, remainingTasks, nameUpdate, setHome }) {
  const [showMoreButtons, setShowMoreButtons] = useState(false)
  const [localSideBarData, setLocalSideBarData] = useState({ "listName": listName, "id": id })

  return (
    <div className='list'>
      <button
        className={showMoreButtons ? 'edit-list-button true' : 'edit-list-button'}
        onClick={() => {
          setShowMoreButtons(!showMoreButtons)
          if (showMoreButtons && localSideBarData.listName && listName !== localSideBarData.listName) {
            nameUpdate(listName, localSideBarData.listName, id)
          }
        }
        }>{showMoreButtons ? '<' : '>'}
      </button>
      {showMoreButtons ?
        <button className='edit-list-button delete-list-button' onClick={() => { setHome(); deleteList(id, listName) }}>x</button> : ""}
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

function Content({ children, handleClick, showAddState, setSelectedList, pageName }) {
  const [focused, setFocused] = useState(false)
  return (
    <div
      tabIndex='-1'
      className='content'
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setSelectedList(pageName)
          if (focused) {
            handleClick(!showAddState)
          }
        }
      }
      }
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {children}
    </div>
  )
}

function LandingPage({ setMainPage, userlists, setSelectedList, saveNewListName }) {
  const [addList, setAddList] = useState(false)
  const [newListName, setNewListName] = useState("")

  return (
    <div className='landing-content-page'>
      {userlists.map((page, index) => <button key={index} className='landing-menu-button' onClick={() => { setMainPage && setMainPage(page.listName); setSelectedList(page.listName) }} >{page.listName}</button>)}
      {addList ?
        <div className='create-list'>
          <input
            autoFocus
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className='create-list-input'
            onBlur={() => {
              if (addList && newListName != "") {
                saveNewListName({ "newListName": newListName, id: crypto.randomUUID(), pageContent: [] })
                setNewListName("")
              }
              setAddList(false)
            }}></input>
        </div> :
        <button className='landing-menu-button' onClick={() => setAddList(true)}><p>Add New List</p></button>}
    </div>
  )
}


