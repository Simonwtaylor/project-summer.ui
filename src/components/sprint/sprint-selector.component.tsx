import * as React from 'react';
import { SprintDropdownContainer } from '../dropdowns/index';
import { ISprint } from '../../lib/types';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSprint } from '../../redux/sprint/sprint.action';
import { selectCurrentSprint } from '../../redux/sprint/sprint.selector';

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
      dispatch(setCurrentSprint(sprint))
    });
  };

  return (
    <SprintDropdownContainer
      socket={socket}
      name={'sprintId'}
      onSelectSprint={handleSprintSelect}
      selectedSprint={currentSprint?.id}
    />
  );
}
 
export default SprintSelector;