import * as React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Grid, Input, Button } from 'semantic-ui-react';
import { BoardColumn } from '../components/board';
import { ITask } from '../lib';

export interface IHomePageProps {
  socket?: SocketIOClient.Socket;
}

const HomePage: React.FC<IHomePageProps> = ({
  socket,
}) => {
  const [load, setLoad] = React.useState(false);
  const [items, setItems] = React.useState<ITask[]>([]);
  const [selected, setSelected] = React.useState<ITask[]>([]);
  const [boardOneText, setBoardOneText] = React.useState<string>("");
  const [boardTwoText, setBoardTwoText] = React.useState<string>("");


  React.useEffect(() => {
    if (socket) {
      socket.emit('getTasks');
    }
  }, [load, socket])

  React.useEffect(() => {
    if (socket) {
      socket.on('tasks', (tasks: ITask[]) => {
        setItems(tasks.filter(a => a.boardId === 'droppable'));
        setSelected(tasks.filter(a => a.boardId === 'droppable2'));
      });
    } 
  }, [socket]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      // TODO: Add reordering
      return;
    } else {
      if (destination.droppableId === "droppable") {
        const newItem = selected.find(a => a.id === draggableId);
        const newItems = [...items];

        if (newItem) {
          newItems.push(newItem);
        }

        setItems(newItems);
        setSelected(selected.filter(a => a.id === draggableId))
      } else {
        const newItem = items.find(a => a.id === draggableId);
        const newItems = [...selected];

        if (newItem) {
          newItems.push(newItem);
        }

        setSelected(newItems);
        setItems(items.filter(a => a.id === draggableId))
      }

      socket?.emit('updateTaskBoard', {id: draggableId, boardId: destination.droppableId });
    }
  };

  const addTaskToBoardOne = () => {
    setLoad(!load);
    socket?.emit('addTask', { content: boardOneText, boardId: 'droppable'});
    setBoardOneText('');
  };

  const addTaskToBoardTwo = () => {
    setLoad(!load);
    socket?.emit('addTask', { content: boardTwoText, boardId: 'droppable2'});
    setBoardTwoText('');
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Grid
        style={{ padding: '15px' }}
      >
        <Grid.Row columns={2}>
          <Grid.Column>
            <h3 style={{color: 'white'}}>List 1</h3>
            <div
              style={{ paddingTop: '5px', paddingBottom: '5px' }}
            >
              <Input 
                value={boardOneText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBoardOneText(e.target.value)}
              />
              <Button color={'green'} type={'button'} onClick={addTaskToBoardOne}>add</Button>
            </div>
            <BoardColumn items={items} droppableId={"droppable"} />
          </Grid.Column>
          <Grid.Column>
            <h3 style={{color: 'white'}}>List 2</h3>
            <div
              style={{ paddingTop: '5px', paddingBottom: '5px' }}
            >
              <Input 
                value={boardTwoText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBoardTwoText(e.target.value)}
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