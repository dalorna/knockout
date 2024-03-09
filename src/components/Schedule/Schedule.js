const Schedule = () => {
    return <div className="page container py-4 py-sm-5">
        <h4>Schedule</h4>
        <div className="p-3 shadow-sm rounded bg-white mx-3 mt-5">
            <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1"/>
                <label className="form-check-label" htmlFor="inlineCheckbox1">1</label>
            </div>
            <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" id="inlineCheckbox2" value="option2"/>
                <label className="form-check-label" htmlFor="inlineCheckbox2">2</label>
            </div>
            <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" id="inlineCheckbox3" value="option3" disabled/>
                <label className="form-check-label" htmlFor="inlineCheckbox3">3 (disabled)</label>
            </div>
        </div>
    </div>
}
export default Schedule;