document.addEventListener("DOMContentLoaded", function () {
  const cartItems = document.querySelectorAll(".cart-item");
  const subtotalElement = document.querySelector(".summary-row span:nth-child(2)");
  let subtotal = 21200; // Initial subtotal value

  function updateSubtotal() {
      let newSubtotal = 0;
      document.querySelectorAll(".cart-item").forEach(item => {
          const price = parseFloat(item.querySelector(".cart-item-price").textContent.replace("$", "").replace(",", ""));
          const quantity = parseInt(item.querySelector(".quantity-control span").textContent);
          newSubtotal += price * quantity;
      });
      subtotal = newSubtotal;
      subtotalElement.textContent = `$${subtotal.toLocaleString()}`;
      updateTotal();
  }

  function updateTotal() {
      const shipping = 250;
      const tax = subtotal * 0.08; // 8% tax
      const insurance = 150;
      const total = subtotal + shipping + tax + insurance;
      document.querySelector(".summary-row.total span:nth-child(2)").textContent = `$${total.toLocaleString()}`;
  }

  cartItems.forEach(item => {
      const minusBtn = item.querySelector(".quantity-control button:first-child");
      const plusBtn = item.querySelector(".quantity-control button:last-child");
      const quantitySpan = item.querySelector(".quantity-control span");
      const removeBtn = item.querySelector(".remove-item");

      plusBtn.addEventListener("click", function () {
          let quantity = parseInt(quantitySpan.textContent);
          quantity++;
          quantitySpan.textContent = quantity;
          updateSubtotal();
      });

      minusBtn.addEventListener("click", function () {
          let quantity = parseInt(quantitySpan.textContent);
          if (quantity > 1) {
              quantity--;
              quantitySpan.textContent = quantity;
              updateSubtotal();
          }
      });

      removeBtn.addEventListener("click", function () {
          item.remove();
          updateSubtotal();
      });
  });

  updateTotal(); // Initial update
});
