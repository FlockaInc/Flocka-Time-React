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
    <div className="modal fade" role="dialog">
      <div className="modal-dialog" role="document">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={toggleModal}
          shouldCloseOnOverlayClick={true}
          style={customStyles}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-black">Modal title</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Modal body text goes here.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary">Save changes</button>
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default AuthModal;