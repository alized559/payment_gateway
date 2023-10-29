import React from 'react';
import styled from 'styled-components';
import { Button, Modal } from 'semantic-ui-react';
import './style.css';

const ThankYouPopup = ({ showPopup, closePopup }) => (
  showPopup &&
    <Modal open={showPopup} onClose={closePopup} className='custom-modal'>
      <Modal.Content>
        <PopupDiv>
          <Paragraph>
            Your Payment was successful! &#128077;
            <br />
            Thank you for your purchase.
            <br />
            <CustomButton type='button' content='Continue Shopping' color='black' onClick={closePopup} />
          </Paragraph>
        </PopupDiv>
      </Modal.Content>
    </Modal>);

const PopupDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px 60px 20px;
`;

const Paragraph = styled.p`
  font-size: 20px;
  font-weight: 500;
  color: #23485B;
  text-align: center;
`;

const CustomButton = styled(Button)`
  margin-top: 20px !important;
`;

export default ThankYouPopup;
