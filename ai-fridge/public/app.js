  // public/app.js

  loadFridgeData();

  document.getElementById("fridgeForm").addEventListener("submit", async function(event) {
    event.preventDefault(); 
    const formData = new FormData(event.target);
    
    const dataObj = {
      username: formData.get("username").trim(),
      name: formData.get("name"),
      count: Number(formData.get("count")),
      price: Number(formData.get("price")),
      expDate: formData.get("expDate")
    };
  
    const isSuccess = await sendProductRequest(dataObj, "Обработка...");
    
    if (isSuccess) {
      const currentUsername = formData.get("username");
      event.target.reset(); 
    
      document.getElementById("globalUsername").value = currentUsername;
    }
  });

  document.getElementById("recipeForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const username = document.getElementById("globalUsername").value.trim();
    const dishTitle = new FormData(event.target).get("dishTitle");
    const responseBox = document.getElementById("aiResponse");
    const msgEl = document.getElementById("message");
    
    if (!username) {
      alert("Пожалуйста, введите Ваше имя в верхней форме авторизации.");
      return;
    }

    responseBox.style.display = "block";
    responseBox.innerHTML = "<i>Нейросеть составляет рецепт... Пожалуйста, подождите.</i>";

    try {
      
      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, dishTitle })
      });

      const result = await response.json();
      
      if (response.ok) {
        
        responseBox.innerText = result.recipe;

        if (result.ingredients && Object.keys(result.ingredients).length > 0) {
          msgEl.className = "msg-pending";
          msgEl.innerText = "Сохраняем новые продукты в холодильник...";

          try {
            const batchResponse = await fetch("/api/products", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: username,
                action: "batch_add",
                items: result.ingredients
              })
            });

            const batchResult = await batchResponse.json();

            if (batchResponse.ok) {
              msgEl.className = "msg-success";
              msgEl.innerText = batchResult.message || "Ингредиенты от Шефа успешно добавлены!";
              
              await loadFridgeData();
            } else {
              msgEl.className = "msg-error";
              msgEl.innerText = "Рецепт получен, но добавить продукты не удалось: " + (batchResult.error?.message || "Ошибка");
            }
          } catch (batchErr) {
            console.error("Ошибка при пакетном добавлении:", batchErr);
            msgEl.className = "msg-error";
            msgEl.innerText = "Ошибка сети при добавлении продуктов.";
          }
        }
      } else {
        responseBox.innerHTML = `<span class="error-text">Ошибка: ${result.error?.message || "Сбой API"}</span>`;
      }
    } catch (err) {
      responseBox.innerHTML = `<span class="error-text">Ошибка соединения с сервером</span>`;
    }
  });

async function loadFridgeData() {
  try {
    const response = await fetch("/api/products");
    const products = await response.json();
    const tbody = document.querySelector("#fridgeTable tbody");
    
    if (products.length === 0) {
      tbody.innerHTML = "<tr><td colspan='6' class='empty-fridge'>Холодильник пуст</td></tr>";
      return;
    }

    tbody.innerHTML = products.map(p => `
      <tr>
        <td class="center-cell"><input type="checkbox" class="product-checkbox" data-name="${p.name}"></td>
        <td>${p.name}</td>
        <td>${p.count}</td>
        <td>${p.price}</td>
        <td>${p.expDate}</td>
        <td><button type="button" class="btn-delete" onclick="deleteProduct('${p.name.replace(/'/g, "\\'")}', '${p.expDate}')">🗑️</button></td>
      </tr>
    `).join("");

  } catch (err) {
    console.error("Ошибка загрузки:", err);
  }
}

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
      loadFridgeData(); 
      return true;     
    } else {
      msgEl.className = "msg-error";
      msgEl.innerText = result.error?.message || "Неизвестная ошибка";
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
  if (!username) {
    alert("Укажите Ваше имя (Авторизация) для удаления продукта.");
    return;
  }
  if (!confirm(`Удалить продукт "${name}"?`)) return;

  const dataObj = {
    username: username,
    name: name,
    count: 0,
    price: 0, 
    expDate: expDate
  };

  await sendProductRequest(dataObj, "Удаление...");
};