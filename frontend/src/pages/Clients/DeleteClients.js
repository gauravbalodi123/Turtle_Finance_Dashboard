// import React, { useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// const DeleteClients = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     useEffect(() => {
//         const controller = new AbortController(); // ✅ Create an AbortController
//         const signal = controller.signal; 

//         const deleteClient = async () => {
//             try {
//                 console.log(`Deleting client with ID: ${id}...`);
//                 await axios.delete(`http://localhost:8000/clients/${id}`, { signal }); // ✅ Pass signal to API call
//                 alert("Client deleted successfully!");
//                 navigate("/clients");
//             } catch (error) {
//                 if (axios.isCancel(error)) {
//                     console.log("Delete request was canceled due to unmount.");
//                 } else {
//                     alert("Error deleting the client");
//                     console.error(error);
//                 }
//             }
//         };

//         deleteClient();

//         return () => {
//             console.log("Component unmounting, canceling request...");
//             controller.abort(); // ✅ Cleanup: Cancel request if component unmounts
//         };
//     }, [id, navigate]);

//     return null;
// };

// export default DeleteClients;
