import BoxList from "./BoxList";

const Box = (props) => {
  const { icon, title } = props.config;
  return (
    <div className="card">
      <div className="card-header">
        {icon}
        &nbsp;
        &nbsp;
        {title}
      </div>
      <div className="card-body">
        <BoxList {...props} />
      </div>
    </div>
  )
};

export default Box;
