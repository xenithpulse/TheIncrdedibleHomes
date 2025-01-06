import { Category } from "@/models/Category";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";
import mongoose from 'mongoose';

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  try {
    if (method === 'GET') {
      const categories = await Category.find(); 
      // Check if image field is returned in the categories list
      return res.json(categories);
    }

    if (method === 'POST') {
      const { name, image } = req.body;
    
      // Log the received data
      console.log("Received data:", { name, image });  // Add this log to check the received data
    
      // Validate if name and image are received
      if (!name || !image) {
        console.error('Missing required fields: Name and/or Image');
        return res.status(400).json({ message: 'Name and image are required' });
      }
    
      // Log the data before saving it
      console.log("Data before saving:", { name, image });
    
      try {
        const categoryDoc = await Category.create({ name, image });
        console.log("Data Sent to Mongo:", { name, image });
        console.log("Saved Category:", categoryDoc);  // This should show the image URL in the saved category
    
        return res.json(categoryDoc);
      } catch (error) {
        console.error('Error saving category:', error);
        return res.status(500).json({ message: 'Server error' });
      }
    }
    
    
    

    if (method === 'PUT') {
      const { name, image, _id } = req.body;
      if (!_id || !mongoose.Types.ObjectId.isValid(_id)) 
        return res.status(400).json({ message: 'Invalid ID' });

      const updatedData = {};
      if (name) updatedData.name = name;
      if (image) updatedData.image = image;

      const categoryDoc = await Category.findByIdAndUpdate(_id, updatedData, { new: true });
      if (!categoryDoc) 
        return res.status(404).json({ message: 'Category not found' });

      return res.json(categoryDoc);
    }

    if (method === 'DELETE') {
      const { _id } = req.query;
      if (!_id || !mongoose.Types.ObjectId.isValid(_id)) 
        return res.status(400).json({ message: 'Invalid ID' });

      const result = await Category.deleteOne({ _id });
      if (result.deletedCount === 0) 
        return res.status(404).json({ message: 'Category not found' });

      return res.json({ message: 'Category deleted successfully' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
