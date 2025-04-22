import { updateUserStatus } from '@/src/api/data/user';
import React, { Dispatch, SetStateAction } from 'react';

type modalProps = {
    modal: [number, string] | null;
    setModal: Dispatch<SetStateAction<[number, string] | null>>;
    fetch: () => void;
};
export default function Modal({ fetch, setModal, modal }: modalProps) {
    const [id, status] = modal ?? [0, ''];
    if (status == 'active')
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg w-4/5 max-w-[667px]">
                    <h2 className="text-3xl font-medium mb-4 text-center">Ban User</h2>
                    <p className="text-base font-light pt-2.5 px-7 flex flex-column text-center justify-center opacity-50">
                        Are you sure you want to ban this user from the system?
                    </p>
                    <p className="text-base font-light px-7 flex flex-column text-center justify-center opacity-50">
                        Banning this user will also make their properties unavailable for reservation.
                    </p>
                    <div className="flex justify-end gap-2 mt-5 py-5 border-t border-slate-300">
                        <button
                            className="bg-gray-50 border-gray-700 border text-gray-700 px-4 py-2 rounded-lg w-1/2"
                            onClick={() => setModal(null)}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-red-50 border-red-700 border text-red-700 px-4 py-2 rounded-lg w-1/2"
                            onClick={async () => {
                                await updateUserStatus(id, 'banned');
                                setModal(null);
                                fetch();
                            }}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        );
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-4/5 max-w-[667px]">
                <h2 className="text-3xl font-medium mb-4 text-center">Activate User</h2>
                <p className="text-base font-light pt-2.5 px-7 flex flex-column text-center justify-center opacity-50">
                    Are you sure you want to activate this user from the system?
                </p>
                <p className="text-base font-light px-7 flex flex-column text-center justify-center opacity-50">
                    Activate this user will also make their properties available for reservation.
                </p>
                <div className="flex justify-end gap-2 mt-5 py-5 border-t border-slate-300">
                    <button
                        className="bg-gray-50 border-gray-700 border text-gray-700 px-4 py-2 rounded-lg w-1/2"
                        onClick={() => setModal(null)}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-green-50 border-green-700 border text-green-700 px-4 py-2 rounded-lg w-1/2"
                        onClick={async () => {
                            await updateUserStatus(id, 'active');
                            setModal(null);
                            fetch();
                        }}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
