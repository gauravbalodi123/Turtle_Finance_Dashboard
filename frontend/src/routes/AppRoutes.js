import React from 'react'
import {Routes,Route} from 'react-router-dom'
import AllClients from '../pages/Clients/AllClients'
import EditClients from '../pages/Clients/EditClients'
import DeleteClients from '../pages/Clients/DeleteClients'
import AllTasks from '../pages/Tasks/AllTasks'
import AllAdvisors from '../pages/Advisors/AllAdvisors'
import EditAdvisors from '../pages/Advisors/EditAdvisors'
import AllMeetings from '../pages/Meetings/AllMeetings'
import EditMeetings from '../pages/Meetings/EditMeetings'
import EditTasks from '../pages/Tasks/EditTasks'
import AddTasks from '../pages/Tasks/AddTasks'

const AppRoutes = () => {
    return (
        <div>
            <Routes>
                <Route path="clients" element={<AllClients/>} />
                <Route path='clients/:id/editClients' element={<EditClients/>} />
                {/* <Route path='clients/:id' element={<DeleteClients/>} /> */}

                <Route path='rowwisetasks' element={<AllTasks/>} />
                <Route path='rowwisetasks/:id/editRowWiseTasks' element={<EditTasks/>} />
                <Route path='rowwisetasks/addTask' element={<AddTasks/>} />

                <Route path='advisors' element={<AllAdvisors/>} />
                <Route path='advisors/:id/editAdvisors' element={<EditAdvisors/>} />

                <Route path='tasks' element={<AllMeetings/>} />
                <Route path='tasks/:id/editTasks' element={<EditMeetings/>} />

            </Routes>
        </div>
    )
}

export default AppRoutes;