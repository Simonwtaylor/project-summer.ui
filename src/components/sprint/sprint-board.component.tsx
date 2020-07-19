import * as React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Grid } from 'semantic-ui-react';
import { BoardColumn } from '../board';
import { ISprint, IBoard } from '../../lib';
import { useParams, withRouter, RouteComponentProps } from 'react-router-dom';
import { TaskModalContainer } from '../task';

export interface SprintBoardProps extends RouteComponentProps {
  sprintId: number;
  socket?: SocketIOClient.Socket;
}
 
const SprintBoard: React.FC<SprintBoardProps> = ({
  sprintId,
  socket,
  history,
}) => {
  const [boards, setBoards] = React.useState<IBoard[]>([]);
  const { id } = useParams();

  React.useEffect(() => {
    if (socket) {
      socket.emit('joinSprintRoom', { id: sprintId });
      socket.emit('getSprint', { id: sprintId });
    }
  }, [socket, sprintId])

  React.useEffect(() => {
    socket?.on('sprint', (sprint: ISprint) => {
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
          sprintId: sprintId,
          taskId: draggableId,
          boardId: destination.droppableId,
        }
      );
    }
  };

  const handleAddNewTask = (
    title: string,
    boardId: number,
  ) => {
    socket?.emit('addTask', { sprintId, newTask: { title, boardId: `${boardId}`} });
  };

  const getBoardContent = () => {
    if (!boards) {
      return (<h1>Please select a sprint</h1>);
    }

    boards.sort((a,b) => { return a.order-b.order});

    return boards.map(({ tasks: boardTasks, name, id }: IBoard) => {
      return (
        <BoardColumn
          name={name}
          items={boardTasks}
          droppableId={`${id}`}
          key={`boardid${id}`}
          onAddNewTask={handleAddNewTask}
        />
      )
    }) 
  };

  const handleTaskModalClose = () => {
    socket?.emit('getSprint', { id: sprintId });
  };

  const getModal = () => {
    if (id) {
      return (
       <TaskModalContainer
          id={+id}
          socket={socket}
          onClose={handleTaskModalClose}
       />
      )
    }
    return <></>;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Grid
        style={{ padding: '15px' }}
      >
        {getModal()}
        <Grid.Row columns={4}>
          {getBoardContent()}
        </Grid.Row>
      </Grid>
    </DragDropContext>
  );
}
 
export default withRouter(SprintBoard);