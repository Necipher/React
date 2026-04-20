import { useState } from "react"
import { useRevalidator } from "react-router-dom"

const AddRecipe = ({ changeState, action }) => {
    const revalidator = useRevalidator();
    const [newRecipe, setNewRecipe] = useState({ "strMeal": "", "strYoutube": "", "favorite": false, "ingredients": [{ "ingredient": "", "measurement": "" }], "strInstructions": [""] })
    const [newImage, setNewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]) /* create a function for this  */


    function uploadImage(e) {
        const file = e.target.files[0]
        setImageFile(file)
        setNewImage(URL.createObjectURL(file))
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (newRecipe.strMeal !== "" && newRecipe.ingredients[0].ingredient !== "" && newRecipe.strInstructions[0] !== "") {
            const recipeToAdd = { "idMeal": crypto.randomUUID(), ...newRecipe }
            if (imageFile) {
                const base64Image = await convertToBase64(imageFile);
                recipeToAdd.strMealThumb = base64Image;
            }

            await action.addRecipeToServer(recipeToAdd)
            revalidator.revalidate()

            setNewRecipe({ "strMeal": "", "ingredients": [{ "ingredient": "", "measurement": "" }], "strInstructions": [""] })
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

    function validateYoutube(e) {
        const value = e.target.value;

        const isValid =
            value.includes("youtube.com") || value.includes("youtu.be");

        if (!isValid && value !== "") {
            setNewRecipe(prev => ({ ...prev, "strYoutube": "" }))
            alert("Please enter a valid YouTube link");
        }
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

                <section>
                    <h3>(optional)Youtube video link:</h3>
                    <input style={{ fontSize: "0.7rem", width: "120%", position: "relative", left: "-10%" }}
                        type="text" value={newRecipe.strYoutube}
                        onChange={(e) => setNewRecipe(prev => ({ ...prev, "strYoutube": e.target.value }))}
                        onBlur={validateYoutube}
                    />
                </section>

                <section className="add-ingredients">
                    <h3>Ingredients:</h3>
                    {newRecipe.ingredients.map(
                        (item, index) =>
                            <section key={index} className="ingrs">
                                <button style={{ marginRight: "10px" }} onClick={(e) => {
                                    e.preventDefault();
                                    setNewRecipe(prev => ({ ...prev, "ingredients": prev.ingredients.filter((_, i) => i !== index) }))
                                }} >X</button>
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
                    {newRecipe.strInstructions.map(
                        (instruction, index) =>
                            <div>
                                <button style={{ marginRight: "10px" }} onClick={(e) => {
                                    e.preventDefault();
                                    setNewRecipe(prev => ({ ...prev, "strInstructions": prev.strInstructions.filter((_, i) => i !== index) }))
                                }}>X</button>
                                <input key={index} type="text" value={instruction} onChange={(e) => {
                                    const updatedInstructions = [...newRecipe.strInstructions];
                                    updatedInstructions[index] = e.target.value;
                                    setNewRecipe(prev => ({ ...prev, "strInstructions": updatedInstructions }))
                                }
                                } />
                            </div>
                    )}
                    <button onClick={(e) => {
                        e.preventDefault();
                        setNewRecipe(prev => ({ ...prev, "strInstructions": [...prev.strInstructions, ""] }));
                    }}>Add Instruction</button>
                </section>


            </form>
            <button type="submit" form="addRecipeId" className="submit-button round-elongated-button">Add Recipe</button>
        </div>
    )
}

export default AddRecipe