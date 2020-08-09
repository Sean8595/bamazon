var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "seanmelvin8595",
  database: "bamazondb"
});
//starts the function to see if the user wants to buy or quit
start();
function updateProduct(newBuy, newAmount) {
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        "stock_quantity": newAmount
      },
      {
        "item_id": newBuy
      }
    ],
    function (err, res) {
      if (err) throw err;
      console.log("You have restocked the item")
      restockInv();
    }
  )
}
function start() {
  inquirer.prompt([
    {
      name: "buy_leave",
      type: "list",
      choices: ["Buy", "Quit", "Manager View"],
      message: "Would you like to buy, quit, or be the manager?"
    }
  ]).then(function (enter) {
    if (enter.buy_leave === "Buy") {
      readProducts()
    }
    else if (enter.buy_leave === "Manager View") {
      managerView()
    }
    else {
      console.log("BYE BYE")
      connection.end()
    }
  }
  )
}

//This is the function for the manager view
function managerView() {
  //   connection.query("SELECT * FROM products", function (err, res) {
  // if (err) throw err;
  // console.table(res)
  inquirer.prompt([
    {
      name: "manage",
      type: "list",
      choices: ["View Inv", "Check Low Inv", "Restock Inv", "Add New Product", "Exit"],
      message: "What would you like to do?"
    }
  ]).then(function (enter) {
    if (enter.manage === "View Inv") {
      connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res)
      })
      inquirer.prompt([
        {
          name: "return",
          type: "list",
          choices: ["Return", "Exit"]
        }
      ]).then(function (enter) {
        if (enter.return === "Return") {
          managerView();
        }
        else {
          connection.end
        }
      })
    }
    else if (enter.manage === "Check Low Inv") {
      lowInvCheck()
    }
    else if (enter.manage === "Restock Inv") {
      restockInv()
    }
    else if (enter.manage === "Add New Product") {
      addNew()
    }
    else {
      console.log("BYE BYE")
      connection.end()
    }
  }
  )
}

//this function checks low inventory 
function lowInvCheck() {
  connection.query("SELECT product_name, stock_quantity FROM products", function (err, res, fields) {
    for (let i = 0; i < res.length; i++) {
      if (res[i].stock_quantity <= 5) {
        console.log(res[i].product_name + " is running low it has " + res[i].stock_quantity + " items remaining")

      }
    }
    inquirer.prompt([
      {
        name: "return",
        type: "list",
        choices: ["Return", "Exit"]
      }
    ]).then(function (enter) {
      if (enter.return === "Return") {
        managerView();
      }
      else {
        connection.end
      }
    })
  })
}
//this function restocks the product


// function restockInv() {
//   connection.query("SELECT * FROM products", function (err, res) {
//     inquirer.prompt([
//       {
//         name: "restock",
//         type: "input",
//         message: "What would you like to restock?",
//         validate: function (value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       }

//     ]).then(function(answer){

//     }
//     )
//   })
// }

function restockInv() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.table(res)
    inquirer
      .prompt([
        {
          name: "buy",
          type: "input",
          message: "Which Item would you to restock? ",
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      //end of first prompt
      .then(function (answer) {
        connection.query("SELECT * FROM products", function (err, res) {
          if (err) throw err;
          if (answer.buy > res.length) {
            console.log("Please enter a valid number")
            restockInv()
          }
          for (let j = 0; j < res.length; j++) {
            //this top part will look at the products and check if it exist in the database
            if (res[j].item_id == answer.buy) {
              var inStock = res[j].stock_quantity;
              inquirer
                .prompt([
                  {
                    name: "amount",
                    type: "input",
                    message: "How many would you like to add?",
                    validate: function (value) {
                      if (isNaN(value) === false) {
                        return true;
                      }
                      return false;
                    }
                  }
                  //checks for the user to put in a number and stores it as a variable
                ])
                .then(function (response) {
                  var newBuy = answer.buy;
                  var userAmount = response.amount;

                  // if (userAmount > inStock) {
                  //   console.log("Im Sorry there isnt enough in stock")
                  //   start()
                  // }
                  // else {



                  var newAmount = Number(inStock) + Number(userAmount);
                  console.log(newAmount)
                  // var payment = parseFloat(userAmount * price).toFixed(2)
                  updateProduct(newBuy, newAmount);
                  // }

                  //update product function used to decreese and increase 
                }

                )
            }

          }
        },
        )
      }
      )
  }
  )
}
//Function for adding new products to the the list provided
function addNew() {
  inquirer.prompt([
    {
      name: "adding",
      type: "input",
      message: "What is the name of the item you want to add?"
    },
    {
      name: "department",
      type: "input",
      message: "what department is it in?"
    },
    {
      name: "priceInput",
      type: "input",
      message: "How much does it cost?"
    },
    {
      name: "quant",
      type: "input",
      message: "How many are you entering?"
    }
  ]).then(function (answer) {
    connection.query("INSERT INTO products SET ?", {
      product_name: answer.adding,
      department_name: answer.department,
      price: answer.priceInput,
      stock_quantity: answer.quant
    },
      function (err, res) {
        if (err) throw err;
        console.log("Your product was added succesfully!");

        start();
      })
  })
}


//this function starts the inquirer prompts and begins when the app is launched

//function that displays the products and uses inquirer
function readProducts() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.table(res)
    inquirer
      .prompt([
        {
          name: "buy",
          type: "input",
          message: "Which Item would you like? ",
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      //end of first prompt
      .then(function (answer) {
        connection.query("SELECT * FROM products", function (err, res) {
          if (err) throw err;
          if (answer.buy > res.length) {
            console.log("Please enter a valid number")
            readProducts()
          }
          for (let j = 0; j < res.length; j++) {
            //this top part will look at the products and check if it exist in the database
            if (res[j].item_id == answer.buy) {
              var inStock = res[j].stock_quantity;
              var price = res[j].price
              inquirer
                .prompt([
                  {
                    name: "amount",
                    type: "input",
                    message: "How many would you like to order?",
                    validate: function (value) {
                      if (isNaN(value) === false) {
                        return true;
                      }
                      return false;
                    }
                  }
                  //checks for the user to put in a number and stores it as a variable
                ])
                .then(function (response) {
                  var newBuy = answer.buy;
                  var userAmount = response.amount;
                  if (userAmount > inStock) {
                    console.log("Im Sorry there isnt enough in stock")
                    start()
                  }
                  else {
                    var newAmount = inStock - userAmount;
                    var payment = parseFloat(userAmount * price).toFixed(2)
                    updateProduct(newBuy, newAmount);
                  }

                  //update product function used to decreese and increase 
                  function updateProduct(newBuy, newAmount) {
                    var query = connection.query(
                      "UPDATE products SET ? WHERE ?",
                      [
                        {
                          "stock_quantity": newAmount
                        },
                        {
                          "item_id": newBuy
                        }
                      ],
                      function (err, res) {
                        if (err) throw err;
                        console.log("*KA CHING* \n");
                        console.log("You Paid $" + payment)
                        start();
                      }
                    )
                  }
                }

                )
            }

          }
        },
        )
      }
      )
  }
  )
}

//TO DO:
//Make a way to get out of the app with a quit function
//done

//make the app check to see if the product is there
//sorta done

//make the app remove inventory by the amount they put in
//done

//show how much the user payed for the item
//done

//if the user inputs more than what was in stock have it return "not enough instock"
//done

//make the table look neat








//connect to data base (reference class activities) like top 5000 activtiy
//test if the connection works, if it works run prompt User function

//in prompt function
//  display available products with the id numbers
// ask user for ID number they want
//Can be a list or input
//check if the ID number exist in database with query in data base tables
//select * from products where id = userResponse
//when you get a response from database check if the length of response is greater than 0 (knows its a matching product)
//if not, tell user item doesnt exist and call prompt user function again (recursion)

//use Inquierer again to ask for how many they want
//check the quantity from the database query response to see if its greater than or equal to the number the user wants (if statement)
//if the users request a greater amount than recursion ask again

//if there are enough in stock, query the data base to update the new quanity,calculate the new quantiy by subtracting users imput from current (check greatbay basic)'
//UPDATE the products and set the quanitiy to the new value to new quantity where the new id is the ID that the user chose
//tell the user their purchas was successful and tell them how much they paid
//multiply quantity by price of the item (dec to 2 places)
//console log the response to check that its working
