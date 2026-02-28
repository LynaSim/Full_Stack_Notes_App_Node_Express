document.addEventListener("DOMContentLoaded", () => {
    const dataList = document.getElementById("data-list");
    const dataForm = document.getElementById("data-form");
    const dataInput = document.getElementById("data-input");

    // Function to fetch data from the backend
    const fetchData = async () => {
        try {
            const response = await fetch("/data");
            const data = await response.json();
            dataList.innerHTML = ""; // Clear the list before rendering
            data.forEach((item) => {
                const li = document.createElement("li");
                //only display the text from json
                li.id = item.id;
                li.classList = "noteLi";
                li.textContent = item.text;
                // li.textContent = item.id + ": " + JSON.stringify(item);
                dataList.appendChild(li);
                //Adds a delete button element to each note, with ID atribute
                const delBtn = document.createElement("button");
                delBtn.textContent = "Delete note";
                delBtn.id = item.id;
                delBtn.classList.add("delBtn");
                li.appendChild(delBtn);
                
            });

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Handle form submission to add new data
    dataForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const newData = { text: dataInput.value };

        try {
            const response = await fetch("/data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newData),
            });

            if (response.ok) {
                dataInput.value = ""; // Clear input field
                fetchData(); // Refresh the list
            }
        } catch (error) {
            console.error("Error adding data:", error);
        }
    });

    // Handle form submission to delete data
  dataList.addEventListener("click", async (event) => {
    // Check if the clicked element is a delete button
    if (event.target.classList.contains("delBtn")) {
      const id = event.target.getAttribute("id");

      try {
        const response = await fetch(`/data/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchData(); // Refresh the list after deleting
        }
      } catch (error) {
        console.error("Error deleting data", error);
      }
    }
  });

    // Fetch data on page load
    fetchData();
});
