import * as React from 'react';
import { IUser } from '../../lib/types';
import { DropdownItemProps } from 'semantic-ui-react';
import { CustomDropdown } from './index';

export interface IUserDropdownContainerProps {
  onSelectUser: any;
  selectedUser?: any;
  name: string;
  placeholder?: string;
  socket?: SocketIOClient.Socket;
}

const UserDropdownContainer: React.FC<IUserDropdownContainerProps> = ({
  onSelectUser,
  selectedUser,
  name,
  placeholder,
  socket,
}) => {

  const options: DropdownItemProps[] = [];
  socket?.emit('getUsers');

  socket?.on('users', (data: IUser[]) => {
    options.splice(0, options.length);
    
    data.map(({ id, displayName, photoURL }: IUser) => {
      return options.push(
        {
          key: id, 
          value: id, 
          text: displayName,
          image: photoURL
        }
      );
    });
  })

  return (
    <CustomDropdown 
      items={options}
      onSelectItem={onSelectUser}
      selectedItem={selectedUser}
      name={name}
      placeholder={placeholder}
    />
  );
};
 
export default UserDropdownContainer;