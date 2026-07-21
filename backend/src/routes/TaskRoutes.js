const express = require('express');
const router = express.Router();
const { getTasksByProject, getTask, createTask, updateTask, deleteTask } = require('../controllers/taskController');

router.get('/project/:projectId', getTasksByProject);
router.route('/').post(createTask);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;