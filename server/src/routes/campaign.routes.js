import { Router } from "express";

const router = Router();
const campaigns = [];

router.get("/campaigns", (req, res) => {
  res.status(200).json({
    success: true,
    data: campaigns,
    count: campaigns.length
  });
});

router.post("/campaigns", (req, res) => {
  const { 
    name,
    subject,
    senderName,
    senderEmail,
    message,
    intervalSeconds,

    } = req.body;

    if (!name || !subject || !senderName || !senderEmail || !message || !intervalSeconds) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields"
    });
  }

  const interval = Number(intervalSeconds);
  if (isNaN(interval) || interval <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid interval seconds"
    });
  }

  const campaign = {
    id: crypto.randomUUID(),
    name,
    subject,
    senderName: senderName || "",
    senderEmail: senderEmail || "",
    message: message || "",
    intervalSeconds: interval,
    status: "draft",
    createdAt: new Date().toISOString(),
  };
  campaigns.push(campaign);

  res.status(201).json({
    success: true,
    message: "Campaign created successfully",
    data: campaign
  });
});

router.get("/campaigns/:id", (req, res) => {
  const { id } = req.params;
  const campaign = campaigns.find(c => c.id === id);

  if (!campaign) {
    return res.status(404).json({
      success: false,
      message: "Campaign not found"
    });
  }

  res.status(200).json({
    success: true,
    data: campaign
  });
});


export default router;