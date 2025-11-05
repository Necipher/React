// Initialize pkgs
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// Initialize app and uses
const app = express()
app.use(cors());
app.use(express.json())

// Initialize local database and then Loading and Saving data to local database
const DATABASE = path.join(__dirname, "database.json");

function loadData() {
    if (fs.existsSync(DATABASE)) {
        const jsonData = fs.readFileSync(DATABASE, 'utf8');
        return JSON.parse(jsonData);
    } else {
        return { "Home Page": [] }
    }
}

function saveData(dataToSave) {
    fs.writeFileSync(DATABASE, JSON.stringify(dataToSave, null, 2));
}

const siteData = loadData();

// Initialze GET method
app.get('/api', (req, res) => {
    res.json(siteData);
})

app.post('/api', (req, res) => {
    const { forPage, ...dataToSave } = req.body;

    if (!dataToSave.title && !dataToSave.description) {
        res.json("Empty values, data not processed");
        return
    }

    siteData[forPage].push(dataToSave);
    res.json("Data recieved");
    saveData(siteData);
})

app.delete('/api', (req, res) => {
    const { idForDeletion, forPage } = req.body;
    const dataDeleted = siteData[forPage].filter(task => task.id != idForDeletion);
    siteData[forPage] = dataDeleted;

    res.json("Data deleted");
    saveData(siteData);

})

app.put('/api', (req, res) => {
    const { forPage, ...subtituteData } = req.body;
    const replacement = siteData[forPage].map(task => task.id === subtituteData.id ? subtituteData : task)
    siteData[forPage] = replacement

    res.json("Data updated")
    saveData(siteData)
})

app.put('/api:editName', (req, res) => {
    const {oldName, newName, id} = req.body
    if (siteData[oldName].id === id) {
        siteData[newName] = siteData[oldName];
        delete siteData[oldName];
    }

    res.json("List Name Updated")
})


// Initialze listening
const PORT = 8002
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})