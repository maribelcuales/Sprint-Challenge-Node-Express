const express = require('express');
const cors = require('cors'); 
const actions = require('./data/helpers/actionModel.js');
const projects = require('./data/helpers/projectModel.js');
const port = process.env.PORT || 5800;

const server = express();
server.use(express.json());
server.use(cors({})); 

const sendUserError = (status, message, res) => {
    res.status(status).json({ error: message }); 
}; 

// === CUSTOM MIDDLEWARE === 
const nameCheckMiddleware = (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        sendUserError(404, 'Name must be included', res);
      next();
    } else {
      next();
    }
  };

// === ACTION ENDPOINTS === 
server.get('/api/actions', (req, res) => {
    actions
        .get()
        .then(foundActions => {
            res.json(foundActions); 
        })
        .catch(error => {
            return sendUserError(500, "There's an error.", res);             
        }); 
}); 

server.post('/api/actions', nameCheckMiddleware, (req, res) => {
    const { project_id, description, notes } = req.body; 
    actions
        .insert({ project_id, description, notes })
        .then(response => {
            res.json(response);            
        })
        .catch(error => {
            return sendUserError(500, error, res); 
        });
})

server.get('/api/actions/:id', (req, res) => {
    const { id } = req.params; 
    actions
        .get(id)
        .then(userAction => {
            if (userAtion === 0) {
                return sendUserError(404, "No action by that ID found.", res);                
            }
            res.json(userAction); 
        })
        .catch(error => {
            return sendUserError(500, error, res);
        });
}); 

server.delete('/api/actions/:id', (req, res) => {
    const { id } = req.params; 
    actions
        .remove(id)
        .then(actionRemoved => {
            if (actionRemoved === 0) {
                return sendUserError(404, "No action by that id.", res); 
            } else {
                res.json({ success: "Action removed" }); 
            }
        })
        .catch(error => {
            return sendUserError(500, "There's an error.", res);
        }); 
}); 

server.put('/api/actions/:id', nameCheckMiddleware, (req, res) => {
    const { id } = req.params; 
    const { project_id, description, notes } = req.body;
    actions
        .update(id, { project_id, description, notes })
        .then(response => {
            if (response === 0) {
                return sendUserError(404, "No action by that id.", res); 
            }
            res.status(201).json(response);             
        })
        .catch(error => {
            return sendUserError(500, error.message, res); 
        })
}); 

// === PROJECT ENDPOINTS === 

server.get('/api/projects', (req, res) => {
    projects
        .get()
        .then(foundProjects => {
            res.json(foundProjects); 
        })
        .catch(error => {
            return sendUserError(500, error.message, res);             
        }); 
}); 

server.get('/api/projects/:id', (req, res) => {
    const { id } = req.params; 
    projects
        .get(id)
        .then(userProject => {
            if (userProject === 0) {
                return sendUserError(404, "No project by that ID found.", res);                
            }
            res.json(userProject); 
        })
        .catch(error => {
            return sendUserError(500, "There's an error.", res);
        });
}); 

server.post('/api/projects', (req, res) => {
    const { name, description } = req.body; 
    projects
        .insert({ name, description })
        .then(response => {
            res.json(response);            
        })
        .catch(error => {
            return sendUserError(500, "There's an error.", res); 
        });
})

server.get('/api/:project_id/:projects', (req, res) => {
    const { project_id } = req.params;
    projects
        .getProjectActions(project_id)
        .then(projectActions => {
            if (projectActions === 0) {
                return sendUserError(404, "Project action not found.", res); 
            }
            res.json(projectActions); 
        })
        .catch(error => {
            return sendUserError(500, "There's an error.", res); 
        });
}); 


server.delete('/api/projects/:id', (req, res) => {
    const { id } = req.params; 
    projects
        .remove(id)
        .then(projectRemoved => {
            if (projectRemoved === 0) {
                return sendUserError(404, "No project by that id.", res); 
            } else {
                res.json({ success: "Project removed" }); 
            }
        })
        .catch(error => {
            return sendUserError(500, error.message, res);
        }); 
}); 

server.put('/api/projects/:id', (req, res) => {
    const { id } = req.params; 
    const { name, description } = req.body;
    projects
        .update(id, { name, description })
        .then(response => {
            if (response === 0) {
                return sendUserError(404, error.message, res); 
            } 
            res.status(201).json(response);         
        })
        .catch(error => {
            return sendUserError(500, error.message, res); 
        }); 
}); 

server.listen(port, () => console.log(`Server running on port ${port}`));