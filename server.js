const express = require('express');
const cors = require('cors'); 
const actionsDb = require('./data/helpers/actionModel.js');
const projectsDb = require('./data/helpers/projectModel.js');
const mappers = require('./data/helpers/mappers.js');
const port = 6000;

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
    actionsDb
        .get()
        .then(foundActions => {
            res.json(foundActions); 
        })
        .catch(error => {
            return sendUserError(500, "There's an error.", res);             
        }); 
}); 

server.post('/api/actions', nameCheckMiddleware, (req, res) => {
    const { name, description } = req.body; 
    actionsDb
        .insert({ name, description })
        .then(response => {
            res.json(response);            
        })
        .catch(error => {
            return sendUserError(500, "There's an error.", res); 
        });
})

server.get('/api/actions/:id', (req, res) => {
    const { id } = req.params; 
    actionsDb
        .get(id)
        .then(action => {
            if (action === 0) {
                return sendUserError(404, "No action by that ID found.", res);                
            }
            res.json(action); 
        })
        .catch(error => {
            return sendUserError(500, "There's an error.", res);
        });
}); 

server.delete('/api/actions/:id', (req, res) => {
    const { id } = req.params; 
    actionsDb
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
    const { name, description } = req.body;
    actionsDb
        .update(id, { name, description })
        .then(response => {
            if (response === 0) {
                return sendUserError(404, "No action by that id.", res); 
            } else {
                actionsDb.find(id).then(action => {
                    res.json(action); 
                }); 
            }
        })
        .catch(error => {
            return sendUserError(500, "There's an error.", res); 
        }); 
}); 

// === PROJECT ENDPOINTS === 

server.get('/api/projects', (req, res) => {
    projectsDb
        .get()
        .then(foundProjects => {
            res.json(foundProjects); 
        })
        .catch(error => {
            return sendUserError(500, "There's an error.", res);             
        }); 
}); 

server.get('/api/projects/:id', (req, res) => {
    const { id } = req.params; 
    projectsDb
        .get(id)
        .then(project => {
            if (project === 0) {
                return sendUserError(404, "No project by that ID found.", res);                
            }
            res.json(project); 
        })
        .catch(error => {
            return sendUserError(500, "There's an error.", res);
        });
}); 

server.post('/api/projects', (req, res) => {
    const { project_id, description, notes } = req.body; 
    projectsDb
        .insert({ project_id, description, notes })
        .then(response => {
            res.json(response);            
        })
        .catch(error => {
            return sendUserError(500, "There's an error.", res); 
        });
})

server.get('/api/projects/:project_id', (req, res) => {
    const { project_id } = req.params;
    projectsDb
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
    projectsDb
        .remove(id)
        .then(projectRemoved => {
            if (projectRemoved === 0) {
                return sendUserError(404, "No project by that id.", res); 
            } else {
                res.json({ success: "Project removed" }); 
            }
        })
        .catch(error => {
            return sendUserError(500, "There's an error.", res);
        }); 
}); 

server.put('/api/projects/:id', (req, res) => {
    const { id } = req.params; 
    const { project_id, description, notes } = req.body;
    projectsDb
        .update(id, { project_id, description, notes })
        .then(response => {
            if (response === 0) {
                return sendUserError(404, "No project by that id.", res); 
            } else {
                projectsDb.find(id).then(action => {
                    res.json(action); 
                }); 
            }
        })
        .catch(error => {
            return sendUserError(500, "There's an error.", res); 
        }); 
}); 

server.listen(port, () => console.log(`Server running on port ${port}`));