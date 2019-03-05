import 'promise-polyfill/src/polyfill';
import {fetch as fetchPolyfill} from 'whatwg-fetch';

export default (function products() {
    const productsBlock = document.querySelector('.products__block'); // Блок, куда будут помещаться все продукт-карточки
    const productsAlert = document.querySelector('.products__alert'); 

    function createProducts(products) { // Функция для создания продукт-карт из данных, которые пришли в getProducts() из products-data.json
        products.map(function(product){
            let productCard = document.createElement('div');
            productCard.className = 'product-card';
            productsBlock.appendChild(productCard);

            let productContent = document.createElement('div');
            productContent.className = 'product product_default';

            function changeProductStatus() { // Функция для смены облика продукта, по нажатии на карточку или кнопку "купить".
                if(productContent.classList.contains('product_default')) {
                    productContent.classList.toggle('product_default');
                    productContent.classList.toggle('product_selected');
                    productContent.parentNode.querySelector('.product-slogan').classList.toggle('product-slogan_selected');
                    productContent.parentNode.querySelector('.product-slogan__text').innerText = product.slogan.selected.text;
                    productContent.parentNode.querySelector('.product__buy-link').style.display = "none";   
                    productContent.querySelector('.product__header-corner-border').classList.toggle('selected-border');
                    productContent.querySelector('.product__header-title').classList.toggle('selected-border');
                    productContent.querySelector('.product__image-block').classList.toggle('selected-border');
                    productContent.querySelector('.product__weight-circle').classList.toggle('selected-background'); 
                }
                else if(productContent.classList.contains('product_selected')) {
                    productContent.classList.toggle('product_selected');
                    productContent.classList.toggle('product_default');
                    productContent.querySelector('.product__manufacturer_selected-hover').style.display = "none";
                    productContent.querySelector('.product__manufacturer').style.display = "inline";
                    productContent.parentNode.querySelector('.product-slogan').classList.toggle('product-slogan_selected');
                    productContent.parentNode.querySelector('.product-slogan__text').innerText = `${product.slogan.default.text}`;
                    productContent.parentNode.querySelector('.product__buy-link').style.display = "inline";
                    productContent.querySelector('.product__header-corner-border').classList.toggle('selected-border');
                    productContent.querySelector('.product__header-title').classList.toggle('selected-border');
                    productContent.querySelector('.product__image-block').classList.toggle('selected-border');
                    productContent.querySelector('.product__weight-circle').classList.toggle('selected-background'); 
                }
            }
            productContent.addEventListener("mouseenter", function(){ // Если продукт уже выбран для покупки - показываем hover-слоган и скрываем слоган по-умолчанию;
                if(productContent.classList.contains('product_selected')) { 
                    productContent.querySelector('.product__manufacturer').style.display = "none";
                    productContent.querySelector('.product__manufacturer_selected-hover').style.display = "inline";
                }
            })
            productContent.addEventListener("mouseleave", function(){ // Если продукт уже выбран для покупки, скрываем hover-слоган и показываем слоган по-умолчанию;
                if(productContent.classList.contains('product_selected')) {
                    productContent.querySelector('.product__manufacturer_selected-hover').style.display = "none";
                    productContent.querySelector('.product__manufacturer').style.display = "inline";
                }
            })
            productContent.addEventListener("click", changeProductStatus);

            let productBorderStyleClass = "";
            let productBackgroundStyleClass = "";
            let productImageStyleClass = "";
            let productFontStyleClass = "";
            let productSloganFontStyleClass = "";
            let productSloganText = product.slogan.default.text;

            let sloganBlock = document.createElement('div');
            let sloganBuylink = document.createElement('a');
            sloganBuylink.className = "product__buy-link";
            sloganBuylink.href = "#";
            sloganBuylink.addEventListener("click", changeProductStatus);
            sloganBuylink.innerHTML = `${product.slogan.default.link}<span class="product__buy-link-point">.</span>`;

            if(product.selected) {
                productContent.className = 'product product_selected';
                productBorderStyleClass = "selected-border";
                productBackgroundStyleClass = "selected-background";
                productSloganFontStyleClass = "";
                productSloganText = product.slogan.selected.text;
                sloganBuylink.style.display = "none";
            }
            else if(product.selected === null) {    // null проставлен на disabled продуктах
                productContent.className = 'product product_disabled';
                productBorderStyleClass = "disabled-border";
                productBackgroundStyleClass = "disabled-background";
                productImageStyleClass = "disabled-image";
                productFontStyleClass = "disabled-color";
                productSloganFontStyleClass = "product-slogan_disabled";
                productSloganText = product.slogan.disabled.text;
                sloganBuylink.style.display = "none";
            }
            sloganBlock.className = `product-slogan ${productSloganFontStyleClass}`;
            sloganBlock.innerHTML = `<span class="product-slogan__text">${productSloganText}</span>`;

            productContent.innerHTML=`
                <div class="product__header">
                    <div class="product__header-corner">
                        <div class="product__header-corner-border ${productBorderStyleClass}"></div>
                    </div>
                    <div class="product__header-title ${productFontStyleClass} ${productBorderStyleClass}"> 
                        <span class="product__manufacturer">${product.manufacturer}</span>
                        <span class="product__manufacturer_selected-hover">${product.manufacturerSelectedHover}</span>
                    </div>
                </div>
                <div class="product__body">
                    <div class="product__description-block ${productFontStyleClass}">
                        <h2 class="product__name">${product.name}</h2>
                        <p class="product__name-desc">${product.nameDesc}</p>
                        <div class="product__desc ${productFontStyleClass}"> 
                            ${product.descText.map(element => {
                                return '<span class="product__desc-text">'+element+'</span>'
                            }).join('')}
                        </div>
                    </div>
                    <div class="product__image-block ${productBorderStyleClass}"><div class="product__image ${productImageStyleClass}"></div></div>
                    <div class="product__weight-circle ${productBackgroundStyleClass}">
                        <span class="product__weight-count">${product.weight.count}</span>
                        <span class="product__weight-measurement">${product.weight.measurement}</span>
                    </div>
                </div>
            `
            productCard.appendChild(productContent);
            productCard.appendChild(sloganBlock);
            sloganBlock.appendChild(sloganBuylink);
            
        });
    };
    function getProducts() { // Получаем список продуктов из products-data.json
        fetchPolyfill('products-data.json')
            .then(function(response) {
                if(response.status == 200) {
                    return response.json()
                }   
            })
            .then(function(products) {
                if(!products.length) {
                    productsAlert.style.animation = "none";
                    productsAlert.innerText = 'Продукты не найдены';
                } else {
                    productsAlert.style.display = "none";
                    createProducts(products) // Создаём продукт-карты на странице при успехе
                }
            })
            .catch(function(error){
                productsAlert.style.animation = "none";
                productsAlert.innerText = 'Ошибка загрузки';
                return error;
            })
    }
    getProducts()
})()