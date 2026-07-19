
const form = document.getElementById("campaignForm");
const result = document.getElementById("result");
const campaignList = document.getElementById("campaignList");
const submitButton = document.getElementById("submitButton");
const refreshButton = document.getElementById("refreshButton");

function showResult(message, type) {
  result.hidden = false;
  result.textContent = message;
  result.className = `result ${type}`;
}

function parseRecipients(value) {
  return [
    ...new Set(
      value
        .split(/[\n,;]+/)
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean)
    ),
  ];
}

async function createCampaign(event) {
  event.preventDefault();

  result.hidden = true;
  submitButton.disabled = true;
  submitButton.textContent = "Creating...";

  const recipients = parseRecipients(
    document.getElementById("recipients").value
  );

  if (recipients.length === 0) {
    showResult("Enter at least one recipient.", "error");
    submitButton.disabled = false;
    submitButton.textContent = "Create campaign";
    return;
  }

  const campaignData = {
    name: document.getElementById("name").value.trim(),
    senderName:
      document.getElementById("senderName").value.trim(),
    senderEmail:
      document.getElementById("senderEmail").value.trim(),
    subject:
      document.getElementById("subject").value.trim(),
    message:
      document.getElementById("message").value.trim(),
    intervalSeconds: Number(
      document.getElementById("intervalSeconds").value
    ),
    recipients,
  };

  try {
    const response = await fetch("/api/campaigns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(campaignData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not create campaign");
    }

    showResult(
      `Campaign created with ${recipients.length} recipient(s).`,
      "success"
    );

    form.reset();
    document.getElementById("intervalSeconds").value = 30;

    await loadCampaigns();
  } catch (error) {
    console.error(error);
    showResult(error.message, "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Create campaign";
  }
}

async function loadCampaigns() {
  campaignList.textContent = "Loading campaigns...";

  try {
    const response = await fetch("/api/campaigns");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not load campaigns");
    }

    if (!data.data || data.data.length === 0) {
      campaignList.textContent = "No campaigns have been created.";
      return;
    }

    campaignList.innerHTML = data.data
      .map((campaign) => {
        const recipientCount =
          campaign._count?.recipients ?? 0;

        return `
          <article class="campaign">
            <h3>${escapeHtml(campaign.name)}</h3>

            <p>
              <strong>Subject:</strong>
              ${escapeHtml(campaign.subject)}
            </p>

            <p>
              <strong>Status:</strong>
              ${escapeHtml(campaign.status)}
            </p>

            <p>
              <strong>Recipients:</strong>
              ${recipientCount}
            </p>

            <p>
              <strong>Interval:</strong>
              ${campaign.intervalSeconds} seconds
            </p>
          </article>
        `;
      })
      .join("");
  } catch (error) {
    console.error(error);
    campaignList.textContent = error.message;
  }
}

function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = String(value ?? "");
  return element.innerHTML;
}

form.addEventListener("submit", createCampaign);
refreshButton.addEventListener("click", loadCampaigns);

loadCampaigns();