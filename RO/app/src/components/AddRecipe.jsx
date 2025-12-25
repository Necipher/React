import { useState } from "react"

const AddRecipe = ({ changeState }) => {
    const [newRecipe, setNewRecipe] = useState({ "name": "", "ingredients": [""], "instructions": [""] })

    return (
        <div
            tabIndex="-1"
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                    changeState.setShowOverlay(false)
                }
            }}
            className="add-recipe-container">
            <form className="add-form">
                <img className="add-picture" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDGoVJol40LBgDyiNh5XRKXx1Edaz1o98pmg&s" />
                <h3>Recipe name:</h3>
                <input autoFocus type="text" value={newRecipe.name} onChange={(e) => setNewRecipe(prev => ({ ...prev, "name": e.target.value }))} />
                <section className="add-ingredients">
                    <h3>Ingredients:</h3>
                    {newRecipe.ingredients.map(
                        (ingredient, index) =>
                            <input key={index} type="text" value={ingredient} onChange={(e) => {
                                const updatedIngredients = [...newRecipe.ingredients]
                                updatedIngredients[index] = e.target.value;
                                setNewRecipe(prev => ({ ...prev, "ingredients": updatedIngredients }))
                            }
                            } />)}
                    <button onClick={(e) => {
                        e.preventDefault();
                        setNewRecipe(prev => ({ ...prev, "ingredients": [...prev.ingredients, ""] }))
                    }}>+</button>
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
                    }}>+</button>
                </section>

            </form>
        </div>
    )
}

export default AddRecipe