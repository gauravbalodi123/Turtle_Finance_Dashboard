import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";

const KYCUploadForm = () => {
  const { clientId } = useParams();
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [status, setStatus] = useState(null);
  const url = import.meta.env.VITE_URL;

  const handleDownload = async (type) => {
    try {
      const response = await axios.get(`${url}/admin/clients/${type}/download/${clientId}`, {
        responseType: 'blob',
        withCredentials: true
      });

      const fileBlob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;

      const extension = response.headers['content-type'].includes('pdf') ? '.pdf' : '';
      link.download = `${type.toUpperCase()}_${clientId}${extension}`;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(`Error downloading ${type} document:`, error);
      alert(`Failed to download ${type.toUpperCase()} document`);
    }
  };

  const handleFileUpload = async (file, type) => {
    if (!file) {
      setStatus({ type: 'error', msg: `Please select a ${type.toUpperCase()} file.` });
      return;
    }

    const formData = new FormData();
    formData.append(type, file);

    const endpoint = `${url}/admin/clients/${clientId}/${type}`;

    try {
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      setStatus({ type: 'success', msg: `${type.toUpperCase()} uploaded successfully.` });
    } catch (error) {
      const errMsg = error.response?.data?.msg || error.response?.data?.error || 'Upload failed.';
      setStatus({ type: 'error', msg: `${type.toUpperCase()} error: ${errMsg}` });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleFileUpload(aadhaarFile, 'aadhaar');
    await handleFileUpload(panFile, 'pan');
  };

  const containerStyle = {
    maxWidth: '500px',
    margin: '40px auto',
    background: '#fff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    fontFamily: 'Segoe UI, sans-serif'
  };

  const labelStyle = {
    display: 'block',
    fontWeight: '500',
    marginBottom: '6px'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    marginBottom: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc'
  };

  const buttonStyle = {
    width: '100%',
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px',
    fontSize: '15px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  };

  const statusStyle = {
    marginTop: '16px',
    fontSize: '14px',
    color: status?.type === 'success' ? 'green' : 'red'
  };

  const downloadButtonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '8px 12px',
    fontSize: '13px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '10px'
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Upload KYC Documents</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label style={labelStyle}>Aadhaar (PDF, JPG, PNG)</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setAadhaarFile(e.target.files[0])}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>PAN Card (PDF, JPG, PNG)</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setPanFile(e.target.files[0])}
            style={inputStyle}
          />
        </div>

        <button type="submit" style={buttonStyle}>
          Upload KYC Documents
        </button>

        {status && <div style={statusStyle}>{status.msg}</div>}
      </form>

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>Download Uploaded KYC</h3>
        <div style={buttonGroupStyle}>
          <button onClick={() => handleDownload('aadhaar')} style={downloadButtonStyle}>
            Download Aadhaar
          </button>
          <button onClick={() => handleDownload('pan')} style={downloadButtonStyle}>
            Download PAN
          </button>
        </div>
      </div>
    </div>
  );
};

export default KYCUploadForm;
