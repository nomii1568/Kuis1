let currentUser = null;
let purchaseHistory = [];
let currentPurchase = {};
let registeredUsers = [];

function showpage(pageID)
{
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageID).classList.add('active');
}

function showProductDetail(type)
{
    let pageID;
    switch(type)
    {
        case 'health' :
            pageID = 'kesehatan';
            break;
        case 'car' :
            pageID = 'mbim';
            break;
        case 'life' :
            pageID = 'jiwa';
            break;
    }
    showpage(pageID);
}

function showPurchasePage(type)
{
    if (!isSignedIn())
    {
        alert('Silahkan Sign In terlebih dahulu untuk melanjutkan aksi');
        showpage('signin');
        return;
    }

    let pageID;
    switch(type)
    {
        case 'health' :
            pageID = 'purchase-kes';
            break;
        case 'car' :
            pageID = 'purchase-mbim';
            break;
        case 'life' :
            pageID = 'purchase-jiwa';
            break;
    }
    showpage(pageID);
}

function isSignedIn()
{
    return currentUser !== null;
}

function updateNavi()
{
    const signinLink = document.getElementById('signinLink');
    const signupLink = document.getElementById('signupLink');
    const historyLink = document.getElementById('historyLink');
    const logoutLink = document.getElementById('logoutLink');

    if (isSignedIn())
    {
        signinLink.style.display = 'none';
        signupLink.style.display = 'none';
        historyLink.style.display = 'inline';
        logoutLink.style.display = 'inline';
    }
    else
    {
        signinLink.style.display = 'inline';
        signupLink.style.display = 'inline';
        historyLink.style.display = 'none';
        logoutLink.style.display = 'none';
    }
}

function logout()
{
    currentUser = null;
    updateNavi();
    showpage('home');
    alert('Anda berhasil logout');
}

function validateEmail(email)
{
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhoneNumber(num)
{
    const re = /^08[0-9]{8,14}$/;
    return re.test(num);
}

function validateName(name)
{
    const re = /^[a-zA-Z\s]{3,32}$/;
    return re.test(name);
}

function findUserByEmail(email)
{
    return registeredUsers.find(user => user.email === email);
}

function clearError()
{
    const errorElements = document.querySelectorAll('.error');
    const successElements = document.querySelectorAll('.success');
    errorElements.forEach(element => element.textContent = '');
    successElements.forEach(element => element.textContent = '');
}

document.getElementById('signinForm').addEventListener('submit', function(e)
{
    e.preventDefault();
    clearError();

    const email = document.getElementById('signinEmail').value;
    const pass = document.getElementById('signinPass').value;

    let isValid = true;

    if (!email)
    {
        document.getElementById('signinEmailError').textContent = 'Email harus diisi!';
        isValid = false;
    }
    else if (!validateEmail(email))
    {
        document.getElementById('signinEmailError').textContent = 'Format email Anda tidak valid!';
        isValid = false;
    }

    if (!pass)
    {
        document.getElementById('signinPassError').textContent = 'Password harus diisi!';
        isValid = false;
    }

    if (isValid)
    {
        if (email == 'test@gmail.com' && pass == '12345678')
        {
            currentUser = {email: email, name: 'Tester'};
            document.getElementById('signinSuccess');
            alert('Sign In berhasil!')
            updateNavi();
            setTimeout(() => {showpage('home');}, 500);
        }
        else
        {
            const user = findUserByEmail(email);
            if (user && user.password === pass)
            {
                currentUser = {email: user.email, name: user.name};
                document.getElementById('signinSuccess');
                alert('Sign In berhasil!')
                updateNavi();
                setTimeout(() => {showpage('home');}, 500);
            }
            else
            {
                document.getElementById('signinError').textContent = 'Email atau Password Anda salah!';
            }
        }
    }
});

document.getElementById('signupForm').addEventListener('submit', function(e)
{
    e.preventDefault();
    clearError();

    const email = document.getElementById('signupEmail').value;
    const pass = document.getElementById('signupPass').value;
    const confpass = document.getElementById('confirmPass').value;
    const name = document.getElementById('fullName').value;
    const num = document.getElementById('phoneNum').value;

    let isValid = true;

    if (!email)
    {
        document.getElementById('signupEmailError').textContent = 'Email harus diisi!';
        isValid = false;
    }
    else if (!validateEmail(email))
    {
        document.getElementById('signupEmailError').textContent = 'Format email Anda tidak valid!';
        isValid = false;
    }

    if (!pass)
    {
        document.getElementById('signupPassError').textContent = 'Password harus diisi!';
        isValid = false;
    }
    else if (pass.length < 8)
    {
        document.getElementById('signupPassError').textContent = 'Password minimal 8 karakter!';
        isValid = false;
    }

    if (pass !== confpass)
    {
        document.getElementById('confirmPassError').textContent = 'Konfirmasi Password tidak sesuai dengan Password!';
        isValid = false;
    }

    if (!name)
    {
        document.getElementById('fullNameError').textContent = 'Nama harus diisi!';
        isValid = false;
    }
    else if (!validateName(name))
    {
        document.getElementById('fullNameError').textContent = 'Format nama Anda salah! Nama terdiri atas 3-32 karakter tanpa angka';
        isValid = false;
    }

    if (!num)
    {
        document.getElementById('phoneNumError').textContent = 'Nomor HP harus diisi!';
        isValid = false;
    }
    else if (!validatePhoneNumber(num))
    {
        document.getElementById('phoneNumError').textContent = 'Format nomor HP Anda tidak valid! Nomor terdiri atas 10-16 digit dimulai dengan 08XX';
        isValid = false;
    }

    if (isValid)
    {
        const newUser = 
        {
            email: email,
            password: pass,
            name: name,
            phone: num,
            registrationDate: new Date().toLocaleDateString('id-ID')
        };
        
        registeredUsers.push(newUser);
        
        document.getElementById('signupSuccess');
        alert('Pendaftaran akun berhasil!');
        
        document.getElementById('signupForm').reset();
        
        setTimeout(() => {showpage('signin');}, 500);
    }
});

function calculateHealthPrem()
{
    const date = new Date(document.getElementById('kesBD').value);
    const rokok = parseInt(document.getElementById('rokok').value);
    const tensi = parseInt(document.getElementById('tensi').value);
    const diabet = parseInt(document.getElementById('diabet').value);

    if (!date || isNaN(rokok) || isNaN(tensi) || isNaN(diabet))
    {
        alert('Mohon lengkapi semua data!');
        return;
    }

    const age = new Date().getFullYear() - date.getFullYear();
    const basePrem = 2000000;

    let multiplierh = 0;
    if (age <= 20)
    {
        multiplierh = 0.1;
    }
    else if (age <= 35)
    {
        multiplierh = 0.2;
    }
    else if (age <= 50)
    {
        multiplierh = 0.25;
    }
    else
    {
        multiplierh = 0.4;
    }

    const premi = basePrem + (multiplierh * basePrem) + (rokok * 0.5 * basePrem) + (tensi * 0.4 * basePrem) + (diabet * 0.5 * basePrem);

    document.getElementById('healthPremResult').innerHTML =
    `<div class="prem-display">
        <div class="prem-amount">Rp. ${premi.toLocaleString('en-EN')}</div>
        <div>Premi per tahun</div>
        <button type="submit" class="btn btn-primary" onclick="showCO()" style="margin-top: 1rem;">
            <span style="font-size: 1rem;">🛒</span>
            Checkout
        </button>
    </div>`;

    currentPurchase =
    {
        type: 'health',
        productName: 'Asuransi Kesehatan Premium',
        premium: premi
    };
}

function calculateCarPrem()
{
    const bimPrice = parseInt(document.getElementById('bimPrice').value);
    const bimTahun = parseInt(document.getElementById('bimTahun').value);

    if (!bimPrice || !bimTahun)
    {
        alert('Mohon lengkapi semua data!');
        return;
    }

    const year = new Date().getFullYear();
    const bimyear = year - bimTahun;

    let multiplierc = 0;
    if (bimyear <= 3)
    {
        multiplierc = 0.025;
    }
    else if (bimyear <= 5)
    {
        if (bimPrice <200000000)
        {
            multiplierc = 0.04;
        }
        else
        {
            multiplierc = 0.03;
        } 
    }
    else
    {
        multiplierc = 0.05;
    }

    const premi = bimPrice * multiplierc;

    document.getElementById('carPremResult').innerHTML =
    `<div class="prem-display">
        <div class="prem-amount">Rp. ${premi.toLocaleString('en-EN')}</div>
        <div>Premi per tahun</div>
        <button type="submit" class="btn btn-primary" onclick="showCO()" style="margin-top: 1rem;">
            <span style="font-size: 1rem;">🛒</span>
            Checkout
        </button>
    </div>`;

    currentPurchase =
    {
        type: 'car',
        productName: 'Asuransi Mobil Premium',
        premium: premi
    };
}

function calculateLifePrem()
{
    const date = new Date(document.getElementById('lifeBD').value);
    const coverage = parseFloat(document.getElementById('coverage').value);

    if (!date || !coverage)
    {
        alert('Mohon lengkapi semua data!');
        return;
    }

    const age = new Date().getFullYear() - date.getFullYear();

    let multiplierl = 0;
    if (age <= 30)
    {
        multiplierl = 0.002;
    }
    else if (age <= 50)
    {
        multiplierl = 0.004;
    }
    else
    {
        multiplierl = 0.01;
    }

    const premi = coverage * multiplierl;

    document.getElementById('lifePremResult').innerHTML =
    `<div class="prem-display">
        <div class="prem-amount">Rp. ${premi.toLocaleString('en-EN')}</div>
        <div>Premi per tahun</div>
        <button type="submit" class="btn btn-primary" onclick="showCO()" style="margin-top: 1rem;">
            <span style="font-size: 1rem;">🛒</span>
            Checkout
        </button>
    </div>`;

    currentPurchase =
    {
        type: 'life',
        productName: 'Asuransi Jiwa Premium',
        premium: premi
    };
}

document.getElementById('healthForm').addEventListener('submit', function(e)
{
    e.preventDefault();
    if(currentPurchase.type == 'health')
    {
        showCO();
    }
    else
    {
        alert('Mohon hitung premi terlebih dahulu!');
    }
});

document.getElementById('carForm').addEventListener('submit', function(e)
{
    e.preventDefault();
    if(currentPurchase.type == 'car')
    {
        showCO();
    }
    else
    {
        alert('Mohon hitung premi terlebih dahulu!');
    }
});

document.getElementById('lifeForm').addEventListener('submit', function(e)
{
    e.preventDefault();
    if(currentPurchase.type == 'life')
    {
        showCO();
    }
    else
    {
        alert('Mohon hitung premi terlebih dahulu!');
    }
});

function showCO()
{
    document.getElementById('checkDetail').innerHTML = `
    <h3>Detail Pembelian</h3>
    <p><strong>Produk :</strong> ${currentPurchase.productName}</p>
    <p><strong>Premi :</strong> Rp. ${currentPurchase.premium.toLocaleString('id-ID')}</p>
    `;

    showpage('checkout');
}

function processPay()
{
    const payment = document.getElementById('payment').value;

    if (!payment)
    {
        alert('Mohon pilih metode pembayaran!');
        return;
    }

    const purchase =
    {
        id: Date.now(),
        productName: currentPurchase.productName,
        type: currentPurchase.type,
        date: new Date().toLocaleDateString('id-ID'),
        amount: currentPurchase.premium,
        status: 'Lunas'
    };

    purchaseHistory.push(purchase);

    alert('Pembayaran berhasil dilakukan! Terima Kasih.');
    showpage('history');
    updateHistoTable();
}

function updateHistoTable()
{
    const tbody = document.getElementById('history-body');
    tbody.innerHTML = '';

    if (purchaseHistory.length == 0)
    {
        tbody.innerHTML = 
        `<tr>
            <td colspan="5" style="text-align: center;">Belum ada riwayat pembelian</td>
        </tr>`;
        return;
    }

    purchaseHistory.forEach(purchase =>
    {
        const row = document.createElement('tr');
        const typeMap =
        {
            'car' : 'Mobil',
            'health' : 'Kesehatan',
            'life' : 'Jiwa'
        };

        row.innerHTML = `
        <td>${purchase.productName}</td>
        <td>${typeMap[purchase.type]}</td>
        <td>${purchase.date}</td>
        <td>${purchase.amount.toLocaleString('id-ID')}</td>
        <td><span class="status-paid">${purchase.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', function()
{
    updateNavi();
    updateHistoTable();
});