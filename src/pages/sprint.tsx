import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentSprint } from '../redux/sprint/sprint.selector';
import { Grid } from 'semantic-ui-react';
import { SprintBoard } from '../components/sprint';


export interface ISprintPageProps {
  socket?: SocketIOClient.Socket;
}

const SprintPage: React.FC<ISprintPageProps> = ({
  socket,
}) => {

  const currentSprint = useSelector(selectCurrentSprint);
  
  if (!currentSprint) {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <h3
              style={{color: 'white', textAlign: 'center', margin: '30px'}}
            >
              Please select a sprint
            </h3>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  return (
    <SprintBoard
      socket={socket}
      sprintId={currentSprint.id}
    />
  )
}
 
export default SprintPage;
