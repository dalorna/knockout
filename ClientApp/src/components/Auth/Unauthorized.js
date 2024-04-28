import { useNavigate } from "react-router-dom"
import React from 'react';

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <div className="container py-1 text-center overflow-auto">
            <div className="text-center">
                <div style={{fontSize: '2em'}}
                     className="grey-begin text-shadow-black">Unauthorized</div>
            </div>
            <br/>
            <div className="p-3 mx-3 mt-1 standard-background">
                <p>You do not have access to the requested page.</p>
                <div className="flex-container">
                    <div className="button-3D">
                        <button onClick={goBack}>Go Back</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Unauthorized