const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const dataFile = path.join(__dirname, "data", "complaints.json");

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

function readComplaints() {
    if (!fs.existsSync(dataFile)) {
        return [];
    }

    const data = fs.readFileSync(dataFile, "utf8");

    if (!data.trim()) {
        return [];
    }

    return JSON.parse(data);
}

function saveComplaints(complaints) {
    fs.writeFileSync(
        dataFile,
        JSON.stringify(complaints, null, 2)
    );
}

app.post("/api/complaints", (req, res) => {

    const {
        name,
        email,
        category,
        title,
        description
    } = req.body;

    if (!name || !email || !category || !title || !description) {
        return res.status(400).json({
            message: "All fields are required."
        });
    }

    const complaints = readComplaints();

    const complaint = {
        id: Date.now(),
        name: name,
        email: email,
        category: category,
        title: title,
        description: description,
        status: "Pending",
        createdAt: new Date().toISOString()
    };

    complaints.push(complaint);

    saveComplaints(complaints);

    res.status(201).json({
        message: "Complaint submitted successfully.",
        complaint: complaint
    });
});

app.get("/api/complaints", (req, res) => {

    const complaints = readComplaints();

    res.json(complaints);
});

app.put("/api/complaints/:id", (req, res) => {

    const complaints = readComplaints();

    const id = Number(req.params.id);

    const complaint = complaints.find(
        item => item.id === id
    );

    if (!complaint) {
        return res.status(404).json({
            message: "Complaint not found."
        });
    }

    complaint.status = req.body.status;

    saveComplaints(complaints);

    res.json({
        message: "Complaint status updated.",
        complaint: complaint
    });
});

app.listen(PORT, () => {
    console.log(
        `Student Complaint System running on port ${PORT}`
    );
});