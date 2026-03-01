document.addEventListener("DOMContentLoaded", () => {
  const dataList = document.getElementById("data-list");
  const dataForm = document.getElementById("data-form");
  const dataInput = document.getElementById("data-input");
  const editMode = document.getElementById("edit-mode-div");

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
        //Adds a DELETE button element to each note, with ID attribute
        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete note";
        delBtn.id = item.id;
        delBtn.classList.add("delBtn");
        li.appendChild(delBtn);
        //Adds an EDIT button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit note";
        editBtn.id = item.id;
        editBtn.classList.add("editBtn");
        li.appendChild(editBtn);
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

  // Handle button click to delete data
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

  // Handle button click to edit data
  dataList.addEventListener("click", async (event) => {
    // Check if the clicked element is an EDIT button
    if (event.target.classList.contains("editBtn")) {
      const id = event.target.getAttribute("id");
      const response = await fetch(`/data/${id}`);
      const data = await response.json();
      textAreaValue = data.text;

      //Edit Mode
      editMode.innerHTML = `<textarea type="text" id="${id}" rows=10 />${textAreaValue}</textarea><button class="saveBtn" type="submit">Save</button>`;

      const textArea = document.querySelector("textarea");
      const saveBtn = document.querySelector(".saveBtn");
      saveBtn.addEventListener("click", async (event) => {
        const updatedValue = textArea.value;
        try {
          const response = await fetch(`/data/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: updatedValue })
          });

          if (response.ok) {
            const response = await fetch("/data");
            const data = await response.json();
            const updatedList = fetchData()
            editMode.innerHTML = updatedList;
          }
        } catch (error) {
          console.error("Error updating data", error);
        }
      });


      // //Edit Mode
      // editMode.innerHTML = `<textarea type="text" id="${id}" rows=10 />${textAreaValue}</textarea><button class="saveBtn" type="submit">Save</button>`;

      // const textArea = document.querySelector("textarea");
      // editMode.addEventListener("click", async (event) => {
      //   if (event.target.classList.contains("saveBtn")) {
      //     const updatedValue = textArea.value;
      //     editMode.innerHTML = `<p>${updatedValue} and id ${id}<p>`;
      //     const response = await fetch(`/data/${id}`, {
      //       method: "PUT",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({ text: updatedValue }),
      //     });
      //     fetchData();
      //   }
      // });
    }

  });

  // Fetch data on page load
  fetchData();
});
