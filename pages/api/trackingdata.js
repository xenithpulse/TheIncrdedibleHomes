import { mongooseConnect } from '@/lib/mongoose';
import TrackingData from '@/models/TrackingData'; // The schema you provided
import { NextApiRequest, NextApiResponse } from 'next';



// The handler for the /api/trackingData endpoint
const handler = async (req = NextApiRequest, res = NextApiResponse) => {
  // Log the request

  // Handle GET requests
  if (req.method === 'GET') {
    try {
      // Connect to the database
      await mongooseConnect();

      // Retrieve tracking data from the database
      const trackingData = await TrackingData.find().populate('viewedProducts').exec();

      // Log the successful data retrieval
      console.log(`[API LOG] Successfully retrieved tracking data: ${trackingData.length} records`);

      // Return the tracking data
      return res.status(200).json({
        message: 'Tracking data retrieved successfully',
        data: trackingData,
      });
    } catch (error) {
      // Log the error
      console.error(`[API LOG] Error retrieving tracking data: ${error.message}`);

      // Return the error response
      return res.status(500).json({
        message: 'Error retrieving tracking data',
        error: error.message,
      });
    }
  } else {
    // If the request method is not GET, return a method not allowed error
    return res.status(405).json({
      message: 'Method Not Allowed',
    });
  }
};

export default handler;
