import * as React from 'react';
import { Sidebar, Menu, Icon, Popup, Button, Label } from 'semantic-ui-react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { SprintSelector } from '../sprint/index';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentSprint, selectCurrentUser } from '../../redux/index';
import AddSprint from '../sprint/add-sprint.component';

import { ISprint, IBoard, ITask, ROUTER_ENUMS, DateService } from '../../lib';

const { SPRINT, SPRINT_ACTIVITY, SPRINT_CHAT } = ROUTER_ENUMS;

export interface INavSidebarProps extends RouteComponentProps<any> {
  socket?: SocketIOClient.Socket;
  visible: boolean;
  onSprintChange: (prevSprintId: number) => void;
  onSprintSectionChange: (sprintSection: ROUTER_ENUMS) => void;
}
 
const NavSidebar: React.FC<INavSidebarProps> = ({
  socket,
  visible,
  onSprintChange,
  onSprintSectionChange,
  history,
}) => {

  const currentSprint = useSelector(selectCurrentSprint);
  const currentUser = useSelector(selectCurrentUser);

  const [addSprint, setAddSprint] = React.useState(false);

  React.useEffect(() => {
    socket?.on('newUserTaskAdded', (task: ITask) => {
      history.push(`sprint/${task.id}`);
    });
  }, [socket]);

  const handleAddSprint = (sprint: any) => {
    socket?.emit('addSprint', { 
      ...sprint,
    });
  };

  const getSprintSection = () => {
    if (currentSprint) {
      return (
        <></>
      );
    }

    return (
      <Menu.Item>
        <SprintSelector
          socket={socket}
        />
      </Menu.Item>
    )
  };

  const handleAddNewTaskClick = () => {
    socket?.emit('addSkeletonTask', {
      sprintId: currentSprint.id,
      boardId: currentSprint.boards.find((a: any) => a.name === "Backlog").id,
    });
    onSprintSectionChange(SPRINT);
  };

  const getDaysLeft = () => {
    if (currentSprint?.endDate) {
      const { endDate } = currentSprint;
      const a = new Date();
      const b = new Date(endDate);
      const difference = DateService.getDaysDifference(a, b);

      return (
        <Popup
          content={`${difference} days left in sprint`}
          key={`dayssleftsprinticon`}
          trigger={
          <Label as='a' color='blue' icon={true}>
            <Icon name={'calendar check'} />
            {difference}
          </Label>
          }
        />
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
      <Popup
        content={`${points} Points left in sprint`}
        key={`pointsleftsprinticon`}
        trigger={
          <Label as='a' color='teal' icon={true}>
            <Icon name={'gamepad'} />
            {points}
          </Label>
        }
      />
    );
  };

  const getSprintHeader = () => {
    if (currentSprint) {
      return (
        <div
          style={{
            display: 'flex',
            marginTop: '10px',
          }}
        >
          <div
            style={{
              textAlign: 'left',
              width: '75%',
            }}
          >
            <span
              style={{
                marginLeft: '10px',
                fontSize: '1rem'
              }}
            >
              🚀
            </span>
            <span
              style={{
                marginLeft: '5px',
                fontSize: '1rem'
              }}
            >
              <b>{currentSprint.name}</b>
            </span>
          </div>
          <div
            style={{
              textAlign: 'right',
              width: '25%'
            }}
          >
            <Popup
              content={'Change Sprint'}
              key={`changesprinticon`}
              trigger={
                <Icon
                  name={'exchange'}
                  style={{ 
                    fontSize: '1em',
                    marginRight: '10px',
                    cursor: 'pointer'
                  }}
                  onClick={() => onSprintChange(currentSprint.id)}
                />
              }
            />
          </div>
        </div>
      );
    }

    return (
      <div style={{ marginTop: '10px' }}>
        <span style={{ fontSize: '1rem' }}>Sprint</span>
      </div>
    );
  };

  const getSprintOptions = () => {
    if (!currentSprint) {
      return <></>;
    }

    return (
      <>
        <Menu.Item
          as={Link}
          to={'/sprint'}
          
          onClick={() => onSprintSectionChange(SPRINT)}
          style={{
            fontSize: '1rem',
          }}
        >
          <Icon
            style={{ fontSize: '1em'}}
            name='columns'
            size={'small'}
          />
          Boards
        </Menu.Item>
        <Menu.Item
          as={Link}
          to={'/sprint'}
          onClick={() => onSprintSectionChange(SPRINT_ACTIVITY)}
          style={{
            fontSize: '1rem',
          }}
        >
          <Icon
            style={{ fontSize: '1em'}}
            name='history'
            size={'small'}
          />
          Activity
        </Menu.Item>
        <Menu.Item
          as={Link}
          to={'/sprint'}
          onClick={() => onSprintSectionChange(SPRINT_CHAT)}
          style={{
            fontSize: '1rem',
          }}
        >
          <Icon
            style={{ fontSize: '1em'}}
            name='chat'
            size={'small'}
          />
          Chat
        </Menu.Item>
      </>
    );
  };

  const getAddSprintTaskButton = () => {
    if (currentSprint) {
      return (
        <Button
          size={'small'}
          onClick={handleAddNewTaskClick}
          color={'green'}
          inverted={true}
          content={
            <>
              <span>🎫 Add Task</span>
            </>
          }
        />
      );
    }

    return (
      <Button
        size={'small'}
        onClick={() => setAddSprint(!addSprint)}
        color={'green'}
        inverted={true}
        content={
          <>
            <span>📈 Add Sprint</span>
          </>
        }
      />
    );
  };

  const getRender = () => {
    if (!currentUser) {
      return <></>
    }

    return (
      <>
        <Menu.Header
          style={{
            color: 'white',
            borderBottom: '1px solid rgba(255,255,255, 0.1',
            borderTop: '1px solid rgba(255,255,255, 0.1',
            paddingBottom: '5px',
            maxHeight: '50px',
            minHeight: '50px',
          }}
        >
          {getSprintHeader()}
        </Menu.Header>
          {getSprintSection()}
          {getSprintOptions()}
        <Menu.Item>
          <div>
            {getDaysLeft()}
            {calculatePoints()}
          </div>
        </Menu.Item>
        <Menu.Item>
          {getAddSprintTaskButton()}
        </Menu.Item>
      </>
    )
  };

  // const getModal = () => {
  //   if (id) {
  //     return (
  //       <TaskModalContainer
  //         id={+id}
  //         socket={socket}
  //         onClose={handleTaskModalClose}
  //       />
  //     );
  //   }
  //   return <></>;
  // };

  const getAddSprint = () => {
    return(
      <AddSprint
        show={addSprint}
        onModalClose={() => setAddSprint(false)}
        onAddSprint={handleAddSprint}
      />
    );
  };

  return (
    <Sidebar
      as={Menu}
      animation='push'
      icon='labeled'
      inverted
      vertical
      visible={visible}
      width='thin'
      style={{
        width: 'inherit',
        backgroundColor: '#2f3136'
      }}
    >
      {getRender()}
      {getAddSprint()}
    </Sidebar>
  );
}

export default withRouter(NavSidebar);