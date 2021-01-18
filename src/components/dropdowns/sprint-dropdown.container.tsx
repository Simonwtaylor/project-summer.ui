import * as React from 'react';
import { ISprint } from '../../lib/types';
import { DropdownItemProps } from 'semantic-ui-react';
import { CustomDropdown } from './index';

export interface ISprintDropdownContainerProps {
  onSelectSprint: any;
  selectedSprint?: any;
  name: string;
  placeholder?: string;
  socket?: SocketIOClient.Socket;
}

const SprintDropdownContainer: React.FC<ISprintDropdownContainerProps> = ({
  onSelectSprint,
  selectedSprint,
  name,
  placeholder,
  socket,
}) => {

  const options: DropdownItemProps[] = [];
  socket?.emit('getSprints');

  socket?.on('sprints', (data: ISprint[]) => {
    if (data.length === 0) {
      return <></>;
    }
    
    options.splice(0, options.length);
    data.map((sprint: ISprint) => {
      return options.push(
        {
          key: sprint.id, 
          value: sprint.id, 
          text: sprint.name,
        },
      );
    });
  });

  return (
    <CustomDropdown 
      items={options}
      onSelectItem={onSelectSprint}
      selectedItem={selectedSprint}
      name={name}
      placeholder={placeholder}
    />
  );
};

export default SprintDropdownContainer;
