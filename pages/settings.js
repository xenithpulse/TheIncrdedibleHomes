import React, { useState, useEffect } from 'react';
import styled from '@/components/settingstyled.js';
import Layout from '@/components/Layout';
import BounceLoader from 'react-spinners/BounceLoader';

export default function ManageImages() {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({ title: '', url: '', position: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/images');
      if (!res.ok) throw new Error('Failed to fetch images');
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching images:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.links && data.links.length > 0) {
        return data.links[0];
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    setLoading(true);
    try {
      await fetch('/api/images', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...formData, id: editingId } : formData),
      });
      fetchImages();
      setFormData({ title: '', url: '', position: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error submitting data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadedUrl = await handleFileUpload(file);
      if (uploadedUrl) {
        setFormData((prevData) => ({ ...prevData, url: uploadedUrl }));
      }
    }
  };

  const handleEdit = (image) => {
    setEditingId(image._id);
    setFormData({ title: image.title, url: image.url, position: image.position });
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await fetch('/api/images', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <styled.Container>
        <styled.Header>Manage Images</styled.Header>
        <styled.Form onSubmit={handleSubmit}>
          <styled.Input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <styled.Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required={!editingId}
          />
          {formData.url && <img src={formData.url} alt="Preview" style={{ maxWidth: '200px', marginTop: '10px' }} />}
          <styled.Input
            type="number"
            placeholder="Position (Optional)"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          />
          <styled.Button type="submit" disabled={uploading || loading}>
            {uploading ? 'Uploading...' : editingId ? 'Update' : 'Add'} Image
          </styled.Button>
        </styled.Form>

        {loading ? (
          <styled.LoaderWrapper>
            <BounceLoader color="#0070f3" />
          </styled.LoaderWrapper>
        ) : (
          <styled.List>
            {images.map((image) => (
              <styled.ListItem key={image._id}>
                <img src={image.url} alt={image.title} />
                <div>
                  <h3>{image.title}</h3>
                  <p>Position: {image.position}</p>
                </div>
                <styled.ButtonGroup>
                  <styled.Button onClick={() => handleEdit(image)}>Edit</styled.Button>
                  <styled.Button onClick={() => handleDelete(image._id)}>Delete</styled.Button>
                </styled.ButtonGroup>
              </styled.ListItem>
            ))}
          </styled.List>
        )}
      </styled.Container>
    </Layout>
  );
}
