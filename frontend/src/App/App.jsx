import React from 'react'
import TodoForm from '../components/TodoForm';
import { Container } from "react-bootstrap";
import TodoList from '../components/TodoList';

const App = () => {
  return (
    <Container>
        <TodoForm />
        <TodoList />
    </Container>
  )
}

export default App;