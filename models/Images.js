import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  position: { type: Number, required: true }, // Ensure `position` is stored as a number
}, { timestamps: true });

export const Image = mongoose.models.Image || mongoose.model('Image', ImageSchema);
