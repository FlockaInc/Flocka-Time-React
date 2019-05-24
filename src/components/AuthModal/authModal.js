import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import AuthForm from '../Forms/authForm';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

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
              <button type="button" className="close" onClick={toggleModal} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <Tabs>
                <TabList>
                  <Tab>Sign In</Tab>
                  <Tab>Sign Up</Tab>
                </TabList>

                <TabPanel>
                  <AuthForm authType='signin' />
                </TabPanel>
                <TabPanel>
                  <AuthForm authType='signup' />
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default AuthModal;