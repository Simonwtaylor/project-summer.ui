import * as React from 'react';
import { Modal } from 'semantic-ui-react';

export interface AddSprintProps {
  
}
 
const AddSprint: React.FC<AddSprintProps> = () => {
  return (
    <Modal centered={false} open={true} onClose={() => console.log()}>
    <Modal.Header>
      
    </Modal.Header>
    <Modal.Content>
      <Modal.Description>
      </Modal.Description>
    </Modal.Content>
  </Modal>
  );
}

export default AddSprint;