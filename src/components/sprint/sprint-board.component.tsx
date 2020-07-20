import * as React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import { selectCurrentSprint } from '../../redux/sprint/sprint.selector';
import { Grid, Label, Icon } from 'semantic-ui-react';
import { BoardColumn } from '../board';
import { ISprint, IBoard, ITask } from '../../lib';
import { DateService } from '../../lib/services/date.service';
import { useParams } from 'react-router-dom';
import { TaskModalContainer } from '../task';

export interface SprintBoardProps {
  sprintId: number;
  socket?: SocketIOClient.Socket;
}
 
const SprintBoard: React.FC<SprintBoardProps> = ({
  sprintId,
  socket,
}) => {
  const [boards, setBoards] = React.useState<IBoard[]>([]);
  const { id } = useParams();
  const currentSprint = useSelector(selectCurrentSprint);

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

  const getDaysLeft = () => {
    if (currentSprint) {
      const { endDate } = currentSprint;
      const a = new Date();
      const b = new Date(endDate);
      const difference = DateService.getDaysDifference(a, b);

      return (
        <Label as='a' color='blue' icon={true}>
          <Icon name={'calendar check'} />
          {difference}
          <Label.Detail>Days left</Label.Detail>
        </Label>
      );
    }

    return <></>;
  };

  const calculatePoints = () => {
    if (!currentSprint) {
      return <></>;
    }

    let points = 0;

    currentSprint?.boards.forEach((board: IBoard) => {
      board.tasks
        .filter(a => !a.completed)
        .forEach((task: ITask) => points += task.storyPoints || 0);
    });

    return (
      <Label as='a' color='teal' icon={true}>
        <Icon name={'gamepad'} />
        {points}
        <Label.Detail>Points</Label.Detail>
      </Label>
    );
  };


  return (
    <>
      <Grid
        style={{ padding: '15px', color: 'white', borderBottom: '1px solid white' }}
      >
        <Grid.Row columns={1}>
          <Grid.Column width={5}>
            <h2>{currentSprint.name}</h2>
            {getDaysLeft()}
            {calculatePoints()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
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
    </>
  );
}
 
export default SprintBoard;