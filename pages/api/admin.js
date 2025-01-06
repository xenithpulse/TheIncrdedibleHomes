import bcrypt from "bcrypt";
import Admin from "@/models/Admin";
import { mongooseConnect } from "@/lib/mongoose"; // Your database connection helper

export default async function handler(req, res) {
  await mongooseConnect(); // Connect to MongoDB
  const { method } = req;
  const log = console.log;

  log(`[Admin API] Request method: ${method}`);

  try {
    switch (method) {
      case "GET":
        log(`[Admin API] Fetching all admins`);
        const admins = await Admin.find({}, { password: 0 }); // Exclude password in response
        res.status(200).json(admins);
        break;

      case "POST":
        log(`[Admin API] Adding a new admin`);
        const { username, password } = req.body;
        if (!username || !password) {
          res.status(400).json({ message: "Username and password are required" });
          return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await Admin.create({ username, password: hashedPassword });
        res.status(201).json(newAdmin);
        break;

      case "PUT":
        log(`[Admin API] Updating an admin`);
        const { id, newUsername, newPassword } = req.body;
        if (!id) {
          res.status(400).json({ message: "Admin ID is required" });
          return;
        }

        const updateData = {};
        if (newUsername) updateData.username = newUsername;
        if (newPassword) updateData.password = await bcrypt.hash(newPassword, 10);

        const updatedAdmin = await Admin.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json(updatedAdmin);
        break;

      case "DELETE":
        log(`[Admin API] Deleting an admin`);
        const { deleteId } = req.body;
        if (!deleteId) {
          res.status(400).json({ message: "Admin ID is required" });
          return;
        }

        await Admin.findByIdAndDelete(deleteId);
        res.status(200).json({ message: "Admin deleted successfully" });
        break;

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    log(`[Admin API] Error: ${error.message}`);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
