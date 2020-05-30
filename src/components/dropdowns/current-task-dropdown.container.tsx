import React from 'react';
import { ITask } from '../../lib';
import { DropdownItemProps } from 'semantic-ui-react';
import { CustomDropdown } from './index';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/user/user.selector';

export interface CurrentTaskDropdownProps {
  socket?: SocketIOClient.Socket;
  onSelectTask: any;
  selectedTask?: any;
  name: string;
  placeholder?: string;
}
 
const CurrentTaskDropdown: React.FC<CurrentTaskDropdownProps> = ({
  socket,
  onSelectTask,
  selectedTask,
  name,
  placeholder
}) => {
  const options: DropdownItemProps[] = [];
  const currentUser = useSelector(selectCurrentUser);

  socket?.emit('getUserTasks', { id: +currentUser.id });

  socket?.on('userTasks', (tasks: ITask[]) => {
    options.splice(0, options.length);
    
    tasks.map((task: ITask) => {
      return options.push(
        {
          key: `currenttaskuserddl${task.id}`, 
          value: task.id, 
          text: task.title
        }
      );
    });
  });

  return (
    <CustomDropdown 
      items={options}
      onSelectItem={onSelectTask}
      selectedItem={selectedTask}
      name={name}
      placeholder={placeholder}
    />
  );
}
 
export default CurrentTaskDropdown;