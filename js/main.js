document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const loader = document.getElementById('loader');
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');

    let allProducts = [];
    let viewProducts = [];

    loader.style.display = 'block';

    fetch('js/products.json')
        .then(res => {
            if (!res.ok) throw new Error('โหลดข้อมูลไม่สำเร็จ');
            return res.json();
        })
        .then(data => {
            allProducts = data.map(p => ({ ...p, _name: (p.name || '').toLowerCase() }));
            viewProducts = allProducts;
            displayProducts(viewProducts);
        })
        .catch(() => {
            productList.innerHTML = `<p style="text-align:center;color:#ef4444">เกิดข้อผิดพลาดในการโหลดสินค้า</p>`;
        })
        .finally(() => loader.style.display = 'none');

    function displayProducts(products) {
        productList.innerHTML = '';
        if (!products.length) {
            productList.innerHTML = `<p class="meta" style="text-align:center;width:100%">ไม่พบสินค้าที่ค้นหา</p>`;
            return;
        }

        products.forEach(product => {
            const card = document.createElement('article');
            card.className = 'product-card';

            card.innerHTML = `
        <img class="thumb" src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="content">
          <h3>${product.name}</h3>
          <div class="meta">ราคา</div>
          <div class="price">฿${Number(product.price).toLocaleString()}</div>
          <button class="btn" type="button" aria-label="หยิบ ${product.name} ใส่ตะกร้า">หยิบใส่ตะกร้า</button>
        </div>
      `;
            productList.appendChild(card);
        });
    }

    function debounce(fn, delay = 200) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    const doSearch = debounce(() => {
        const q = searchInput.value.trim().toLowerCase();
        viewProducts = q
            ? allProducts.filter(p => p._name.includes(q))
            : allProducts;
        displayProducts(viewProducts);
    }, 250);

    searchInput.addEventListener('input', doSearch);

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        displayProducts(allProducts);
        searchInput.focus();
    });
});
