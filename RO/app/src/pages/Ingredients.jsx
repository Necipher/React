import { useOutletContext } from "react-router-dom"

const Ingredients = () => {
  const { siteData } = useOutletContext()

  return (
    <>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", width: "90vw", margin: "50px auto" }}>
        {siteData?.ings?.map(a => <QuickCard input={a} />)}
      </div>
    </>
  )
}

export default Ingredients


function QuickCard({ input }) {
  return (
    <div style={{ width: "100px", height: "100px", border: "1px solid black", borderRadius: "10px", justifyContent: "center", alignItems: "center" }}>
      {input}
    </div>
  )
}