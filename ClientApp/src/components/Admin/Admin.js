import { createSeason } from '../../api/season'

const Admin = () => {

    const createNewSeason = async () => {
        const result = await createSeason({
            year: 2024
        });
        console.log('result', result);
    }
    return <div className="page container py-1">
        <div className="text-center">
            <div className="header-fontSize grey-begin text-shadow-black">Administration Page</div>
        </div>
        <div className="standard-background">
            <div className="button-3D">
                <button type="button" onClick={createNewSeason}>Create Year</button>
            </div>
        </div>
    </div>
}

export default Admin;