import React, { useEffect, useState } from 'react';

const Modal = ({ children, stateModal = false }) => {
    const [openModal, setOpenModal] = useState(stateModal);

    useEffect(() => {
        setOpenModal(stateModal);
    }, [stateModal]);

    return (
        <div className={`relative z-10 ${!openModal ? 'hidden' : 'block'}`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Fondo del modal */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    {/* Panel del modal */}
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
