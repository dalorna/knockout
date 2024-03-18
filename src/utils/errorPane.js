import { BsXCircle } from 'react-icons/bs';

const ErrorPane = ({ heading = 'Something went wrong', subheading }) => {
    return (
        <div className="container-fluid py-4 py-sm-5">
            <div className="row p-3 shadow-sm rounded bg-white">
                <div className="col">
                    <ErrorDisplay heading={heading} subheading={subheading} />
                </div>
            </div>
        </div>
    );
};

export const ErrorDisplay = ({ heading = 'Something went wrong', subheading }) => {
    return (
        <div className="row my-3">
            <div className="col-auto">
                <BsXCircle style={{ fontSize: '3em' }} className="text-secondary" />
            </div>
            <div className="col">
                <h2>{heading}</h2>
                <p className="mb-0">{subheading}</p>
            </div>
        </div>
    );
};

export const PageNotFound = () => (
    <ErrorPane heading="Page Not Found" subheading="Please check the URL or select an option from the menu." />
);

export const NotFound = () => <ErrorPane heading="Not Found" />;

export default ErrorPane;
