import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';
import { BounceLoader } from "react-spinners";
import { LoaderWrapper } from "@/components/Dashboard/StyledComponents";

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null); // Single image
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false); // To track category loading

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    setIsLoadingCategories(true);
    axios.get('/api/categories')
      .then(result => {
        setCategories(result.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      })
      .finally(() => {
        setIsLoadingCategories(false);
      });
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);

      const data = new FormData();
      data.append('file', files[0]); // Allow only one image
  
      try {
        const res = await axios.post('/api/upload', data);
        const uploadedImage = res.data.links[0]; // Assuming the response contains a 'links' array
        console.log('Uploaded Image URL:', uploadedImage);
        setImage(uploadedImage); // Update image state
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsUploading(false);
      }
    }
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    if (!name || !image) {
      alert('Name and image are required');
      return;
    }
  
    console.log('Submitting category with:', { name, image });
  
    const data = { name, image };
    
    // Log the data being sent
    console.log("Category data being sent:", data); // Add this log to check the data being sent
  
    try {
      if (editedCategory) {
        data._id = editedCategory._id;
        await axios.put('/api/categories', data);
        setEditedCategory(null);
      } else {
        await axios.post('/api/categories', data);
        console.log("DATA POSTED: ", data); // Log the posted data after sending
      }
      setName('');
      setImage(''); // Clear the image state
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setImage(category.image); // Load existing image
  }

  function deleteCategory(category) {
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${category.name}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        const { _id } = category;
        if (_id) {
          try {
            await axios.delete(`/api/categories?_id=${_id}`);
            fetchCategories();
          } catch (error) {
            console.error('Error deleting category:', error);
          }
        } else {
          console.error('Invalid category ID');
        }
      }
    });
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Categories</h1>
      <label>
        {editedCategory
          ? `Edit category ${editedCategory.name}`
          : 'Create new category'}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            className="bg-black text-white border-white"
            placeholder="Category name"
            onChange={ev => setName(ev.target.value)}
            value={name}
          />
        </div>
        <div className="mb-4">
          <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
            {image ? (
              <img src={image} alt="Category" className="rounded-lg" />
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                <div>Add image</div>
              </>
            )}
            <input type="file" onChange={uploadImages} className="hidden" />
          </label>
          {isUploading && (
            <LoaderWrapper>
              <BounceLoader color="#36d7b7" />
            </LoaderWrapper>
          )}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName('');
                setImage(null);
              }}
              className="btn-default"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary py-1">
            Save
          </button>
        </div>
      </form>

      {/* Show BounceLoader when categories are loading */}
      {isLoadingCategories ? (
        <LoaderWrapper>
          <BounceLoader color="#36d7b7" />
        </LoaderWrapper>
      ) : (
        !editedCategory && (
          <table className="basic mt-4">
            <thead>
              <tr>
                <td>Category name</td>
                <td>Actions</td>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 &&
                categories.map(category => (
                  <tr key={category._id}>
                    <td>{category.name}</td>
                    <td>
                      {category.image && (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-16"
                        />
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => editCategory(category)}
                        className="btn-default text-white mr-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(category)}
                        className="btn-red"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
