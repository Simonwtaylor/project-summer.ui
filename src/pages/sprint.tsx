import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentSprint } from '../redux/index';
import { Grid } from 'semantic-ui-react';
import { SprintBoard } from '../components/sprint';
import { ROUTER_ENUMS } from '../lib/enums';
import { ITask } from '../lib';

export interface ISprintPageProps {
  socket?: SocketIOClient.Socket;
  sprintState: ROUTER_ENUMS;
}

const SprintPage: React.FC<ISprintPageProps> = ({
  socket,
  sprintState,
}) => {

  const currentSprint = useSelector(selectCurrentSprint);
  
  if (!currentSprint) {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <h3
              style={{ textAlign: 'center', margin: '30px' }}
            >
              Please select a sprint
            </h3>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return (
    <SprintBoard
      socket={socket}
      sprintId={currentSprint.id}
      sprintState={sprintState}
    />
  );
}
 
export default SprintPage;
