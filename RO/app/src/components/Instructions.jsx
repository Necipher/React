import SectionList from "./SectionList"

const Instructions = ({ recipe }) => {
  return (
    <div className="instructions-page">
      <section className="instructions-banner">
        <h1 className="recipe-name">{recipe.strMeal}</h1>
        <h3 className="recipe-category">{recipe.strCategory}, {recipe.strArea}</h3>
        <section className="instructions-sidebar">
          <img src={recipe.strMealThumb} className="instructions-photo" />
          <YouTubeEmbed link={recipe.strYoutube} />
        </section>
        <section className="instructions-main">
          <SectionList title={"Ingredients:"} items={recipe.ingredients} style="instructions-ingredients" />
          <SectionList title={"Instructions:"} items={recipe.strInstructions} style="instructions-instructions" />
        </section>
      </section>
    </div>
  )
}



export default Instructions


function YouTubeEmbed({ link }) {
  if (!link) return null;

  const videoId = link.split("v=")[1];

  return (
    <div style={{ position: "relative", paddingTop: "56.25%" }}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
