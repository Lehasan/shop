'use strict'

import jsonData from "../json/data.json"
import { loadProducts } from "./products.js"

class Cart {
	productsStorage = JSON.parse(localStorage.getItem('cart'))
	inputCountStorage = localStorage.getItem('count')

	cartElement = document.getElementById('cart')
	cartNumber = document.getElementById('cart-number')

	productsListElement = document.querySelector('.products__list')
	popupElement = document.querySelector('.cart-popup')
	popupWrapperElement = document.querySelector('.cart-popup__wrapper')
	cartBuyElement = document.querySelector('.cart-popup__buy')
	cartTotalPriceElement = document.querySelector('.cart-popup__total-price span')
	cartProductsListElement = document.querySelector('.cart-products')

	products = this.productsStorage ? this.productsStorage : []

	constructor() {
		this.loadProductsToCart()
		this.setCartNumber()
		this.initHandlers()
	}

	setCartNumber = () => {
		const { length } = this.products

		this.cartBuyElement.parentElement.style.display = length ? 'block' : 'none'
		this.popupWrapperElement.dataset.message = length ? '' : 'Кошик порожній'

		return this.cartNumber.textContent = length > 9 ? '9+' : length
	}

	loadProductsToCart = () => {
		if (!this.products) return

		this.products.forEach(item => {
			let { id, image, name, price } = item
			this.createProductInCart(id, image, name, price)

			return this.updateProductStatus(id)
		})

		this.setInputCount()
		return this.updateTotalPrice()
	}

	updateTotalPrice = () => {
		if (!this.products.length) return this.cartTotalPriceElement.textContent = 0

		let totalPrice = 0
		this.products.forEach(item => {
			return this.cartTotalPriceElement.textContent = totalPrice += item.price
		})
	}

	createProductInCart = (id, image, name, price) => {
		const cartProductTemplate = `
		<li class="cart-products__item" id="${id}">
			<article class="cart-products__item-article">
				<a href="#" class="cart-products__image">
					<img src="${image}" alt="${name}">
				</a>
				<a href="#" title="${name}" class="cart-products__title">${name}</a>
				<input class="cart-products__number" type="number" min="1" value="1">
				<span class="cart-products__price"><span>${price}</span> ₴</span>
				<button type="button" class="cart-products__remove">
					<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
						<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
						<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
			 		</svg>
				</button>
			</article>
		</li>`

		return this.cartProductsListElement.insertAdjacentHTML('beforeend', cartProductTemplate)
	}

	popupToggle = () => {
		this.popupElement.classList.toggle('_hide')
		document.body.classList.toggle('_lock')

		return !this.popupElement.classList.contains('_hide')
			? document.addEventListener('keyup', this.popupToggleKeyup)
			: document.removeEventListener('keyup', this.popupToggleKeyup)
	}

	toggleBuyButtonStatus = element => {
		element.textContent = element.textContent === 'Купити' ? 'В кошику' : 'Купити'
		return element.classList.toggle('_added')
	}

	updateProductStatus = id => {
		const currentProduct = document.getElementById(id),
			productBuyButton = currentProduct.querySelector('.products__button')

		if (currentProduct && productBuyButton) return this.toggleBuyButtonStatus(productBuyButton)
	}

	addProductToCart = productId => {
		const findProduct = element => {
			if (productId !== element.id) return

			const { id, image, name, price } = element
			this.createProductInCart(id, image, name, price)
			this.products.push({ id, image, name, price })
			this.updateTotalPrice()

			localStorage.setItem('cart', JSON.stringify(this.products))
			return this.setCartNumber()
		}

		return jsonData.find(findProduct)
	}

	removeProductInCart = productId => {
		const findProduct = (element, index) => {
			if (productId !== element.id) return

			this.products.splice(index, 1)
			this.updateTotalPrice()

			localStorage.setItem('cart', JSON.stringify(this.products))
			return this.setCartNumber()
		}

		return this.products.find(findProduct)
	}

	updateProductPrice = (productId, count, currentProduct) => {
		const findProduct = (element, index) => {
			if (productId !== element.id) return

			const currentPriceElement = currentProduct.querySelector('.cart-products__price span')
			const originalPrice = jsonData[productId - 1].price

			this.products[index].price = currentPriceElement.textContent = originalPrice * count

			localStorage.setItem('cart', JSON.stringify(this.products))
			return this.updateTotalPrice()
		}

		return this.products.find(findProduct)
	}

	setInputCount = () => {
		if (!this.inputCountStorage) return
		const counterInputElements = document.querySelectorAll('.cart-products__number')

		this.inputCountStorage.split(',').forEach((item, index) => {
			return counterInputElements[index].value = item
		})
	}

	updateInputCount = () => {
		let inputCounts = []
		const counterInputElements = document.querySelectorAll('.cart-products__number')

		counterInputElements.forEach(item => inputCounts.push(item.value))
		return localStorage.setItem('count', inputCounts)
	}

	popupToggleKeyup = event => event.code === 'Escape' ? this.popupToggle() : null

	handleAddProductButtonClick = event => {
		const targetButton = event.target.closest('.products__button')

		if (!targetButton || targetButton.classList.contains('_added')) return

		const currentProduct = targetButton.closest('.products__item')
		setTimeout(() => this.toggleBuyButtonStatus(targetButton))

		return this.addProductToCart(+currentProduct.id)
	}

	handleRemoveProductButtonClick = event => {
		const targetButton = event.target.closest('.cart-products__remove')

		if (!targetButton) return

		const currentProduct = targetButton.closest('.cart-products__item')
		currentProduct.remove()

		this.updateInputCount()
		this.updateProductStatus(currentProduct.id)

		return this.removeProductInCart(+currentProduct.id)
	}

	handlePopupToggleButtonClick = event => {
		const target = event.target,
			targetButton = target.closest('#cart, #popup-close, ._added')

		if (targetButton || target.closest('.cart-popup') && !target.closest('.cart-popup__wrapper')) {
			this.popupToggle()
		}
	}

	handleCounterInput = event => {
		const targetInput = event.target.closest('.cart-products__number')

		if (!targetInput || targetInput.value <= 0) return

		targetInput.value = targetInput.value.replace(/[^\d]/g, '')

		const currentProduct = targetInput.closest('.cart-products__item')
		this.updateInputCount()

		return this.updateProductPrice(+currentProduct.id, targetInput.value, currentProduct)
	}

	initHandlers = () => {
		document.addEventListener('click', this.handlePopupToggleButtonClick)

		this.productsListElement.addEventListener('click', this.handleAddProductButtonClick)
		this.cartProductsListElement.addEventListener('click', this.handleRemoveProductButtonClick)
		this.cartProductsListElement.addEventListener('input', this.handleCounterInput)
	}
}

window.addEventListener('load', () => {
	loadProducts()
	return new Cart()
})