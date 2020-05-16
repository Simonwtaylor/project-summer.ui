import * as React from 'react';
import io from 'socket.io-client';
import { Socket } from 'socket.io';

export interface IndexPageProps { }

const IndexPage: React.FC<IndexPageProps> = () => {

  const socket: Socket = io('http://localhost:3001');

  socket.on('tasks', (tasks) => {
    console.log(tasks);
  })

  return (
    <>
    </>
  );
}
 
export default IndexPage;