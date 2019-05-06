import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

import ns from '../../utilities/notificationService';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '450px',
    minWidth: '350px',
    padding: 0
  }
};

function AuthModal() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    ns.addObserver('AUTH_MODAL_TOGGLE', this, toggleModal);
    Modal.setAppElement('body');

    return () => {
      ns.removeObserver(this, 'AUTH_MODAL_TOGGLE')
    }
  });

  function toggleModal() {
    setModalIsOpen(!modalIsOpen);
  }

  return (
    <div className="modal fade" id='sign-in-form'>
      <div className="modal-dialog modal-dialog-centered">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={toggleModal}
          shouldCloseOnOverlayClick={true}
          style={customStyles}
        >
          <div className="modal-content">
            <div className="modal-body">
              
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default AuthModal;