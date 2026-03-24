import { useState, useRef } from 'react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy,
  useSortable, arrayMove
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { addTodo, updateTodo, deleteTodo, reorderTodos } from '../api';

// ─── 單筆 Todo 元件 ─────────────────────────────────────────
function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1
  };

  const textRef = useRef(null);

  const handleBlur = () => {
    const newText = textRef.current?.innerText.trim();
    if (newText && newText !== todo.text) onEdit(todo.id, newText);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); textRef.current?.blur(); }
  };

  return (
    <li ref={setNodeRef} style={style}
      className={`todo-item${todo.done ? ' done' : ''}`}>
      <span className="todo-drag-handle" {...attributes} {...listeners}>⋮⋮</span>
      <span className="todo-checkbox" onClick={() => onToggle(todo.id, !todo.done)}>
        {todo.done ? '✅' : '⬜'}
      </span>
      <span
        ref={textRef}
        className="todo-text"
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      >
        {todo.text}
      </span>
      <span className="todo-delete" onClick={() => onDelete(todo.id)}>🗑️</span>
    </li>
  );
}

// ─── TodoList 主元件 ────────────────────────────────────────
export default function TodoList({ todos, setTodos }) {
  const [input, setInput] = useState('');

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: { distance: 5 }
  }));

  const handleAdd = async () => {
    if (!input.trim()) return;
    const newTodo = await addTodo(input.trim());
    setTodos(prev => [...prev, newTodo]);
    setInput('');
  };

  const handleToggle = async (id, done) => {
    const updated = await updateTodo(id, { done });
    setTodos(prev => prev.map(t => t.id === id ? updated : t));
  };

  const handleEdit = async (id, text) => {
    const updated = await updateTodo(id, { text });
    setTodos(prev => prev.map(t => t.id === id ? updated : t));
  };

  const handleDelete = async (id) => {
    if (!confirm('確定要刪除此事項嗎？')) return;
    await deleteTodo(id);
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = todos.findIndex(t => t.id === active.id);
    const newIndex = todos.findIndex(t => t.id === over.id);
    const reordered = arrayMove(todos, oldIndex, newIndex);
    setTodos(reordered);

    await reorderTodos(reordered.map((t, i) => ({ id: t.id, order: i })));
  };

  return (
    <>
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>📝</span> 待辦事項備忘
        </div>
        <div className="input-group">
          <input
            type="text"
            className="todo-input"
            placeholder="+ 新增 (Enter)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button className="add-btn" onClick={handleAdd}>+</button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={todos.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <ul className="todo-list">
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </>
  );
}
