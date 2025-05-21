import React, { Fragment } from 'react'
import styles from '../../../styles/AdminLayout/RowWiseTasks/AllRowWiseTasks.module.css';
import { MdOutlineErrorOutline } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";
import { FaRegClock } from "react-icons/fa";

const AllBookings = () => {
  return (
    <div className='container-fluid'>
      <div className='d-flex align-items-center justify-content-between '>

        <div className='d-flex align-items-center justify-content-start mb-3 '>
          <div>
            <h4 className={`  ${styles.taskHeaderItem} fw-bold mb-1`}>View Bookings</h4>
            <p className={`  ${styles.taskHeaderItem}`}>Book and track tasks for all clients and advisors</p>
          </div>

        </div>

        <button
          className="btn btn-custom-turtle-background"
          data-bs-toggle="modal"
          data-bs-target="#addTaskModal"
        >
          Create New Booking
        </button>

      </div>


      <Fragment>

        <div className='mb-4 align-items-center row gx-3 gy-3 gy-lg-0'>

          <div className="col-12 col-lg-4 text-center text-md-start">
            <div className={`card p-4 ${styles}`}>
              <h4 className="d-flex gap-2 align-items-center fs-5 fw-bold">
                <GrStatusGood className="d-block text-success " />
                Total Bookings
              </h4>
              <p className="fs-6 mb-2">All scheduled meetings</p>
              <h2 className='fs-4 m-0 fw-bolder'>10</h2>
            </div>
          </div>

          <div className="col-12 col-lg-4 text-center text-md-start">
            <div className={`card p-4 ${styles}`}>
              <h4 className="d-flex gap-2 align-items-center fs-5 fw-bold">
                <FaRegClock className="d-block text-danger " />
                Upcoming
              </h4>
              <p className="fs-6 mb-2">Future meetings</p>
              <h2 className='fs-4 m-0 fw-bolder'>24</h2>
            </div>
          </div>



          <div className="col-12 col-lg-4 text-center text-md-start">
            <div className={`card p-4 ${styles}`}>
              <h4 className="d-flex gap-2 align-items-center fs-5 fw-bold">
                <MdOutlineErrorOutline className="d-block text-warning fs-4" />
                Completed
              </h4>
              <p className="fs-6 mb-2">Successfully held meetings</p>
              <h2 className='fs-4 m-0 fw-bolder'>50</h2>
            </div>
          </div>

        </div>
      </Fragment>


    </div>
  )
}

export default AllBookings