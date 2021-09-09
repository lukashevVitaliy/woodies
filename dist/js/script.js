'use strict';

window.addEventListener('DOMContentLoaded', () => {

	// hamburger

	const hamburger = document.querySelector('.hamburger'),
		menu = document.querySelector('.menu'),
		menuClose = document.querySelector('.menu__close'),
		overlay = document.querySelector('.menu__overlay');

	const openMenu = () => {
		menu.classList.add('active');
		document.body.style.overflow = 'hidden';
	};

	hamburger.addEventListener('click', openMenu);

	const closeMenu = () => {
		menu.classList.remove('active');
		document.body.style.overflow = '';
	};

	menuClose.addEventListener('click', closeMenu);

	menu.addEventListener('click', (e) => {
		if (e.target === overlay) {
			closeMenu();
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.code === 'Escape' && menu.classList.contains('active')) {
			closeMenu();
		}
	});

	// slider

	let slider = tns({
		container: '.testimony-slider',
		items: 1,
		slideBy: 'page',
		gutter: 30,
		controls: false,
		nav: true,
		navPosition: 'bottom',
		fixedWidth: 352,
		speed: 1200,
		autoplay: true,
		autoplayButtonOutput: false,
	});

	document.querySelector('.prev').addEventListener('click', function () {
		slider.goTo('prev');
	});
	document.querySelector('.next').addEventListener('click', function () {
		slider.goTo('next');
	});

	// modal window

	const modalTrigger = document.querySelector('[data-modal]'),
		modal = document.querySelector('.modal'),
		modalCloseBtn = document.querySelector('[data-close]');

	const openModal = () => {
		modal.classList.add('show', 'fade');
		modal.classList.remove('hide');
		document.body.style.overflow = 'hidden'
	}
	const closeModal = () => {
		modal.classList.add('hide');
		modal.classList.remove('show');
		document.body.style.overflow = ''
	}

	modalTrigger.addEventListener('click', openModal);
	modalCloseBtn.addEventListener('click', closeModal);

	modal.addEventListener('click', (e) => {
		if (e.target === modal) {
			closeModal();
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.code === 'Escape' && modal.classList.contains('show')) {
			closeModal();
		}
	})

	// validation for
	function valideForms(form) {
		$(form).validate({
			rules: {
				name: {
					required: true,
					minlength: 2,
					maxlength: 25
				},
				email: {
					required: true,
					email: true
				},
				userpass1: {
					required: true,
					minlength: 8,
					maxlength: 20
				},
				userpass2: {
					required: true,
					minlength: 8,
					maxlength: 20
				}
			},
			messages: {
				name: {
					required: "Enter data",
					minlength: jQuery.validator.format("Please enter at least 2 characters !"),
					maxlength: jQuery.validator.format("Please enter no more than 25 characters !")
				},
				email: {
					required: "Enter data",
					email: "Invalid email address !"
				},
				userpass1: {
					required: "Enter data",
					minlength: jQuery.validator.format("Please enter at least {0} characters !"),
					maxlength: jQuery.validator.format("Please enter no more than {0} characters !")
				},
				userpass2: {
					required: "Enter data",
					minlength: jQuery.validator.format("Please enter at least {0} characters !"),
					maxlength: jQuery.validator.format("Please enter no more than {0} characters !")
				}
			}
		});
	}

	valideForms('#registration');
	valideForms('#subscribe');

	// scroll
	$(window).scroll(function () {
		if ($(this).scrollTop() > 700) {
			$('.pageup').fadeIn();
		} else {
			$('.pageup').fadeOut();
		}
	});

	$("a[href^='#up']").click(function () {
		const _href = $(this).attr("href");
		$("html, body").animate({ scrollTop: $(_href).offset().top + "px" });
		return false;
	});





	//* делаем доп.модальное окно

	function showThanksModal(message) {
		const prevModalDialog = document.querySelector('.modal__dialog');
		// скрываем предыдущий контент
		prevModalDialog.classList.add('hide');
		openModal();
		// создаем блок
		const thaksModal = document.createElement('div');
		thaksModal.classList.add('modal__dialog');
		thaksModal.innerHTML = `
		<div class="modal__content">
			<div data-close class="modal__close">&times;</div>
			<div class="modal__title">${message}</div>
		</div>
		`;
		document.querySelector('.modal').append(thaksModal);
		// повторное использование формы
		setTimeout(() => {
			thaksModal.remove();
			// показываем контент
			prevModalDialog.classList.add('show');
			prevModalDialog.classList.remove('hide');
			closeModal();
		}, 4000);
	}

	// Fetch JSON-server 
	const	forms = document.querySelectorAll('#registration');

	const message = {
		loading: 'icons/form/spinner.svg',
		success: 'Спасибо! Скоро мы с вами свяжемся.',
		failure: 'Что-то пошло не так...'
	};

	forms.forEach(item => {
		bindPostData(item);
	});

	const postData = async (url, data) => {
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: data
		});
		return await res.json();
	}

	function bindPostData(registration) {
		registration.addEventListener('submit', (e) => {
			e.preventDefault();

			const statusMessage = document.createElement('img');
			statusMessage.src = message.loading;
			statusMessage.style.cssText = `
													display: block;
													margin: 0 auto;
													`;
			registration.insertAdjacentElement('afterend', statusMessage);


			const formData = new FormData(registration);
			const json = JSON.stringify(Object.fromEntries(formData.entries()));

			postData('http://localhost:3000/request', json)
				.then(data => {
					console.log(data);
					showThanksModal(message.success);
					statusMessage.remove();
				})
				.catch(() => {
					showThanksModal(message.failure);
				})
				.finally(() => {
					registration.reset();
				})
		})
	}

});