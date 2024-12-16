import React, { useRef, useEffect } from 'react';
import Transition from '../utils/Transition';
import { useDispatch, useSelector } from "react-redux"
import { setModalClose } from '../features/modalSlice';

function Modal({ modalContent }) {
  const dispatch = useDispatch()
  const {  modalData, modalShow, modalId } = useSelector(state=>state.modal)
  const modalContentRef = useRef(null);
    useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!modalShow || modalContentRef?.current.contains(target) || target.type == "button") return 
      dispatch(setModalClose())
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });
  return (
    <>
      {/* Modal backdrop */}
      <Transition
        className="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity"
        show={modalShow}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        aria-hidden="true"
      />
      {/* Modal dialog */}
      <Transition
        id={modalId}
        className="fixed inset-0 z-50 overflow-hidden flex items-start top-20 mb-4 justify-center transform px-4 sm:px-6"
        role="dialog"
        aria-modal="true"
        show={modalShow}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        
          <div ref={modalContentRef} className="bg-white overflow-auto max-w-2xl w-full max-h-[20px] rounded shadow-lg">

          <div className="relative">
            { modalContent }
          </div>
        
        </div>
        
      </Transition>
    </>
  );
}

export default Modal;
