const Members = ({currentSelectedLeague}) => {
    console.log('currentSelectedLeague', currentSelectedLeague);
    return <div className="page container py-4 py-sm-5">
        <h2>Members</h2>

        <button type="button" className="btn btn-secondary"
             data-bs-toggle="tooltip" data-bs-placement="top"
             data-bs-custom-class="custom-tooltip"
             title="This top tooltip is themed via CSS variables.">
            Custom tooltip
        </button>
        <button type="button" className="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top"
                title="Tooltip on top">
            Tooltip on top
        </button>
        <button type="button" className="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="right"
                title="Tooltip on right">
            Tooltip on right
        </button>
        <button type="button" className="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="bottom"
                title="Tooltip on bottom">
            Tooltip on bottom
        </button>
        <button type="button" className="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="left"
                title="Tooltip on left">
            Tooltip on left
        </button>
    </div>
}

export default Members;