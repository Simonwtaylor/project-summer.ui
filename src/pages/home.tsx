import * as React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import socketIOClient from 'socket.io-client';

export interface IHomePageProps {
  
}

const socket: SocketIOClient.Socket = socketIOClient('http://localhost:3001');

const HomePage: React.FC<IHomePageProps> = () => {
  const [load, setLoad] = React.useState(false);
  const [items, setItems] = React.useState<any[]>([]);
  const [selected, setSelected] = React.useState<any[]>([]);
  const [boardOneText, setBoardOneText] = React.useState<string>("");
  const [boardTwoText, setBoardTwoText] = React.useState<string>("");


  React.useEffect(() => {
    socket.emit('getTasks');
  }, [load])

  React.useEffect(() => {
    socket.on('tasks', (tasks: any[]) => {
      console.log(tasks);
      setItems(tasks.filter(a => a.boardId === 'droppable'));
      setSelected(tasks.filter(a => a.boardId === 'droppable2'));
    });
  }, []);

  // a little function to help us with reordering the result
  const reorder = (list: any, startIndex: any, endIndex: any): any[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setLoad(true);
    return result;
  };

  const grid = 8;

  const getItemStyle = (isDragging: any, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
  });

  const getListStyle = (isDraggingOver: any) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250
  });

  const getList = (id: any) => id === 'droppable' ? 'items' : 'selected';

  const onDragEnd = (result: any) => {
    console.log(result);
    const { source, destination, draggableId } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items: any = reorder(
        getList(source.droppableId),
        source.index,
        destination.index
      );

      let state: any = { items };

      if (source.droppableId === 'droppable2') {
        state = { selected: items };
      }

      setItems(state.items);
      setSelected(state.selected);
    } else {
      socket.emit('updateTaskBoard', {id: draggableId, boardId: destination.droppableId });
    }
  };

  const addTaskToBoardOne = () => {
    setLoad(!load);
    console.log('clicked 1')
    console.log(socket);
    socket.emit('addTask', { content: boardOneText, boardId: 'droppable'});
  };

  const addTaskToBoardTwo = () => {
    setLoad(!load);
    console.log('clicked 2')
    socket.emit('addTask', { content: boardTwoText, boardId: 'droppable2'});
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{width: '50%', display: 'inline-block' }}>
        <h3>List 1</h3>
        <div>
          <input value={boardOneText} onChange={(e: any) => setBoardOneText(e.target.value)} />
          <button type={'button'} onClick={addTaskToBoardOne}>add</button>
        </div>
        <Droppable droppableId="droppable">
          {(provided: any, snapshot: any) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}>
              {items.map((item: any, index: any) => (
                <Draggable
                  key={item.id}
                  draggableId={`${item.id}`}
                  index={index}>
                  {(provided: any, snapshot: any) => (
                    <div
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
      </div>
      <div style={{width: '50%', display: 'inline-block' }}>
        <h3>List 2</h3>
        <div>
          <input value={boardTwoText} onChange={(e: any) => setBoardTwoText(e.target.value)} />
          <button type={'button'} onClick={addTaskToBoardTwo}>add</button>
        </div>
        <Droppable droppableId="droppable2">
          {(provided: any, snapshot: any) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}>
              {selected.map((item: any, index: any) => (
                <Draggable
                  key={item.id}
                  draggableId={`${item.id}`}
                  index={index}>
                  {(provided: any, snapshot: any) => (
                    <div
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
      </div>
    </DragDropContext>
  );
}
 
export default HomePage;