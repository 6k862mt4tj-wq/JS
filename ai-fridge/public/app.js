// public/app.js

  loadFridgeData();

  document.getElementById("fridgeForm").addEventListener("submit", async function(event) {
    event.preventDefault(); 
    const form = event.target;
    const formData = new FormData(form);
    const currentUsername = formData.get("username").trim();

    const dataObj = {
      username: currentUsername,
      name: formData.get("name"),
      count: Number(formData.get("count")),
      price: Number(formData.get("price")),
      expDate: formData.get("expDate")
    };
    
    const isSuccess = await sendProductRequest(dataObj, "Обработка...");
    
    if (isSuccess) {
      
      form.reset(); 
      form.elements["username"].value = currentUsername;
      
      const globalUser = document.getElementById("globalUsername");
      if (globalUser) globalUser.value = currentUsername;
    }
  });

  document.getElementById("recipeForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const username = document.getElementById("globalUsername").value.trim();
    const dishTitle = new FormData(event.target).get("dishTitle");
    const responseBox = document.getElementById("aiResponse");
    
    if (!username) return alert("Введите Ваше имя для запроса рецепта.");

    responseBox.style.display = "block";
    responseBox.innerHTML = "<i>Нейросеть составляет рецепт...</i>";

    try {
      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, dishTitle })
      });

      const result = await response.json();
      
      if (response.ok) {
        responseBox.innerText = result.recipe;
        
        if (result.ingredients) {
          
          for (const [name, reqCount] of Object.entries(result.ingredients)) {
            
            const existingTotal = currentFridge
              
              .filter(p => p.name === name)
              .reduce((sum, p) => sum + p.count, 0);
              
            if (existingTotal < reqCount) {
              suggestedItems.push({
                name: name, 
                count: reqCount - existingTotal,
                shoppingItem: true 
              });
            }
          }
          renderTable(); 
        }
      } else {
        responseBox.innerHTML = `<span class="error-text">Ошибка: ${result.error?.message}</span>`;
      }
    } catch (err) {
      responseBox.innerHTML = `<span class="error-text">Ошибка соединения</span>`;
    }
  });

let currentFridge = [];
let suggestedItems = [];

async function loadFridgeData() {
  try {
    const response = await fetch("/api/products");
    currentFridge = await response.json();
    renderTable();
  } catch (err) {
    console.error("Ошибка загрузки:", err);
  }
}

function renderTable() {
  const tbody = document.querySelector("#fridgeTable tbody");
  
  const allItems = [
    ...currentFridge.map(p => ({ ...p, shoppingItem: false })),
    ...suggestedItems
  ];

  if (allItems.length === 0) {
    tbody.innerHTML = "<tr><td colspan='6' class='empty-fridge'>Холодильник пуст</td></tr>";
    return;
  }

  tbody.innerHTML = allItems.map(p => `
    <tr style="${p.shoppingItem ? 'background-color: #f8fbff; color: #555;' : ''}">
      <td class="center-cell">
        <input type="checkbox" class="product-checkbox" 
               ${p.shoppingItem ? '' : 'checked disabled'} 
               onclick="${p.shoppingItem ? `handleCheckboxClick(event, '${p.name.replace(/'/g, "\\'")}', ${p.count})` : 'return false;'}">
      </td>
      <td>${p.name}</td>
      <td>${p.count}</td>
      <td>${p.price !== undefined ? p.price : '?'}</td>
      <td>${p.expDate || '<i>Добавьте дату</i>'}</td>
      <td>
        ${!p.shoppingItem 
          ? `<button type="button" class="btn-delete" onclick="deleteProduct('${p.name.replace(/'/g, "\\'")}', '${p.expDate}')">🗑️</button>` 
          : `<span style="font-size:0.8em; cursor:pointer;" title="Удалить из списка покупок" onclick="removeSuggestion('${p.name.replace(/'/g, "\\'")}')">❌</span>`
        }
      </td>
    </tr>
  `).join("");
}

window.handleCheckboxClick = function(event, name, count) {
  event.preventDefault(); 

  const form = document.getElementById("fridgeForm");
  
  form.elements["name"].value = name;
  form.elements["count"].value = count;
  
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 7);
  form.elements["expDate"].value = defaultDate.toISOString().split('T')[0];

  form.scrollIntoView({ behavior: "smooth", block: "center" });
  form.elements["price"].focus();

  suggestedItems = suggestedItems.filter(item => item.name !== name);
  renderTable();
};

window.removeSuggestion = function(name) {
  suggestedItems = suggestedItems.filter(item => item.name !== name);
  renderTable();
};

async function sendProductRequest(dataObj, pendingText) {
  const msgEl = document.getElementById("message");
  msgEl.innerText = pendingText;
  msgEl.className = "msg-pending";

  try {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataObj)
    });

    const result = await response.json();
    
    if (response.ok) {
      msgEl.className = "msg-success";
      msgEl.innerText = result.message;
      await loadFridgeData(); 
      return true;     
    } else {
      msgEl.className = "msg-error";
      msgEl.innerText = result.error?.message || "Ошибка";
      return false;
    }
  } catch (err) {
    msgEl.className = "msg-error";
    msgEl.innerText = "Ошибка соединения.";
    return false;
  }
}

window.deleteProduct = async function(name, expDate) {
  const username = document.getElementById("globalUsername").value.trim();
  if (!username) return alert("Укажите Ваше имя.");
  if (!confirm(`Удалить продукт "${name}"?`)) return;

  const dataObj = { username, name, count: 0, price: 0, expDate };
  await sendProductRequest(dataObj, "Удаление...");
};