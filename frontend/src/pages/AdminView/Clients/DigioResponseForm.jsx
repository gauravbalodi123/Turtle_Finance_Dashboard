import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";

const DigioResponseForm = () => {
  const { clientId } = useParams();
  const [digioDocId, setDigioDocId] = useState('');
  const [status, setStatus] = useState(null);
  const [digioResponses, setDigioResponses] = useState([]);
  const url = import.meta.env.VITE_URL;

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await axios.get(`${url}/admin/clients/${clientId}/digio-responses`, {
          withCredentials: true
        });
        setDigioResponses(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch Digio responses:', error);
      }
    };

    fetchResponses();
  }, [clientId, url]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!digioDocId.trim()) {
      setStatus({ type: 'error', msg: 'digio_doc_id is required.' });
      return;
    }

    try {
      const res = await axios.post(
        `${url}/admin/clients/${clientId}/digio-response`,
        { digio_doc_id: digioDocId },
        { withCredentials: true }
      );

      setStatus({ type: 'success', msg: res.data.msg });
      setDigioDocId('');

      const updated = await axios.get(`${url}/admin/clients/${clientId}/digio-responses`, {
        withCredentials: true
      });
      setDigioResponses(updated.data.data || []);
    } catch (error) {
      const msg = error.response?.data?.msg || 'Something went wrong while saving Digio response.';
      setStatus({ type: 'error', msg });
    }
  };

  return (
    <>
      <div className="digio-form-container">
        <h2 className="form-title">Add Digio Response</h2>
        <form onSubmit={handleSubmit} className="digio-form">
          <div className="form-group">
            <label className="form-label">Digio Document ID</label>
            <input
              type="text"
              value={digioDocId}
              onChange={(e) => setDigioDocId(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="submit-button">Submit</button>

          {status && (
            <p className={`status-msg ${status.type === 'success' ? 'success' : 'error'}`}>
              {status.msg}
            </p>
          )}
        </form>

        <div className="responses-section">
          <h3 className="responses-title">Previous Digio Responses</h3>
          {digioResponses.length === 0 ? (
            <p className="no-responses">No responses yet.</p>
          ) : (
            <ul className="responses-list">
              {digioResponses.map((resp) => (
                <li key={resp._id} className="response-item">
                  <p><strong>ID:</strong> {resp.digio_doc_id}</p>
                  <p><strong>Date:</strong> {
                    resp.timestamps ? new Date(resp.timestamps).toLocaleDateString() : 'N/A'
                  }</p>

                  <div className="response-actions">
                    {/*  <button
                      onClick={() =>
                        window.open(`${url}/admin/digioDownload?digio_doc_id=${resp.digio_doc_id}`, '_blank')
                      }
                      className="preview-button"
                    >
                      Preview
                    </button>*/}

                    <button
                      onClick={() => {
                        const width = 800;
                        const height = 600;
                        const left = (window.innerWidth - width) / 2;
                        const top = (window.innerHeight - height) / 2;

                        window.open(
                          `${url}/admin/digioDownload?digio_doc_id=${resp.digio_doc_id}`,
                          'DigioPreview',
                          `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
                        );
                      }}
                      className="preview-button"
                    >
                      Preview
                    </button>

                    <button
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to delete this response?")) {
                          try {
                            await axios.delete(`${url}/admin/digio-response`, {
                              params: { digio_doc_id: resp.digio_doc_id },
                              withCredentials: true,
                            });
                            setStatus({ type: 'success', msg: 'Response deleted.' });

                            const updated = await axios.get(`${url}/admin/clients/${clientId}/digio-responses`, {
                              withCredentials: true
                            });
                            setDigioResponses(updated.data.data || []);
                          } catch (error) {
                            setStatus({
                              type: 'error',
                              msg: error.response?.data?.msg || 'Failed to delete response.'
                            });
                          }
                        }
                      }}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Inline CSS */}
      <style>{`
        .digio-form-container {
          max-width: 500px;
          margin: 40px auto;
          padding: 24px;
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          font-family: 'Segoe UI', sans-serif;
        }

        .form-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-label {
          display: block;
          margin-bottom: 6px;
          font-size: 14px;
          color: #333;
        }

        .form-input {
          width: 100%;
          padding: 10px;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }

        .submit-button {
          width: 100%;
          background-color: #28a745;
          color: white;
          padding: 10px;
          font-size: 15px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .submit-button:hover {
          background-color: #218838;
        }

        .status-msg {
          margin-top: 10px;
          font-size: 14px;
        }

        .status-msg.success {
          color: green;
        }

        .status-msg.error {
          color: red;
        }

        .responses-section {
          margin-top: 30px;
        }

        .responses-title {
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 10px;
        }

        .no-responses {
          font-size: 14px;
          color: #777;
        }

        .responses-list {
          list-style: none;
          padding: 0;
        }

        .response-item {
          background-color: #f8f8f8;
          padding: 14px;
          border-radius: 8px;
          margin-bottom: 12px;
          border: 1px solid #ddd;
        }

        .response-actions {
          margin-top: 10px;
          display: flex;
          gap: 10px;
        }

        .preview-button,
        .delete-button {
          padding: 6px 12px;
          font-size: 13px;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .preview-button {
          background-color: #007bff;
        }

        .preview-button:hover {
          background-color: #0056b3;
        }

        .delete-button {
          background-color: #dc3545;
        }

        .delete-button:hover {
          background-color: #c82333;
        }
      `}</style>
    </>
  );
};

export default DigioResponseForm;
