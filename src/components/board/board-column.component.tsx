import * as React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { ITask } from '../../lib';

export interface BoardColumnProps {
  droppableId: string;
  items: ITask[];
}
 
const BoardColumn: React.FC<BoardColumnProps> = ({
  droppableId,
  items,
}) => {

  const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    border: isDraggingOver ? '1px dotted grey' : '',
    padding: 8,
    width: 250
  });

  const getItemStyle = (isDragging: any, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: 8 * 2,
    margin: `0 0 ${8}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : '',

    // styles we need to apply on draggables
    ...draggableStyle
  });

  return (
    <Droppable droppableId={droppableId}>
      {(provided: any, snapshot: any) => (
        <div
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver)}>
          {items.map((item: ITask, index: any) => (
            <Draggable
              key={item.id}
              draggableId={`${item.id}`}
              index={index}>
              {(provided: any, snapshot: any) => (
                <div
                  className={'card ui'}
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style
                  )}>
                  {item.title}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
 
export default BoardColumn;