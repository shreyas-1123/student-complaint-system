const complaintsContainer =
    document.getElementById("complaintsContainer");

async function loadComplaints() {

    try {

        const response =
            await fetch("/api/complaints");

        const complaints =
            await response.json();

        if (complaints.length === 0) {

            complaintsContainer.innerHTML =
                "<p>No complaints found.</p>";

            return;
        }

        complaintsContainer.innerHTML = "";

        complaints.forEach(complaint => {

            const complaintDiv =
                document.createElement("div");

            complaintDiv.className =
                "complaint-card";

            complaintDiv.innerHTML = `
                <h3>${complaint.title}</h3>

                <p>
                    <strong>Student:</strong>
                    ${complaint.name}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${complaint.email}
                </p>

                <p>
                    <strong>Category:</strong>
                    ${complaint.category}
                </p>

                <p>
                    <strong>Description:</strong>
                    ${complaint.description}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${complaint.status}
                </p>

                <select
                    onchange="updateStatus(${complaint.id}, this.value)"
                >

                    <option value="Pending"
                        ${complaint.status === "Pending" ? "selected" : ""}>
                        Pending
                    </option>

                    <option value="In Progress"
                        ${complaint.status === "In Progress" ? "selected" : ""}>
                        In Progress
                    </option>

                    <option value="Resolved"
                        ${complaint.status === "Resolved" ? "selected" : ""}>
                        Resolved
                    </option>

                </select>
            `;

            complaintsContainer.appendChild(complaintDiv);

        });

    } catch (error) {

        complaintsContainer.innerHTML =
            "<p>Unable to load complaints.</p>";

        console.error(error);
    }
}

async function updateStatus(id, status) {

    try {

        const response =
            await fetch(`/api/complaints/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    status: status
                })
            });

        const result =
            await response.json();

        if (response.ok) {

            alert(result.message);

            loadComplaints();

        } else {

            alert(result.message);
        }

    } catch (error) {

        alert("Unable to update complaint status.");

        console.error(error);
    }
}

loadComplaints();