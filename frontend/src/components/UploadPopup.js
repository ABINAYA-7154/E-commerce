import React, { useState } from 'react';
import axios from 'axios';

const UploadPopup = ({ onClose, onUploadSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert('Please select an image!');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('image', image);

    try {
      const token = localStorage.getItem('token');

      await axios.post('http://localhost:5000/api/designs/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Design uploaded successfully!');
      onUploadSuccess();  // Refresh parent data
      onClose();          // Close popup
    } catch (error) {
      alert('Upload failed.');
      console.error(error);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center',
      zIndex: 1000
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '10px',
        width: '320px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <h3>Upload Design</h3>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          rows={3}
        />

        <input
          type="number"
          placeholder="Price ₹"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
          min="0"
        />

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option value="Women">Women</option>
          <option value="Men">Men</option>
          <option value="Teen Girl">Teen Girl</option>
          <option value="Teen Boy">Teen Boy</option>
          <option value="Girl Child">Girl Child</option>
          <option value="Boy Child">Boy Child</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
          required
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit">ADD</button>
          <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>Close</button>
        </div>
      </form>
    </div>
  );
};

export default UploadPopup;
