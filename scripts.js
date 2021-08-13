const Modal = {
    open() {
        document.querySelector('.modal-overlay').classList.add('active')
        document.querySelector('.modal').classList.add('modalAnimation')
    },
    close() {
        document.querySelector('.modal-overlay').classList.remove('active')
        document.querySelector('.modal').classList.remove('modalAnimation')
        Form.showError("&nbsp")
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),
    add(transaction) {
        Transaction.all.push(transaction)
        App.reload()
    },
    remove(index) {
        Transaction.all.splice(index, 1) //splice -> (índice do array, quantidade)

        App.reload()
    },
    incomes() {
        let income = 0

        Transaction.all.forEach(transaction => {
            if(transaction.amount > 0) {
                income += transaction.amount
            }
        })

        return income;

    },
    expenses() {
        let expense = 0;

        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0) {
                expense += transaction.amount
            }
        })

        return expense;

    },
    total() {
        return Transaction.incomes() + Transaction.expenses()

    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <tr>
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td><img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação"></td>
        </tr>
        `

        return html
    },

    updateBalance() {
        document
            .querySelector('#incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .querySelector('#expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .querySelector('#totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    //Formatar valor
    formatAmount(value) {
        value = Number(value) * 100
        
        return value
    },

    //Formatar data
    formatDate(date) {
        const splittedDate = date.split("-") //split -> separa a string por um separador

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    //Formatar moeda
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "") //Tudo que não for um número

        value = Number(value) / 100 //Truque para trabalhar com dinheiro: Deixar o valor multiplicado por 100 depois divide por 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    // Formatar dados
    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
        
    },
    showError(message) {
        document.querySelector(".message").innerHTML = `${message}`
        console.log(message)
    },
    // Validar campos
    validateField() {
        const { description, amount, date } = Form.getValues()

        if(description.trim() === "" || amount.trim() === "" || date.trim() === "") { //trim -> limpar os espaços vazios
            Form.showError("Por favor, preencha todos os campos!")
            throw new Error("Por favor, preencha todos os campos!")// Criar novo objeto de erro utilizando o construtor Error
        }

        console.log(description, amount, date)
    },

    // Limpar
    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault() //Tirar comportamento padrão do formulário(não mostrar informações na url no browser)
        
        try {
            //Verificar se os campos são válidos
            Form.validateField()
            //Pegar transação formatada
            const transaction = Form.formatValues()
            //Adicionar transação
            Transaction.add(transaction)
            //Limpar os campos
            Form.clearFields()
            //Fechar modal
            Modal.close()
        } catch (error) {
            console.log(error.message)
        }
    }
}

const App = {
    init() {
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })
        
        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    }
}

App.init()