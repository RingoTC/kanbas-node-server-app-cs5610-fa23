const assignment = {
  _id: 1,
  title: "NodeJS Assignment",
  description: "Create a NodeJS server with ExpressJS",
  due: "2022-10-10",
  completed: false,
  score: 0,
};

const todos = [
  { id: 1, title: "Task 1", completed: false },
  { id: 2, title: "Task 2", completed: true },
  { id: 3, title: "Task 3", completed: false },
  { id: 4, title: "Task 4", completed: true },
];


const Lab5 = (app) => {

// Middleware to find todo by ID
  function findTodoById(req, res, next) {
    const { id } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    if (!todo) {
      res.status(404).json({ message: `Todo with ID ${id} not found` });
    } else {
      req.todo = todo;
      next();
    }
  }

// Todo Routes
  app.post('/a5/todos', (req, res) => {
    const newTodo = { ...req.body, id: new Date().getTime() };
    todos.push(newTodo);
    res.json(newTodo);
  });

  app.route('/a5/todos/:id')
      .put(findTodoById, (req, res) => {
        const { todo } = req;
        const { title, description, due, completed } = req.body;
        Object.assign(todo, { title, description, due, completed });
        res.sendStatus(200);
      })
      .get(findTodoById, (req, res) => {
        res.json(req.todo);
      })
      .delete(findTodoById, (req, res) => {
        todos.splice(todos.indexOf(req.todo), 1);
        res.sendStatus(200);
      });

  app.get('/a5/todos', (req, res) => {
    const { completed } = req.query;
    const isCompleted = completed === 'true';
    const filteredTodos = completed ? todos.filter(t => t.completed === isCompleted) : todos;
    res.json(filteredTodos);
  });

  app.route('/a5/todos/create')
      .get((req, res) => {
        const newTodo = { id: new Date().getTime(), title: 'New Task', completed: false };
        todos.push(newTodo);
        res.json(todos);
      });

  app.route('/a5/todos/:id/delete')
      .get(findTodoById, (req, res) => {
        todos.splice(todos.indexOf(req.todo), 1);
        res.json(todos);
      });

  app.route('/a5/todos/:id/title/:title')
      .get(findTodoById, (req, res) => {
        const { todo } = req;
        todo.title = req.params.title;
        res.json(todos);
      });

  app.route('/a5/todos/:id/completed/:completed')
      .get(findTodoById, (req, res) => {
        const { todo } = req;
        todo.completed = req.params.completed === 'true';
        res.json(todos);
      });

  app.route('/a5/todos/:id/description/:description')
      .get(findTodoById, (req, res) => {
        const { todo } = req;
        todo.description = req.params.description;
        res.json(todos);
      });

// Assignment Routes
  app.get('/a5/assignment', (req, res) => {
    res.json(assignment);
  });

  app.route('/a5/assignment/title')
      .get((req, res) => {
        res.json(assignment.title);
      })
  app.route('/a5/assignment/title/:newTitle')
      .get((req, res) => {
        const { newTitle } = req.params;
        assignment.title = newTitle;
        res.json(assignment);
      });


  app.route('/a5/assignment/score/:newScore')
      .get((req, res) => {
        const { newScore } = req.params;
        assignment.score = newScore;
        res.json(assignment);
      });

  app.route('/a5/assignment/completed/:newCompleted')
      .get((req, res) => {
        const { newCompleted } = req.params;
        assignment.completed = newCompleted;
        res.json(assignment);
      });

// Other Routes
  app.get('/a5/welcome', (req, res) => {
    res.send('Welcome to Assignment 5');
  });

  app.route('/a5/add/:a/:b')
      .get((req, res) => {
        const { a, b } = req.params;
        const sum = parseInt(a) + parseInt(b);
        res.send(sum.toString());
      });

  app.route('/a5/subtract/:a/:b')
      .get((req, res) => {
        const { a, b } = req.params;
        const difference = parseInt(a) - parseInt(b);
        res.send(difference.toString());
      });

  app.get('/a5/calculator', (req, res) => {
    const { a, b, operation } = req.query;
    let result = 0;
    switch (operation) {
      case 'add':
        result = parseInt(a) + parseInt(b);
        break;
      case 'subtract':
        result = parseInt(a) - parseInt(b);
        break;
      default:
        result = 'Invalid operation';
    }
    res.send(result.toString());
  });

};
export default Lab5;