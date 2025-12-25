// Reusable function for Middle section in CardItem
function SectionList({ title, items, style = 'ingredients' }) {
    return (
        <section className={style}>
            <p className='title-section'>{title}</p>
            <div className={'items-section'}>
                <ul>{items.map((item, idx) =>
                item.ingredient ?
                    <li className='ingredient' key={idx}><p>{item.ingredient}</p><p>{item.measurement}</p></li> :
                    <li className='instruction' key={idx}><p>{item}</p></li>
                )}</ul>
            </div>
        </section>
    )
}

export default SectionList
