import * as React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import { selectCurrentSprint } from '../../redux/sprint/sprint.selector';
import { Grid, Label, Icon, Card, Comment, Header, Form, Button } from 'semantic-ui-react';
import { BoardColumn } from '../board';
import { ISprint, IBoard, ITask, IComment } from '../../lib';
import { ROUTER_ENUMS } from '../../lib/enums/router.enums';
import { DateService } from '../../lib/services/date.service';
import { useParams } from 'react-router-dom';
import { TaskModalContainer } from '../task';
import moment from 'moment';
import { selectCurrentUser } from '../../redux/user/user.selector';

export interface SprintBoardProps {
  sprintId: number;
  socket?: SocketIOClient.Socket;
}
 
const SprintBoard: React.FC<SprintBoardProps> = ({
  sprintId,
  socket,
}) => {
  const [boards, setBoards] = React.useState<IBoard[]>([]);
  const [pageState, setPageState] = React.useState<ROUTER_ENUMS|null>(ROUTER_ENUMS.SPRINT);
  const [commentContent, setCommentContent] = React.useState('');

  const { id } = useParams();
  const currentSprint = useSelector(selectCurrentSprint);
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

  const handleNavigationClick = (route: ROUTER_ENUMS) => {
    setPageState(route);
  };

  const handleCommentSubmit = () => {
    socket?.emit('addCommentToSprint', { sprintId, content: commentContent, uid: currentUser.uid });
  };

  const renderContent = () => {
    switch(pageState) {
      case ROUTER_ENUMS.SPRINT_ACTIVITY:
        return(
          <>
            Activity
          </>
        );
      case ROUTER_ENUMS.SPRINT_CHAT:
        return(
          <Comment.Group
            style={{ padding: '15px' }}
          >
            <Header as='h3' dividing
              style={{
                color: 'white',
              }}
            >
              Comments
            </Header>
            {
              (currentSprint.comments.map((comment: IComment) => {
                return (
                  <Comment
                    style={{
                      color: 'white',
                    }}
                  >
                    <Comment.Avatar src={comment.user?.photoURL} />
                    <Comment.Content>
                      <Comment.Author as='a'>{comment.user?.displayName}</Comment.Author>
                      <Comment.Metadata>
                        <div>{moment(comment.datePosted).calendar()}</div>
                      </Comment.Metadata>
                      <Comment.Text>{comment.content}</Comment.Text>
                    </Comment.Content>
                  </Comment>
                )
              }))
            }
            <Form reply>
              <Form.TextArea
                value={commentContent}
                onChange={
                  (event: React.FormEvent<HTMLTextAreaElement>) => setCommentContent(event.currentTarget.value)
                }
              />
              <Button
                onClick={handleCommentSubmit}                
                labelPosition='left'
                icon='edit'
                primary
                content={'Add Comment'}
              />
            </Form>
          </Comment.Group>
        );
      case ROUTER_ENUMS.SPRINT_STATS:
        return(
          <>
            Stats
          </>
        );
      case ROUTER_ENUMS.SPRINT:
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
    <>
      <Card
        style={{
          width: '35%',
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
                }}
              >
                {currentSprint.name}
              </span>
              {getDaysLeft()}
              {calculatePoints()}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column width={12}>
              <Label as='a' color='orange' icon={true} onClick={() => handleNavigationClick(ROUTER_ENUMS.SPRINT)}>
                <Icon name={'columns'} />
                <Label.Detail>Boards</Label.Detail>
              </Label>
              <Label as='a' color='violet' icon={true} onClick={() => handleNavigationClick(ROUTER_ENUMS.SPRINT_ACTIVITY)}>
                <Icon name={'history'} />
                <Label.Detail>Activity</Label.Detail>
              </Label>
              <Label as='a' color='olive' icon={true} onClick={() => handleNavigationClick(ROUTER_ENUMS.SPRINT_CHAT)}>
                <Icon name={'chat'} />
                <Label.Detail>Chat</Label.Detail>
              </Label>
              <Label as='a' color='grey' icon={true} onClick={() => handleNavigationClick(ROUTER_ENUMS.SPRINT_STATS)}>
                <Icon name={'line graph'} />
                <Label.Detail>Stats</Label.Detail>
              </Label>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card>
      {renderContent()}
    </>
  );
}
 
export default SprintBoard;