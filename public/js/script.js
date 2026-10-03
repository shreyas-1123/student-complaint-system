const complaintForm = document.getElementById("complaintForm");
const message = document.getElementById("message");

complaintForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const complaint = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        category: document.getElementById("category").value,
        title: document.getElementById("title").value,
        description: document.getElementById("description").value
    };

    try {

        const response = await fetch("/api/complaints", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(complaint)
        });

        const result = await response.json();

        if (response.ok) {

            message.textContent = result.message;
            message.style.color = "green";

            complaintForm.reset();

        } else {

            message.textContent = result.message;
            message.style.color = "red";

        }

    } catch (error) {

        message.textContent =
            "Unable to submit complaint. Please try again.";

        message.style.color = "red";

        console.error(error);
    }
});