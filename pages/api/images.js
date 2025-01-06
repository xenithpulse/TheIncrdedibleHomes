import { mongooseConnect } from '@/lib/mongoose';
import { Image } from '@/models/Images';
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;

  try {
    console.log(`[API] Request received: ${method}`);
    
    // Verify admin authentication
    await isAdminRequest(req, res);
    console.log(`[API] Admin authentication verified.`);

    // Connect to MongoDB
    await mongooseConnect();
    console.log(`[API] Connected to MongoDB.`);

    switch (method) {
      case 'GET': // Fetch all images
        try {
          console.log(`[API] Fetching images.`);
          const images = await Image.find().sort({ position: 1 });
          console.log(`[API] Images fetched successfully:`, images);
          res.status(200).json(images);
        } catch (error) {
          console.error(`[API] Error fetching images:`, error);
          res.status(500).json({ error: 'Failed to fetch images.' });
        }
        break;

        case 'POST': // Add a new image
        try {
          const newImageData = {
            ...req.body,
            position: Number(req.body.position), // Ensure position is a number
          };
          console.log(`[API] Processed data for new image:`, newImageData);
          const newImage = await Image.create(newImageData);
          console.log(`[API] New image added successfully:`, newImage);
          res.status(201).json(newImage);
        } catch (error) {
          console.error(`[API] Error adding image:`, error);
          res.status(400).json({ error: 'Failed to add image.' });
        }
        break;
      

      case 'PUT': // Update an image
        try {
          const { id } = req.body;
          console.log(`[API] Updating image with ID: ${id} and data:`, req.body);
          const updatedImage = await Image.findByIdAndUpdate(id, req.body, { new: true });
          console.log(`[API] Image updated successfully:`, updatedImage);
          res.status(200).json(updatedImage);
        } catch (error) {
          console.error(`[API] Error updating image:`, error);
          res.status(400).json({ error: 'Failed to update image.' });
        }
        break;

      case 'DELETE': // Delete an image
        try {
          const { id } = req.body;
          console.log(`[API] Deleting image with ID: ${id}`);
          await Image.findByIdAndDelete(id);
          console.log(`[API] Image deleted successfully.`);
          res.status(200).json({ message: 'Image deleted successfully.' });
        } catch (error) {
          console.error(`[API] Error deleting image:`, error);
          res.status(400).json({ error: 'Failed to delete image.' });
        }
        break;

      default:
        console.warn(`[API] Method not allowed: ${method}`);
        res.status(405).json({ error: `Method ${method} not allowed.` });
    }
  } catch (error) {
    console.error(`[API] General error:`, error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
