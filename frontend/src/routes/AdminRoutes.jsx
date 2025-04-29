// src/routes/AdminRoutes.jsx
import React from 'react'
import { useRoutes } from 'react-router-dom'
import AllClients from '../pages/AdminView/Clients/AllClients'
import EditClients from '../pages/AdminView/Clients/EditClients'
import AddClients from '../pages/AdminView/Clients/AddClients'
import AllAdvisors from '../pages/AdminView/Advisors/AllAdvisors'
import EditAdvisors from '../pages/AdminView/Advisors/EditAdvisors'
import AllMeetings from '../pages/AdminView/Meetings/AllMeetings'
import EditMeetings from '../pages/AdminView/Meetings/EditMeetings'
import AllTasks from '../pages/AdminView/Tasks/AllTasks'
import EditTasks from '../pages/AdminView/Tasks/EditTasks'
import AddTasks from '../pages/AdminView/Tasks/AddTasks'
import AddAdvisor from '../pages/AdminView/Advisors/AddAdvisors'

const AdminRoutes = () => {
  // Declare routes here
  const routes = [
    { path: '/admin/clients', element: <AllClients /> },
    { path: '/admin/clients/:id/editClients', element: <EditClients /> },
    { path: '/admin/clients/addClients', element: <AddClients /> },

    { path: '/admin/advisors', element: <AllAdvisors /> },
    { path: '/admin/advisors/:id/editAdvisors', element: <EditAdvisors /> },
    { path: '/admin/advisors/addAdvisor', element: <AddAdvisor /> },

    { path: '/admin/tasks', element: <AllMeetings /> },
    { path: '/admin/tasks/:id/editTasks', element: <EditMeetings /> },

    {path:'/admin/rowwisetasks', element:<AllTasks/>},
    { path: '/admin/rowwisetasks/:id/editRowWiseTasks', element: <EditTasks /> },
    { path: '/admin/rowwisetasks/addTask', element: <AddTasks /> }
  ]

  // Return all routes using useRoutes
  return useRoutes(routes)
}

export default AdminRoutes;
