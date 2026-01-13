import { useSearchParams } from "react-router-dom"

const PageButtons = ({ pages }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const currentPage = parseInt(searchParams.get('page')) || 1;

    const buttons = []

    for (let i = 1; i <= pages; i++) {
        buttons.push(i)
    }

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage });
    }

    return (
        <div className='page-numbers'>
            {buttons.map(pageNr => (
                <button
                key={pageNr}
                onClick={() => handlePageChange(pageNr)}
                className={currentPage === pageNr ? 'selected' : ''
                }
                >
                    {pageNr}
                </button>))}
        </div>
    )
}

export default PageButtons
