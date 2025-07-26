// Add this to your pages folder as Debug.js for testing
import React from 'react';

const Debug = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const userInfo = localStorage.getItem('userInfo');

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>🔍 Debug Information</h2>
      <div style={{ background: '#f5f5f5', padding: '10px', margin: '10px 0' }}>
        <h3>LocalStorage Contents:</h3>
        <p><strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : 'NULL'}</p>
        <p><strong>Role:</strong> {role || 'NULL'}</p>
        <p><strong>UserInfo:</strong> {userInfo || 'NULL'}</p>
      </div>
      <div style={{ background: '#e8f4fd', padding: '10px', margin: '10px 0' }}>
        <h3>Parsed UserInfo:</h3>
        <pre>{JSON.stringify(JSON.parse(userInfo || '{}'), null, 2)}</pre>
      </div>
      <div style={{ background: '#fff2cc', padding: '10px', margin: '10px 0' }}>
        <h3>Actions:</h3>
        <button onClick={() => window.location.href = '/admin'}>Go to Admin (window.location)</button>
        <br /><br />
        <button onClick={() => localStorage.clear()}>Clear LocalStorage</button>
      </div>
    </div>
  );
};

export default Debug;