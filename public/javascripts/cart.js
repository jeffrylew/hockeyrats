// Note: Classes are unsupported in Internet Explorer

// *** Shopping Cart Item ***
class Item {
  // *** Item constructor ***
  constructor(name, price, qty) {
    this.name  = name;
    this.price = price;
    this.qty   = qty;
  }
}

// *** Shopping Cart ***
class Cart {
  // *** Cart constructor ***
  constructor() {
    this.cart = [];
    this.totalItems = 0;
    this.totalPrice = 0;
  }

  // *** Return totalItems ***
  getTotalItems() {
    return Number(this.totalItems);
  }

  // *** Return totalPrice truncated to two decimal places ***
  getTotalPrice() {
    return this.totalPrice.toFixed(2);
  }

  // *** Load self from sessionStorage ***
  load() {
    const strArray = sessionStorage.getItem('hockeyrats-cart');

    if (strArray != null) {
      const JSONArray = JSON.parse(strArray);

      // Set totalItems and totalPrice
      this.totalItems = JSONArray.totalItems;
      this.totalPrice = JSONArray.totalPrice;

      // Clear cart before loading
      this.cart.splice(0, this.cart.length);

      // Convert each JSON object into an Item object
      JSONArray.cart.forEach(obj => {
        this.cart.push(new Item(obj.name, obj.price, obj.qty));
      });

    } // if (strArray != null)

  } // load()

  // *** Save self to sessionStorage ***
  save() {
    sessionStorage.setItem('hockeyrats-cart', JSON.stringify(this));
  }

  // *** Add new item to cart or update count of existing item ***
  addItem(name, price) {
    // If item already exists in cart, update its count
    for (let item of this.cart) {
      if (item.name === name) {
        item.qty++;
        this.totalItems++;
        this.totalPrice += item.price;

        this.save();
        return;
      }

    } // for (let item of this.cart)

    // Item doesn't exist in cart, add it
    this.cart.push(new Item(name, price, 1));
    this.totalItems++;
    this.totalPrice += price;
    this.save();

  } // addItem(name, price)

  // *** Remove existing item from cart ***
  removeItem(name) {
    for (let i = 0; i < this.cart.length; i++) {
      if (this.cart[i].name === name) {
        this.cart[i].qty--;
        this.totalItems--;
        this.totalPrice -= this.cart[i].price;

        if (this.cart[i].qty === 0) {
          this.cart.splice(i, 1);
        }
        break;
      }
      
    } // for (let i = 0; i < this.cart.length; i++)

    this.save();

  } // removeItem(name)

  // *** Remove all instances of item from cart ***
  removeItemAll(name) {
    for (let i = 0; i < this.cart.length; i++) {
      if (this.cart[i].name === name) {
        this.totalItems -= this.cart[i].qty;
        this.totalPrice -= this.cart[i].qty * this.cart[i].price;

        this.cart.splice(i, 1);
        break;
      }
      
    } // for (let i = 0; i < this.cart.length; i++)

    this.save();

  } // removeItemAll(name)

  // *** Remove all items from cart ***
  clear() {
    this.cart.splice(0, this.cart.length);
    this.totalItems = 0;
    this.totalPrice = 0;
    this.save();
  }

  // *** Display items in cart ***
  display() {
    let table_contents = "";

    if (!Array.isArray(this.cart) || !this.cart.length) {
      // Array does not exist, is not an array, or is empty
      table_contents = "Your cart is empty"

      // Clear cart notification badge
      $('#cart-total-items').empty();

      // Hide Clear Cart link
      $('#clear-cart').addClass('d-none');

      // Hide cart total
      $('#cart-total-price').empty();

      // Disable Order Now button
      $('#order-btn').prop('disabled', true);

    } else {
      this.cart.forEach(item => {
        table_contents += "<tr>"
          + "<td><button type='button' class='close float-left delete-item' aria-label='Delete cart item' data-name='" + item.name + "'><span aria-hidden='true'>&times;</span></button></td>"
          + "<td>" + item.name.substr(0, 11) + "<br class='d-inline d-md-none'>" + item.name.substr(11) + "</td>"
          + "<td class='row justify-content-center'><button class='col-sm-3 col-lg-2 btn btn-outline-info btn-sm increment-qty' data-name='" + item.name + "' data-price='" + item.price + "'>&#65291;</button><span class='col-sm-3'>"
          + item.qty
          + "</span><button class='col-sm-3 col-lg-2 btn btn-outline-info btn-sm decrement-qty' data-name='" + item.name + "'>&#65293;</button></td>"
          + "<td>$" + Number(item.qty * item.price).toFixed(2) + "</td>"
          + "</tr>"
      });

      // Set cart notification badge if totalItems > 0
      $('#cart-total-items').html(this.getTotalItems());

      // Show Clear Cart link
      $('#clear-cart').removeClass('d-none');

      // Evaluate cart total if totalItems > 0
      $('#cart-total-price').html("Total: $" + this.getTotalPrice());

      // Enable Order Now button
      $('#order-btn').prop('disabled', false);

    } // else -> if (!Array.isArray(this.cart) || ...

    $('#cart-table tbody').html(table_contents);

  } // display()

} // class Cart


// *** Create/load shopping cart ***
let cart = new Cart();
cart.load();
cart.display();


// *** Triggers/Events ***

// *** Add item to cart ***
$('.add-to-cart').click(event => {
  event.preventDefault();

  const btn   = $(event.target).closest("button");
  const name  = btn.data('name');
  const price = Number(btn.data('price'));

  cart.addItem(name, price);
  cart.display();

  // For small screen sizes, display alert under top navbar
  $('.alert-fixed #cart-item-name').html(name);
  $('.alert-fixed').removeClass('d-none');

  // Auto-close alert after 3 seconds
  setTimeout(() => {
    $('.alert-fixed').addClass('d-none');
  }, 3000);
});

// *** Clear all items from cart ***
$('#clear-cart').click(event => {
  event.preventDefault();

  cart.clear();
  cart.display();
});

// *** Increment item quantity ***
$('#cart-table').on("click", ".increment-qty", event => {
  const btn   = $(event.target);
  const name  = btn.data('name');
  const price = Number(btn.data('price'));

  cart.addItem(name, price);
  cart.display();
});

// *** Decrement item quantity ***
$('#cart-table').on("click", ".decrement-qty", event => {
  const btn = $(event.target);
  cart.removeItem(btn.data('name'));
  cart.display();
});

// *** Remove all instances of item button ***
$('#cart-table').on("click", ".delete-item", event => {
  const btn = $(event.target).closest("button");
  cart.removeItemAll(btn.data('name'));
  cart.display();
});
