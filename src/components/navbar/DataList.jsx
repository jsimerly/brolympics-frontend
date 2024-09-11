const DataList = ({ title, data, card, setOpen }) => {
  return (
    <div className="">
      <h2 className="mb-4 header-3 text-primary">{title}</h2>
      <div className="space-y-4">
        {data.length === 0 ? (
          <p className="text-muted">No {title}</p>
        ) : (
          data.map((item, index) => card(item, index, setOpen))
        )}
      </div>
    </div>
  );
};

export default DataList;
