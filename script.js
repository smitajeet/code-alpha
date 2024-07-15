document.querySelector('header').style.width = window.innerWidth
const transactions = JSON.parse(localStorage.getItem("subham-expense-tracker")) || [];

const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  signDisplay: "always",
});

const list = document.getElementById("transactionList");
const form = document.getElementById("transactionForm");
const Status = document.getElementById("status");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
document.querySelector('#type').addEventListener('change', (e) => {
  console.log(e.target.checked)
  if (e.target.checked == true) {
    document.querySelector('#expenseSpan').style.backgroundColor = 'transparent'
    document.querySelector('#incomeSpan').style.backgroundColor = '#50C878'
  }
  else {
    document.querySelector('#incomeSpan').style.backgroundColor = 'transparent'
    document.querySelector('#expenseSpan').style.backgroundColor = 'red'
  }
})
form.addEventListener("submit", addTransaction);

function updateTotal() {
  const incomeTotal = transactions
    .filter((trx) => trx.type === "income")
    .reduce((total, trx) => total + trx.amount, 0);

  console.log(incomeTotal)

  const expenseTotal = transactions
    .filter((trx) => trx.type === "expense")
    .reduce((total, trx) => total + trx.amount, 0);

  console.log(expenseTotal)

  const balanceTotal = incomeTotal - expenseTotal;

  console.log(balanceTotal)

  if (balanceTotal < 0) {
    balance.textContent = formatter.format(balanceTotal);
  }
  else {
    balance.textContent = formatter.format(balanceTotal).substring(1);
  }
  income.textContent = formatter.format(incomeTotal);
  expense.textContent = formatter.format(expenseTotal * -1);
}

function renderList() {
  list.innerHTML = "";

  Status.textContent = "";
  if (transactions.length === 0) {
    Status.textContent = "No transactions.";
    return;
  }

  transactions.forEach(({ id, name, amount, date, type }) => {
    if (type == 'expense') {
      color = 'red'
    }
    else {
      color = '#50C878'
    }
    const sign = "income" === type ? 1 : -1;
    const li = document.createElement("li");
    li.style.backgroundColor = color
    li.innerHTML = `
      <div class="name">
        <h4>${name}</h4>
        <p>${new Date(date).toLocaleDateString()}</p>
      </div>

      <div class="amount ${type}">
        <span>${formatter.format(amount * sign)}</span>
      </div>
    
      <div class="action">
      <button onclick="deleteTransaction(${id})">
          <img src="./delete-button.svg">
      </button>
    `;

    list.appendChild(li);
  });
}

renderList();
updateTotal();

function deleteTransaction(id) {
  const index = transactions.findIndex((trx) => trx.id === id);
  transactions.splice(index, 1);

  updateTotal();
  saveTransactions();
  renderList();
}

function addTransaction(e) {
  e.preventDefault();

  const formData = new FormData(this);

  transactions.push({
    id: transactions.length + 1,
    name: formData.get("name"),
    amount: parseFloat(formData.get("amount")),
    date: new Date(formData.get("date")),
    type: "on" === formData.get("type") ? "income" : "expense",
  });

  this.reset();

  updateTotal();
  saveTransactions();
  renderList();
}

function saveTransactions() {
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  localStorage.setItem("subham-expense-tracker", JSON.stringify(transactions));
}
