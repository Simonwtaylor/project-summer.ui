import * as React from 'react';

export interface IHomePageProps {
  socket?: SocketIOClient.Socket;
}

const HomePage: React.FC<IHomePageProps> = ({
  socket,
}) => {
  return <h1>Hello World</h1>;
};

export default HomePage;
