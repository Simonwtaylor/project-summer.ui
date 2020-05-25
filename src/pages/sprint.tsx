import * as React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Grid } from 'semantic-ui-react';
import { BoardColumn } from '../components/board';
import { ISprint, IBoard } from '../lib';

export interface ISprintPageProps {
  socket?: SocketIOClient.Socket;
}

const SprintPage: React.FC<ISprintPageProps> = ({
  socket,
}) => {
  const [boards, setBoards] = React.useState<IBoard[]>([]);
  
  React.useEffect(() => {
    if (socket) {
      socket.emit('joinSprintRoom', { id: 1 });
      socket.emit('getSprint', { id: 1 });
    }
  }, [socket])

  React.useEffect(() => {
    socket?.on('sprint', (sprint: ISprint) => {
      console.log("woop")
      setBoards(sprint.boards);
    });
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
      
      const boardsToEdit = [...boards];
      const board = boardsToEdit
      .find(
        a => a.id === +source.droppableId
      );

      const taskToAdd = board?.tasks.find(a => a.id === draggableId);
      
      const removeFrom = board?.tasks
      .findIndex(
        a => a.id === draggableId,
      );

      if (removeFrom) {
        boardsToEdit.find(
          a => a.id === +source.droppableId
        )?.tasks
        .splice(
          removeFrom, 1
        );
      }

      if (taskToAdd) {
        boardsToEdit.find(a => a.id === +destination.droppableId)?.tasks.push(taskToAdd);
      }

      socket?.emit('updateTaskBoardBySprint',
        {
          sprintId: 1,
          taskId: draggableId,
          boardId: destination.droppableId,
        }
      );
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Grid
        style={{ padding: '15px' }}
      >
        <Grid.Row columns={4}>
          {
            boards.map(({ tasks: boardTasks, name, id }: any) => {
              return (
                <Grid.Column>
                  <h3 style={{color: 'white'}}>{name}</h3>
                  <BoardColumn items={boardTasks} droppableId={`${id}`} key={`boardid${id}`} />
                </Grid.Column>
              )
            })
          }
        </Grid.Row>
      </Grid>
    </DragDropContext>
  );
}
 
export default SprintPage;
