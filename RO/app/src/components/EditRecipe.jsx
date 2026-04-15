import { useState } from 'react'
import { useRevalidator } from "react-router-dom"
import { useNavigate } from 'react-router-dom';

const EditRecipe = ({ data, changeState, action }) => {
  const navigate = useNavigate()
  const revalidator = useRevalidator();
  const [newRecipe, setNewRecipe] = useState({ "idMeal": data.idMeal, "strMeal": data.strMeal, "favorite": data.favorite, "ingredients": [...data.ingredients], "strInstructions": [...data.strInstructions], "strMealThumb": data.strMealThumb })
  const [newImage, setNewImage] = useState(null);
  const [imageFile, setImageFile] = useState(data?.strMealThumb);

  function handleSubmit(e) {
    e.preventDefault();
    if (newRecipe.strMeal !== "" && newRecipe.ingredients[0].ingredient !== "" && newRecipe.strInstructions[0] !== "") {
      action.changeRecipe(newRecipe, newRecipe.idMeal)
      revalidator.revalidate()
      changeState.setShowEdit(false)
      navigate('/') /* Forces a refresh */
    }
  }

  function handleDelete(e) {
    e.preventDefault();
    action.deleteRecipe(newRecipe.idMeal)
    revalidator.revalidate()
    changeState.setShowEdit(false)
  }

  return (
    <div
      tabIndex="-1"
      className='add-recipe-container'
      onDragOver={(e) => e.preventDefault()}
    >
      <button className='round-button exit' onClick={() => changeState.setShowEdit(false)}>X</button>
      <form
        id='editRecipeId'
        className='add-form'
        onSubmit={handleSubmit}
      >
        <label className='add-recipe-label'>
          {imageFile ? <img className="add-picture" src={imageFile} /> : <h3>Upload Image</h3>}
          <input type='file' className='file' />
        </label>

        <section>
          <h3>Recipe name:</h3>
          <input autofocus type='text' value={newRecipe.strMeal} onChange={(e) => setNewRecipe(prev => ({ ...prev, "strMeal": e.target.value }))} />
        </section>

        <section className='add-ingredients'>
          <h3>Ingredients:</h3>
          {newRecipe.ingredients.map(
            (item, index) =>
              <div key={index} className='ingrs'>
                <button style={{ marginRight: "10px" }} onClick={(e) => {
                  e.preventDefault();
                  setNewRecipe(prev => ({ ...prev, "ingredients": prev.ingredients.filter((_, i) => i !== index) }))
                }} >X</button>
                <input className='ingr' type='text' value={item.ingredient} onChange={(e) => {
                  const updatedIngredients = [...newRecipe.ingredients];
                  updatedIngredients[index].ingredient = e.target.value
                  setNewRecipe(prev => ({ ...prev, ingredients: updatedIngredients }));
                }} />
                <input className='msr' type='text' value={item.measurement} onChange={(e) => {
                  const updatedIngredients = [...newRecipe.ingredients];
                  updatedIngredients[index].measurement = e.target.value;
                  setNewRecipe(prev => ({ ...prev, ingredients: updatedIngredients }));
                }}
                />
              </div>
          )}
          <button onClick={(e) => {
            e.preventDefault();
            setNewRecipe(prev => ({ ...prev, "ingredients": [...prev.ingredients, { "ingredient": "", "measurement": "" }] }))
          }}>Add Ingredient</button>
        </section>
        <section className='add-instructions'>
          <h3>Instructions:</h3>

          {newRecipe.strInstructions.map((instruction, index) =>
            <div>
              <button style={{ marginRight: "10px" }} onClick={(e) => {
                e.preventDefault();
                setNewRecipe(prev => ({ ...prev, "strInstructions": prev.strInstructions.filter((_, i) => i !== index) }))
              }}>X</button>
              <input key={index} type='text' value={instruction} onChange={(e) => {
                const updatedInstructions = [...newRecipe.strInstructions];
                updatedInstructions[index] = e.target.value;
                setNewRecipe(prev => ({ ...prev, "strInstructions": updatedInstructions }))
              }}
              />
            </div>
          )}

          <button onClick={(e) => {
            e.preventDefault();
            setNewRecipe(prev => ({ ...prev, "strInstructions": [...prev.strInstructions, ""] }));
          }}>Add Instruction</button>
        </section>
      </form>
      <section style={{ width: "90%", display: "flex", justifyContent: "space-between" }}>
        <button className="submit-button round-elongated-button" onClick={handleDelete}>Delete Recipe</button>
        <button type="submit" form="editRecipeId" className="submit-button round-elongated-button">Confirm Edit</button>
      </section>
    </div>
  )
}

export default EditRecipe
