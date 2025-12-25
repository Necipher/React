import { useOutletContext } from 'react-router-dom'
import Banner from '../components/Banner'
import Content from '../components/Content'


const Home = () => {
  const { state, changeState, action } = useOutletContext()

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
      />
    </div>
  )
}

export default Home