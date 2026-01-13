import { useOutletContext } from 'react-router-dom'
import Banner from '../components/Banner'
import Content from '../components/Content'
import PageButtons from '../components/PageButtons'


const Home = () => {
  const { state, paginated, changeState, action } = useOutletContext()

  return (
    <div>
      <Banner
        state={state}
        action={action}
        data={state.isLoading ? null : state.siteData}
      />
      <Content
        state={state}
        action={action}
        data={state.isLoading ? null : state.siteData}
        paginatedData={paginated}
      />
      <PageButtons
        pages={paginated.totalPages}
      />
    </div>
  )
}

export default Home