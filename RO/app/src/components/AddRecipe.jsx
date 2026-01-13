import { useState } from "react"

const AddRecipe = ({ changeState, action }) => {
    const [newRecipe, setNewRecipe] = useState({ "strMeal": "", "favorite": false, "ingredients": [{ "ingredient": "", "measurement": "" }], "instructions": [""] })
    const [newImage, setNewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);


    function uploadImage(e) {
        const file = e.target.files[0]
        setImageFile(file)
        setNewImage(URL.createObjectURL(file))
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (newRecipe.strMeal !== "" && newRecipe.ingredients[0].ingredient !== "" && newRecipe.instructions[0] !== "") {
            const recipeToAdd = { "idMeal": crypto.randomUUID(), ...newRecipe }
            if (imageFile) {
                const base64Image = await convertToBase64(imageFile);
                recipeToAdd.strMealThumb = base64Image;
            }

            action.addRecipeToServer(recipeToAdd)

            setNewRecipe({ "strMeal": "", "ingredients": [{ "ingredient": "", "measurement": "" }], "instructions": [""] })
            setNewImage(null)
            setImageFile(null)
            changeState.setShowOverlay(false)
        } else {
            window.alert("All fields need to be filled out and a picture needs to be included")
        }
    }

    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    return (
        <div
            tabIndex="-1"
            className="add-recipe-container"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files[0];
                setImageFile(file);
                setNewImage(URL.createObjectURL(file));
            }}
        >
            <button className="round-button exit" onClick={() => changeState.setShowOverlay(false)}>x</button>

            <form
                id="addRecipeId"
                className="add-form"
                onSubmit={handleSubmit}
            >
                <label className="add-recipe-label">
                    {newImage ? <img className="add-picture" src={newImage} /> : <h3>Upload Image</h3>}
                    <input type="file" className="file" onChange={uploadImage} />
                </label>

                <section>
                    <h3>Recipe name:</h3>
                    <input autoFocus type="text" value={newRecipe.strMeal} onChange={(e) => setNewRecipe(prev => ({ ...prev, "strMeal": e.target.value }))} />
                </section>

                <section className="add-ingredients">
                    <h3>Ingredients:</h3>
                    {newRecipe.ingredients.map(
                        (item, index) =>
                            <section key={index} className="ingrs">
                                <input className="ingr" type="text" value={item.ingredient} onChange={(e) => {
                                    const updatedIngredients = [...newRecipe.ingredients];
                                    updatedIngredients[index].ingredient = e.target.value
                                    setNewRecipe(prev => ({ ...prev, ingredients: updatedIngredients }));
                                }
                                } />
                                <input className="msr" type="text" value={item.measurement} onChange={(e) => {
                                    const updatedIngredients = [...newRecipe.ingredients];
                                    updatedIngredients[index].measurement = e.target.value
                                    setNewRecipe(prev => ({ ...prev, ingredients: updatedIngredients }));
                                }
                                } />
                            </section>
                    )}
                    <button onClick={(e) => {
                        e.preventDefault();
                        setNewRecipe(prev => ({ ...prev, "ingredients": [...prev.ingredients, { "ingredient": "", "measurement": "" }] }))
                    }}>Add Ingredient</button>
                </section>

                <section className="add-instructions">
                    <h3>Instructions:</h3>
                    {newRecipe.instructions.map(
                        (instruction, index) =>
                            <input key={index} type="text" value={instruction} onChange={(e) => {
                                const updatedInstructions = [...newRecipe.instructions];
                                updatedInstructions[index] = e.target.value;
                                setNewRecipe(prev => ({ ...prev, "instructions": updatedInstructions }))
                            }
                            } />)}
                    <button onClick={(e) => {
                        e.preventDefault();
                        setNewRecipe(prev => ({ ...prev, "instructions": [...prev.instructions, ""] }));
                    }}>Add Instruction</button>
                </section>


            </form>
            <button type="submit" form="addRecipeId" className="submit-button round-elongated-button">Add Recipe</button>
        </div>
    )
}

export default AddRecipe