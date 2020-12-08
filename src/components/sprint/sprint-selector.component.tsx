import * as React from 'react';
import { SprintDropdownContainer } from '../dropdowns/index';
import { ISprint } from '../../lib/types';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSprint, selectCurrentSprint } from '../../redux/index';

export interface SprintSelectorProps {
  socket?: SocketIOClient.Socket;
}

const SprintSelector: React.FC<SprintSelectorProps> = ({
  socket,
}) => {
  const dispatch = useDispatch();

  const currentSprint = useSelector(selectCurrentSprint);

  const handleSprintSelect = ({ name, value }: { name: string, value: number }) => {
    socket?.emit('joinSprintRoom', { id: value });
    socket?.emit('getSprint', { id: value });

    socket?.on('sprint', (sprint: ISprint) => {
      dispatch(setCurrentSprint(sprint));
    });
  };

  return (
    <SprintDropdownContainer
      socket={socket}
      name={'sprintId'}
      placeholder={'Select Sprint'}
      onSelectSprint={handleSprintSelect}
      selectedSprint={currentSprint?.id}
    />
  );
}

export default SprintSelector;
