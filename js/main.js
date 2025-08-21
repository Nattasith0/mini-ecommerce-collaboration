document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const loader = document.getElementById('loader');
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');

    let allProducts = [];
    let viewProducts = [];

    loader.style.display = 'block';

    const dataURL = new URL('./js/products.json', window.location.href).toString();

    (async () => {
        try {
            const res = await fetch(dataURL, { cache: 'no-store' });
            if (!res.ok) {
                throw new Error(`โหลดข้อมูลไม่สำเร็จ (HTTP ${res.status})`);
            }

            const data = await res.json();
            if (!Array.isArray(data)) {
                throw new Error('รูปแบบ JSON ไม่ใช่ Array');
            }

            allProducts = data.map(p => ({ ...p, _name: (p.name || '').toLowerCase() }));
            viewProducts = allProducts;
            displayProducts(viewProducts);
        } catch (err) {
            console.error('โหลด products.json ล้มเหลว:', err);

            productList.innerHTML = `<p style="text-align:center;color:#ef4444">
        เกิดข้อผิดพลาดในการโหลดสินค้า: ${err.message}<br>
        ตรวจสอบว่าไฟล์ <code>js/products.json</code> มีจริงและพาธตรงกับโครงโปรเจกต์
      </p>`;

            const fallback = [
                { "id": 1, "name": "Air Jordan 1 Retro High OG GS “UNC”", "price": 7700, "image": "https://cdn.lesitedelasneaker.com/wp-content/images/2015/04/air-jordan-1-retro-high-og-unc-2.jpg" },
                { "id": 2, "name": "Air Jordan 1 High OG “Spider-Verse”", "price": 11500, "image": "https://tse2.mm.bing.net/th/id/OIP.GBpslafzO_0CFPDflx_AJAHaJG?r=0&w=768&h=943&rs=1&pid=ImgDetMain&o=7&rm=3" },
                { "id": 3, "name": "Air Jordan 1 “Chicago Reimagined”", "price": 12000, "image": "https://sneakernews.com/wp-content/uploads/2015/05/air-jordan-1-chicago-release-info-1.jpg" },
                { "id": 4, "name": "Travis Scott x Air Jordan 1 Low OG WMNS “Olive”", "price": 24500, "image": "https://dropinblog.net/34240971/files/featured/Travis-Scott-Air-Jordan-1-Low-Olive-DZ4137-106-Release-Date-On-Feet.jpeg" },
                { "id": 5, "name": "Union LA x Air Jordan 1 ‘Chicago Shadow’", "price": 10500, "image": "https://down-th.img.susercontent.com/file/cn-11134207-7ras8-m4k2lxy5awivc7" },
                { "id": 6, "name": "ช้างดาว", "price": 199, "image": "https://cf.shopee.co.th/file/6bf580790a590ceb8ad595523f5b4569" }
            ];
            allProducts = fallback.map(p => ({ ...p, _name: (p.name || '').toLowerCase() }));
            viewProducts = allProducts;
            displayProducts(viewProducts);
        } finally {
            loader.style.display = 'none';
        }
    })();

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
        </div>`;
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
        viewProducts = q ? allProducts.filter(p => p._name.includes(q)) : allProducts;
        displayProducts(viewProducts);
    }, 250);

    searchInput.addEventListener('input', doSearch);
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        displayProducts(allProducts);
        searchInput.focus();
    });
});
