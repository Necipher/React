import { useOutletContext } from 'react-router-dom'
import Banner from '../components/Banner'
import Content from '../components/Content'
import PageButtons from '../components/PageButtons'
import Cards from '../components/Cards'

const Searched = () => {
    const { state, paginated, changeState, action } = useOutletContext()


    return (
        <div>
            <Banner
                state={state}
                action={action}
                data={state.isLoading ? null : state.siteData}
            />
            <div className={state.displayCards ? 'main-vertical' : 'main-horizontal'} style={{ marginTop: "50px" }}>
                <Cards
                    action={action}
                    data={state.searchResults.map(item => item.item)}
                    state={state}
                    user={true}
                    changeState={changeState}
                />
            </div>
        </div>
    )
}

export default Searched
