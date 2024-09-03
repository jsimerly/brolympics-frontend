const DataList = ({title, data, card, setOpen}) => {
    return (
        <div className="">
            <h2 className="text-[20px]">
                {title}
            </h2>
            <div>
                {data.length === 0 ? 
                    `No ${title}`
                    :
                    data.map((item, index) => card(item, index, setOpen))
                }
            </div>
        </div>
    );
}

export default DataList;
