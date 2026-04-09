//===================================
//Usuários
//Cadastro
async function registerUser(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value; 
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value; 

    if(password !== confirm){
        alert('As senhas não conferem!');
        return;
    }

    const response = await fetch('/users', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name, username, password })
    });

    const data = await response.json();

    if(!response.ok){
        alert(data.message);
        return;
    }

    alert(data.message);
    window.location.href = 'index.html'
}

//Login
async function login(event) {
    event.preventDefault();

    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;

    const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })       
    });

    const data = await response.json();

    if(!response.ok){
        alert(data.message);
        return;
    }

    alert(data.message);
    window.location.href = 'produtos.html'
    
}

//Lista de usuários (Aba administrativa)
async function loadUsers(){
    const response = await fetch('/users');
    const users = await response.json();

    const list = document.getElementById('userList');
    list.innerHTML = '';

    users.forEach(u => {
        list.innerHTML += `<li>${u.name} (${u.username})</li>`
    });
}

//===================================
//===================================
//Produtos
//Cadastro
async function registerProduct(event){
    event.preventDefault();

    const id = document.getElementById('pid').value;
    const name = document.getElementById('pname').value;
    const price = document.getElementById('pprice').value;
    const stock = document.getElementById('pstock').value;

    const response = await fetch('/products', {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({id, name, price, stock})
    });

    const data = await response.json();

    if(!response.ok){
        alert(data.message);
        return;
    }

    alert(data.message);
    loadProducts();

}

//Listar produtos
async function loadProducts(){
    const response = await fetch('/products');
    const products = await response.json();

    const container = document.getElementById('products');
    container.innerHTML = '';

    products.forEach(p => {
        container.innerHTML += `
            <div class="card" id="list">
                <h3>Nome: ${p.name}</h3>
                <p>ID: ${p.id}</p>
                <p>Preço R$:${p.price}</p>
                <p>QTD. Estoque: ${p.stock}</p>
            </div>
        `
    });
};

//Deletar Produto
async function deleteProduct(event) {
    event.preventDefault();

    const input = document.getElementById('deleteId');

    const response = await fetch(`/products/${input.value}`, {
        method: "DELETE"
    });

    const data = await response.json();

    if (!response.ok) {
        alert(data.message);
        return;
    }

    alert(data.message);

    loadProducts();

    input.value = "";
}


window.onload = loadProducts;
//===================================
