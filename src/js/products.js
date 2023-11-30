'use strict'

import jsonData from "../json/data.json"

export const loadProducts = () => {
	const productsListElement = document.querySelector('.products__list')

	if (!productsListElement) return

	jsonData.forEach(product => {
		const { id, image, name, price } = product

		const productTemplate = `
			<li class="products__item" id="${id}">
				<article class="products__item-article">
					<a href="#" class="products__image">
						<img src="${image}" alt="${name}" loading="lazy">
					</a>
					<div class="products__wrapper-title">
						<a href="#" title="${name}" class=" products__title">${name}</a>
					</div>
					<div class="products__buy">
						<button type="button" class="products__button">Купити</button>
						<span class="products__price">${price} ₴</span>
					</div>
				</article>
			</li>`

		productsListElement.insertAdjacentHTML('beforeend', productTemplate)
	})
}