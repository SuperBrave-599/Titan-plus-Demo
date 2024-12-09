const CustomRender = (props) => {
    return (
        props.render(props.scope) || (
            <span className="titan-table-item__placeholder">{props.cellEmptyText}</span>
        )
    );
};

export default CustomRender;
