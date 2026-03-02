document.addEventListener("DOMContentLoaded", () => {
  const dataList = document.getElementById("data-list");
  const dataForm = document.getElementById("data-form");
  const dataInput = document.getElementById("data-input");
  const editForm = document.getElementById("edit-form");
  const editField = document.getElementById("edit-field");
  const inputEl = document.querySelector(".edit-input-el");

  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await fetch("/data");
      const data = await response.json();
      dataList.innerHTML = ""; // Clear the list before rendering
      data.forEach((item) => {
        const li = document.createElement("li");
        const id = item.id;
        const text = item.text;
        li.dataset.id = id;
        li.classList.add("noteLi");
        dataList.appendChild(li);
        li.innerHTML = `<div class="divTxt" id="${id}">${text}</div>
            <div class="divBtns" data-id="${id}"><button class="delBtn" data-id="${id}"><strong>Delete</strong></button><button class="editBtn" data-id="${id}"><strong>Edit</strong></button></div>`;
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
        body: JSON.stringify(newData)
      });

      if (response.ok) {
        dataInput.value = ""; // Clear input field
        fetchData(); // Refresh the list
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
  });


  // Handle click event to delete data
  dataList.addEventListener("click", async (event) => {
    // Check if the clicked element is a delete button
    if (event.target.classList.contains("delBtn")) {
      const id = event.target.getAttribute("data-id");

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


  // Handle click event to enter edit-mode
  dataList.addEventListener("click", (event) => {
    // Check if the clicked element is an EDIT button
    if (event.target.classList.contains("editBtn")) {
      const id = event.target.getAttribute("data-id"); //get id
      const note = document.getElementById(id).textContent; //get text

      editForm.hidden = false;
      dataForm.hidden = true;
      dataList.hidden = true;
      editField.value = note;
      inputEl.dataset.id = id;
    }
  });


  // Handle submit form to UPDATE data
  editForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("ok");
    const id = inputEl.dataset.id;
    const updatedText = editField.value;

    try {
      const response = await fetch(`/data/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: updatedText }) });
      if (response.ok) {
        const result = await response.json();
        console.log(result.message);

        editForm.hidden = true;
        dataForm.hidden = false;
        dataList.hidden = false;

        fetchData();
      } else { alert("Failed"); }
    } catch (error) { console.error("Error updating data:", error); }
  });

  // Fetch data on page load
  fetchData();
});
