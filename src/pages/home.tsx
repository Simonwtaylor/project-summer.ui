import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import { UserDashboardContainer } from '../components/index';

export interface IHomePageProps {
  socket?: SocketIOClient.Socket;
}

const homePage: React.FC<IHomePageProps> = ({
  socket,
}) => {
  return (
    <div className={'home page'}>
      <h1>Your Dashboard</h1>
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <UserDashboardContainer socket={socket} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default homePage;
