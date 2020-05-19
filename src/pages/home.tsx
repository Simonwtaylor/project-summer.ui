import * as React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import socketIOClient from 'socket.io-client';
import { Grid, Input, Button } from 'semantic-ui-react';
import { BoardColumn } from '../components/board';

export interface IHomePageProps {
  
}

const socket: SocketIOClient.Socket = socketIOClient('http://localhost:3001');

const HomePage: React.FC<IHomePageProps> = () => {
  const [load, setLoad] = React.useState(false);
  const [items, setItems] = React.useState<any[]>([]);
  const [selected, setSelected] = React.useState<any[]>([]);
  const [boardOneText, setBoardOneText] = React.useState<string>("");
  const [boardTwoText, setBoardTwoText] = React.useState<string>("");


  React.useEffect(() => {
    socket.emit('getTasks');
  }, [load])

  React.useEffect(() => {
    socket.on('tasks', (tasks: any[]) => {
      console.log(tasks);
      setItems(tasks.filter(a => a.boardId === 'droppable'));
      setSelected(tasks.filter(a => a.boardId === 'droppable2'));
    });
  }, []);

  const onDragEnd = (result: any) => {
    const { source, destination, draggableId } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      // TODO: Add reordering
      return;
    } else {
      socket.emit('updateTaskBoard', {id: draggableId, boardId: destination.droppableId });
    }
  };

  const addTaskToBoardOne = () => {
    setLoad(!load);
    console.log('clicked 1')
    console.log(socket);
    socket.emit('addTask', { content: boardOneText, boardId: 'droppable'});
    setBoardOneText('');
  };

  const addTaskToBoardTwo = () => {
    setLoad(!load);
    console.log('clicked 2')
    socket.emit('addTask', { content: boardTwoText, boardId: 'droppable2'});
    setBoardTwoText('');
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Grid
        style={{ padding: '15px' }}
      >
        <Grid.Row columns={2}>
          <Grid.Column>
            <h3>List 1</h3>
            <div
              style={{ paddingTop: '5px', paddingBottom: '5px' }}
            >
              <Input 
                value={boardOneText}
                onChange={(e: any) => setBoardOneText(e.target.value)}
              />
              <Button color={'green'} type={'button'} onClick={addTaskToBoardOne}>add</Button>
            </div>
            <BoardColumn items={items} droppableId={"droppable"} />
          </Grid.Column>
          <Grid.Column>
            <h3>List 2</h3>
            <div
              style={{ paddingTop: '5px', paddingBottom: '5px' }}
            >
              <Input 
                value={boardTwoText}
                onChange={(e: any) => setBoardTwoText(e.target.value)}
              />
              <Button color={'green'} type={'button'} onClick={addTaskToBoardTwo}>add</Button>
            </div>
            <BoardColumn items={selected} droppableId={"droppable2"} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </DragDropContext>
  );
}
 
export default HomePage;