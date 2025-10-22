// src/routes/AdvisorRoutes.jsx
import React from 'react'
import { useRoutes } from 'react-router-dom'
import AllMeetings from '../pages/AdvisorView/Meetings/AllMeetings'
import AllBookings from '../pages/AdvisorView/Bookings/AllBookings'
import AllClients from '../pages/AdvisorView/Clients/AllClients'

const AdvisorRoutes = () => {
    const routes = [

        { path: '/advisor/clients', element: <AllClients /> },


        { path: '/advisor/meetingNotes', element: <AllMeetings /> },


        { path: '/advisor/bookings', element: <AllBookings /> },
    ]

    return useRoutes(routes)
}

export default AdvisorRoutes;
