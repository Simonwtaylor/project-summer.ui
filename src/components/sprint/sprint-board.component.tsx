import * as React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import { selectCurrentSprint } from '../../redux/sprint/sprint.selector';
import { Grid, Label, Icon } from 'semantic-ui-react';
import { BoardColumn } from '../board';
import { ISprint, IBoard, ITask } from '../../lib';
import { ROUTER_ENUMS } from '../../lib/enums/router.enums';
import { DateService } from '../../lib/services/date.service';
import Comments from '../comments/comments.component';
import { useParams } from 'react-router-dom';
import { TaskModalContainer } from '../task';
import { selectCurrentUser } from '../../redux/user/user.selector';
import ActivityList from '../activity/activity-list.component';

const { SPRINT, SPRINT_ACTIVITY, SPRINT_CHAT, SPRINT_STATS } = ROUTER_ENUMS;

export interface SprintBoardProps {
  sprintId: number;
  socket?: SocketIOClient.Socket;
  sprintState: ROUTER_ENUMS;
}
 
const SprintBoard: React.FC<SprintBoardProps> = ({
  sprintId,
  socket,
  sprintState,
}) => {
  const [boards, setBoards] = React.useState<IBoard[]>([]);

  const { id } = useParams();
  const currentSprint: ISprint = useSelector(selectCurrentSprint);
  const currentUser = useSelector(selectCurrentUser);

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
    if (currentSprint.endDate) {
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

  const handleCommentSubmit = (content: string) => {
    socket?.emit('addCommentToSprint', { sprintId, content, uid: currentUser.uid });
  };

  const renderContent = () => {
    const activities: any[] = [];

    currentSprint.boards.forEach((board) => {
      board.tasks.forEach((task) => {
        task.activities.forEach((activity) => activities.push({
          ...activity,
          taskName: task.title,
          taskId: +task.id,
        }))
      })
    });

    switch(sprintState) {
      case SPRINT_ACTIVITY:
        return(
          <>
            <ActivityList
              activities={
                activities
              }
              colourClass={'white'}
            />
          </>
        );
      case SPRINT_CHAT:
        return(
          <Comments
            colourClass={'white'}
            comments={currentSprint.comments}
            onCommentSubmit={handleCommentSubmit}
          />
        );
      case SPRINT_STATS:
        return(
          <>
            Stats
          </>
        );
      case SPRINT:
      default:
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
  }

  return (
    <div 
      style={{
        padding: '5px',
        margin: '15px',
      }}
    >
      <Grid
        style={{ padding: '10px 15px' }}
      >
        <Grid.Row columns={1}>
          <Grid.Column width={12}>
            <span
              style={{
                fontFamily: "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
                fontSize: "1.7rem",
                fontWeight: 700,
                marginRight: '10px',
                color: 'white',
              }}
            >
              {currentSprint.name}
            </span>
            {getDaysLeft()}
            {calculatePoints()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {renderContent()}
    </div>
  );
}
 
export default SprintBoard;