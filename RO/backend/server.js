const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DATABASE = path.join(__dirname, "database.json");

function loadData() {
    if (fs.existsSync(DATABASE)) {
        return JSON.parse(fs.readFileSync(DATABASE, "utf8"));
    } else {
        console.log("Failed initialize data");
    }
}

function saveData(dataToSave) {
    fs.writeFileSync(DATABASE, JSON.stringify(dataToSave, null, 2));
}

const siteData = loadData();

app.get('/api/fetchData', (req, res) => {
    res.json(siteData);
})

app.put('/api/sendToServer', (req, res) => {
    const { favorite, id } = req.body;
    siteData.library = siteData.library.map(recipe => recipe.idMeal === id ? {...recipe, favorite} : recipe)
    saveData(siteData)
    res.json('Data updated')
})

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})

