const Resource = require("../models/Resource");

exports.getResources = async (req, res) => {
  try {
    const { type, category, search, featured } = req.query;
    const query = {};

    if (type && type !== "All") query.resourceType = type;
    if (category && category !== "All") query.category = category;
    if (featured === "true") query.featured = true;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const resources = await Resource.find(query).sort({ featured: -1, createdAt: -1 });
    res.json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
