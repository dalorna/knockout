export const Loading = () => {
    return (
        <div className="row justify-content-center mt-4 g-0">
            <div className="col-12 text-center text-primary mt-4">
                <div>Loading...</div>
                <div className="spinner-border text-primary" role="status">
                </div>
            </div>
        </div>
    );
}
export const LoadingOverlay = ({message}) => {
    return (
        <div className="row justify-content-center mt-4 g-0 loadingOverlay">
            <div className="col-12 text-center text-primary mt-4">
                <div style={{marginTop: '15%', fontSize: '2.5em'}} >{message ?? `Loading...`}</div>
                <div className="spinner-border text-primary" style={{zoom: '150%'}} role="status">
                </div>
            </div>
        </div>
    );
}