import {useModalInstance} from '../../utils/simpleModal';
import {useImperativeHandle, useState } from 'react';
import toast from 'react-hot-toast';
import {createSeason} from '../../api/season';

export const CreateNewSeasonModal = ({actionsRef}) => {
    const [modal, modalRef] = useModalInstance();
    const [season, setSeason] = useState(null);


    useImperativeHandle(
        actionsRef,
        () => ({
            show: (details) => {
                setSeason(details.season);
                modal.show();
            },
            hide: () => modal.hide(),
        }),
        [modal]
    );

    const createNewSeason = async () => {
        if(season) {
            try {
                await createSeason({
                    year: season.year + 1
                });
                // after submit needs to update ddl in admin
                modal.hide();
                toast.success('Current Season changes');
            } catch (err) {
                toast.error(err?.message ?? err);
            }
        }
    }

    return (
        <div className="modal fade" tabIndex="-1" ref={modalRef}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{width: '500px'}}>
                    <div className="modal-header text-primary-emphasis bg-dark-subtle justify-content-center">
                        Create New Season
                    </div>
                    <div className="modal-body">
                        {
                            `Create new season for ${season ? season.year + 1 : ''}`
                        }
                    </div>
                    <div className="modal-footer bg-dark-subtle flex-container">

                        <div className="button-3D">
                            <button type="button"
                                    data-bs-dismiss="modal"
                                    aria-label="Close">
                                Cancel
                            </button>
                        </div>
                        <div className="button-3D">
                            <button type="submit"
                                    onClick={createNewSeason}>Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
