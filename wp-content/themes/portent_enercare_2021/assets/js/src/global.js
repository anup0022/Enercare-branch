jQuery(function ($) {
	// Mobile Menu
	$(".menu-toggle").click(function () {
		// $('.search-toggle, .header-search').removeClass('active');
		// $('.menu-toggle, .nav-menu').toggleClass('active');
	});
	$(".menu-item-has-children > .submenu-expand").click(function (e) {
		$(this).toggleClass("expanded");
		e.preventDefault();
	});

	// Search toggle
	$(".search-toggle").click(function () {
		$(".menu-toggle, .nav-menu").removeClass("active");
		$(".search-toggle, .header-search").toggleClass("active");
		$(".site-header .search-field").focus();
	});

	// AddSearch JS client with an example index. Get your own SITEKEY by signing up at www.addsearch.com
	var client = new AddSearchClient("3145819e621ccfb6dbf5116b2c92967b");
	var conf = {
		searchResultsPageUrl: "/",
		searchParameter: "addsearch",
		updateBrowserHistory: false,
	};

	// Search UI instance
	var searchui = new AddSearchUI(client, conf);
	// Add components
	searchui.searchField({
		autofocus: false,
		containerId: "searchfield",
		placeholder: "Search",
		icon: false,
	});

	// Mobile Search UI instance
	var mobileSearchui = new AddSearchUI(client, conf);
	// Add components
	mobileSearchui.searchField({
		autofocus: false,
		containerId: "mobile-searchfield",
		placeholder: "Search",
		icon: false,
	});

	// var autocompleteClient = new AddSearchClient('3145819e621ccfb6dbf5116b2c92967b');
	// autocompleteClient.setPaging(1, 7, 'relevance', 'desc'); // Fetch 7 results by default
	//
	// var autocompleteTemplate = `
	//   <div class="addsearch-autocomplete" style="position: relative;">
	//     {{#gt searchResults.results.length 0}}
	//     <span class="addsearch-autocomplete__total-results">{{searchResults.results.length}} results</span>
	//       <ul>
	//         {{#each ../searchResults.results}}
	//           <li>
	//             <strong><a href="{{url}}">{{title}}</a></strong>
	//           </li>
	//         {{/each}}
	//       </ul>
	//     {{/gt}}
	//   </div>
	// `;
	//
	// searchui.autocomplete({
	//   containerId: 'autocomplete',
	//   template: autocompleteTemplate,
	//   infiniteScrollElement: document.querySelector('#scrollable'),
	//   sources: [
	//     {
	//       type: AddSearchUI.AUTOCOMPLETE_TYPE.SEARCH,
	//       client: autocompleteClient,
	//       jsonKey: 'results'
	//     }
	//   ]
	// });

	// All components added. Start
	searchui.start();
	mobileSearchui.start();

	//Enercare Specific function
	(function (window, document, undefined) {
		window.Enercare = {};

		/**
		 * Array of url parameters structured with the key
		 * as the key we will store/pull from sessionStorage
		 * and the value as a string of what url parameter we
		 * will need to pull the data from.
		 */
		window.Enercare.PPCparams = [
			{ utm_source: "utm_source" },
			{ utm_medium: "utm_medium" },
			{ utm_campaign: "utm_campaign" },
			{ gclid: "gclid" },
			/*
      { Keyword: 'keyword' },
      { Campaign: 'cid' },
      { AdGroup: 'aid' },
      { ReferralCode: 'refcode' },
      { DeviceType: '' }
      */
		];

		/**
		 * Cookie value grab for closed loop analytics in Google Tag Manager.
		 * Imlemented via portent.
		 * @param cname
		 * @returns {string}
		 */
		function getCookie(cname) {
			var name = cname + "=";
			var decodedCookie = decodeURIComponent(document.cookie);
			var ca = decodedCookie.split(";");
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == " ") {
					c = c.substring(1);
				}
				if (c.indexOf(name) == 0) {
					return c.substring(name.length, c.length);
				}
			}
			return "";
		}

		window.Enercare.getUrlParameter = function (name) {
			const n = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
			const regex = new RegExp(`[\\?&]${n}=([^&#]*)`);
			const results = regex.exec(location.search);
			return results === null
				? ""
				: decodeURIComponent(results[1].replace(/\+/g, " "));
		};

		window.Enercare.logPPCParamsToStorage = () => {
			window.Enercare.PPCparams.forEach((param) => {
				const key = Object.keys(param)[0];
				const urlParam = param[key];

				if (!sessionStorage[key]) {
					sessionStorage[key] = window.Enercare.getUrlParameter(urlParam);
				}
			});
		};

		window.Enercare.handleHiddenFormFields = function (form) {
			// handle the VendorCookieID/ruid
			if (form.ruid === undefined) {
				var input = document.createElement("input");
				input.setAttribute("type", "hidden");
				input.setAttribute("name", "ruid");
				input.setAttribute("value", getCookie("ruid"));
				form.appendChild(input);
			} else {
				form.ruid.setAttribute("value", getCookie("ruid"));
			}

			// loop through our PPC params
			window.Enercare.PPCparams.forEach((param) => {
				const key = Object.keys(param)[0];

				// if form element does not exist, create it and append to form
				if (form.key === undefined) {
					var input = document.createElement("input");
					input.setAttribute("type", "hidden");
					input.setAttribute("name", key);
					input.setAttribute("value", sessionStorage[key]);
					form.appendChild(input);
				} else {
					// otherwise, update the value of the hidden field
					form.key.setAttribute("value", sessionStorage[key]);
				}
			});
		};

		/**
		 * Set inputmode for certain input types
		 */
		let phoneFields, emailFields;
		phoneFields = document.querySelectorAll(".ginput_container_phone input");
		emailFields = document.querySelectorAll(".ginput_container_email input");

		try {
			emailFields.forEach(function (elem) {
				elem.setAttribute("inputmode", "email");
			});

			phoneFields.forEach(function (elem) {
				elem.setAttribute("inputmode", "tel");
			});
		} catch (err) {
			console.warn("No fields");
		}

		/**
		 * Loop through PPCparams
		 * check to see if sessionStorage item exists for that key
		 * make sure theres no value, then push the value from the
		 * url parameter provided
		 */
		window.Enercare.logPPCParamsToStorage();

		/** Get the gravity form and handle hidden form field inputs */
		/*var gravityForm = $('.gform_wrapper form');
    if (gravityForm.length) {
      window.Enercare.handleHiddenFormFields(gravityForm[0]);
    }*/
	})(window, document);
});

function insertAfter(newNode, existingNode) {
	existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

/**
Back to top button
 */
function bttLoad(event) {
	let pageHeader = document.querySelector('header.site-header');
	let bttButtonElement = document.getElementById('enercare-btt-button');

	let bttObserverOptions = {
		rootMargin: `${pageHeader.clientHeight * 2}px`,
		threshold: 1.0,
	};

	let bttObserverCallback = (entries, observer) => {
		entries.forEach((entry) => {
			if(entry.isIntersecting) {
				bttButtonElement.classList.add('hidden');
			} else {
				bttButtonElement.classList.remove('hidden');
			}
		});
	}

	let bttObserver = new IntersectionObserver(bttObserverCallback, bttObserverOptions);

	let handle_btt_button = (event) => {
		
		let siteLogo = document.querySelector('.title-area a');

		window.scrollTo({
			top: pageHeader.scrollTop,
			left: 0,
			behavior: "smooth",
		});

		siteLogo.focus({ preventScroll: true});
	}

	bttButtonElement.addEventListener("click", handle_btt_button);

	bttObserver.observe(pageHeader);
}

window.addEventListener("load", bttLoad);
/**
 * Toggle Navigation Script
 */
let PortentToggleNav = function () {};
PortentToggleNav.prototype.menu = "";
PortentToggleNav.prototype.logo = null;
PortentToggleNav.prototype.cta = null;
//@todo let this get set externally.
PortentToggleNav.prototype.mobileWidth = 1023;
PortentToggleNav.prototype.keyModifierDown = false;
PortentToggleNav.prototype.closeButton = "";
PortentToggleNav.prototype.touchStartX = 0;
PortentToggleNav.prototype.touchEndX = 0;
PortentToggleNav.prototype.init = function () {
	performance.mark("toggle-menu-init-start");
	if (this.menu !== "") {
		/*
		Add a class for style tracking
		 */
		this.menu.classList.add("portent-toggle-nav");
		this.setupMobileToggle();
		this.setupStatusArea();
		this.setupBrandArea();
		this.navigationMenuToggle(this.menu);
		this.setupClickOutside();
	} else {
		console.log("Please set a menu property");
	}

	/**
	 * Global listener for the shift key as a modifier
	 */
	this.menu.addEventListener("keydown", function (event) {
		if (event.keyCode === 16) {
			this.keyModifierDown = true;
		}
	});

	this.menu.addEventListener("keyup", function (event) {
		if (event.keyCode === 16) {
			this.keyModifierDown = false;
		}
	});

	document.addEventListener("touchstart", (e) => {
		this.touchstartX = e.changedTouches[0].screenX;
	});

	document.addEventListener("touchend", (e) => {
		this.touchendX = e.changedTouches[0].screenX;
		this.checkDirection(e);
	});

	performance.mark("toggle-menu-init-end");
	performance.measure(
		"toggle-menu-init",
		"toggle-menu-init-start",
		"toggle-menu-init-end"
	);
};
PortentToggleNav.prototype.setupClickOutside = function () {
	/**
	 * Handle Closing the menu when a user clicks outside of the frame
	 */

	//THIS gets weird once we start to dive down into functions. To make sure we are calling the top level prototype when we ask for properties and functions we need to save top level this into a new variable.
	let _this = this;
	let navigationMenu = this.menu;
	document.addEventListener("click", function (event) {
		let isNavigationInClick = navigationMenu.contains(event.target);
		if (!isNavigationInClick) {
			_this.closeAllMenus(navigationMenu);
		}
	});
};

PortentToggleNav.prototype.setupBrandArea = function () {
	const _this = this;
	const brandAreaContainer = document.createElement("div");
	brandAreaContainer.classList.add("brand-area");

	if (this.logo) {
		const brandLogoElement = document.createElement("img");
		brandLogoElement.classList.add("brand-area__logo");
		brandLogoElement.src = this.logo;
		brandAreaContainer.appendChild(brandLogoElement);
	}

	if (this.cta) {
		const brandCTAElement = document.createElement("div");
		brandCTAElement.classList.add("brand-area__cta");
		brandCTAElement.innerHTML = this.cta;
		brandAreaContainer.appendChild(brandCTAElement);
	}

	this.menu.insertBefore(brandAreaContainer, this.menu.children[0]);
};

PortentToggleNav.prototype.statusButtonKeys = function (event) {
	let el = this.menu.querySelector("[data-open=true]"),
		level = false;

	/**
	 * Check el if it is null then a sub menu is not open and we need to retarget the main menu body
	 */
	if (el === null) {
		el = this.menu.querySelector("ul");
		level = true;
	}

	if (event.keyCode === 38 || (event.keyCode === 9 && this.keyModifierDown)) {
		console.log("Key up pressed on menu item");
		event.stopPropagation();
		event.preventDefault();
		this.findNextMenuLink(event, el, "up", level);
	}

	if (event.keyCode === 40 || (event.keyCode === 9 && !this.keyModifierDown)) {
		console.log("Key down pressed on menu item");
		event.stopPropagation();
		event.preventDefault();

		this.findNextMenuLink(event, el, "down", level);
	}
};

PortentToggleNav.prototype.setupStatusArea = function () {
	performance.mark("toggle-menu-status-area-start");
	const _this = this;
	const menuElement = this.menu;
	const statusAreaContainer = document.createElement("div");
	const statusAreaBackButton = document.createElement("button");
	const statusAreaCloseButton = document.createElement("button");
	performance.mark("toggle-menu-status-area-end");
	performance.measure(
		"toggle-nav-status-setup",
		"toggle-menu-status-area-start",
		"toggle-menu-status-area-end"
	);

	_this.closebutton = statusAreaCloseButton;

	//statusAreaContainer.setAttribute('aria-hidden', "true");
	statusAreaContainer.setAttribute("data-interface", "statusArea");

	statusAreaCloseButton.innerText = "Close";
	statusAreaCloseButton.classList.add("mobile-close-btn");
	statusAreaBackButton.innerText = "Back to main menu";
	statusAreaBackButton.classList.add("mobile-back-btn");

	statusAreaContainer.appendChild(statusAreaBackButton);
	statusAreaContainer.appendChild(statusAreaCloseButton);
	menuElement.insertBefore(statusAreaContainer, menuElement.children[0]);

	statusAreaBackButton.addEventListener("click", function () {
		_this.closeAllMenus(menuElement);
	});
	statusAreaCloseButton.addEventListener("click", function () {
		_this.closeMobileMenu(menuElement);
	});

	statusAreaBackButton.addEventListener("keydown", function (event) {
		_this.statusButtonKeys(event);
	});
	statusAreaCloseButton.addEventListener("keydown", function (event) {
		_this.statusButtonKeys(event);
	});
	performance.mark("toggle-menu-status-area-end");
	performance.measure(
		"toggle-nav-status-setup",
		"toggle-menu-status-area-start",
		"toggle-menu-status-area-end"
	);
};

PortentToggleNav.prototype.setupMobileToggle = function () {
	const _this = this;
	const menuElement = this.menu;

	let mobileMenuToggle;
	if (this.toggleButton) {
		mobileMenuToggle = this.toggleButton;
	} else {
		mobileMenuToggle.innerText = "Menu";
		mobileMenuToggle = document.createElement("button");
		menuElement.parentElement.insertBefore(mobileMenuToggle, menuElement);
	}

	mobileMenuToggle.addEventListener("click", function () {
		_this.openMobileMenu(_this.menu);
	});
	mobileMenuToggle.setAttribute("aria-expanded", "false");
};

/**
 * This is likely better handled through a dispatched event listener
 * @param menuState
 */
PortentToggleNav.prototype.setSubMenuStatus = function (menuState = false) {
	if (menuState) {
		this.menu.setAttribute("data-menu", "open");
	} else {
		this.menu.removeAttribute("data-menu");
	}
};

PortentToggleNav.prototype.expandTopLevelItem = function (event) {
	event.preventDefault();

	/**
	 * @todo This is a duplication of the opening menu logic. Condense this.
	 */
	if (event.target.parentNode.dataset.open === "true") {
		/**
		 * If the same menu button we are clicking on is already visible then toggle it closed
		 * @type {string}
		 */
		event.target.dataset.open = "false";
		event.target.setAttribute("aria-expanded", "false");
		this.setSubMenuStatus(false);
	} else {
		/**
		 * If the button we are clicking on is not open, reset all open menus before displaying the current option
		 */
		this.closeAllMenus(this.menu);
		event.target.parentNode.dataset.open = "true";
		event.target.setAttribute("aria-expanded", "true");
		this.setSubMenuStatus(true);

		/**
		 * Focus The First Item
		 */
		this.focusFirstOption(event.target.parentNode);
	}
};

PortentToggleNav.prototype.navigationMenuToggle = function (
	navigationContainer
) {
	let menuItems = navigationContainer.querySelectorAll("[data-children=true]");

	//THIS gets weird once we start to dive down into functions. To make sure we are calling the top level prototype when we ask for properties and functions we need to save top level this into a new variable.
	let _this = this;
	menuItems.forEach.call(menuItems, function (el, i) {
		el.querySelector("button").addEventListener("click", function (event) {
			if (this.parentNode.dataset.open === "true") {
				/**
				 * If the same menu button we are clicking on is already visible then toggle it closed
				 * @type {string}
				 */
				this.parentNode.dataset.open = "false";
				this.setAttribute("aria-expanded", "false");
				_this.setSubMenuStatus();
			} else {
				/**
				 * If the button we are clicking on is not open, reset all open menus before displaying the current option
				 */
				_this.closeAllMenus(navigationContainer);
				this.parentNode.dataset.open = "true";
				this.setAttribute("aria-expanded", "true");
				_this.setSubMenuStatus(true);
			}

			/**
			 * Focus The First Item
			 */
			_this.focusFirstOption(this.parentNode);

			return false;
		});

		el.querySelector("button").addEventListener("keydown", function (event) {
			if (window.outerWidth <= _this.mobileWidth) {
				if (
					event.keyCode === 38 ||
					(event.keyCode === 9 && this.keyModifierDown)
				) {
					event.preventDefault();
					_this.findNextMenuLink(event, this.parentNode.parentNode, "up", true);
				}

				if (
					event.keyCode === 40 ||
					(event.keyCode === 9 && !this.keyModifierDown)
				) {
					event.preventDefault();
					_this.findNextMenuLink(
						event,
						this.parentNode.parentNode,
						"down",
						true
					);
				}

				if (event.keyCode === 39) {
					_this.expandTopLevelItem(event);
				}
			} else {
				if ([40, 39].includes(event.keyCode)) {
					_this.expandTopLevelItem(event);
				}

				if ([38].includes(event.keyCode)) {
					_this.closeAllMenus(navigationContainer);
				}
			}

			return false;
		});

		/**
		 * Event Listeners for ALL link elements within the current top level list item
		 * We are tracking all links within the top level container so that when links are buried in containers
		 * and out of sequence we can still locate the next logical link in the list.
		 */
		el.querySelectorAll("a").forEach(function (elem) {
			// elem.addEventListener('blur', function(){
			// 	console.log('link blurred');
			// });

			elem.addEventListener("keydown", function (event) {
				if (window.outerWidth <= _this.mobileWidth) {
					if (
						event.keyCode === 38 ||
						(event.keyCode === 9 && this.keyModifierDown)
					) {
						event.stopPropagation();
						event.preventDefault();
						_this.findNextMenuLink(event, el, "up");
					}

					if (
						event.keyCode === 40 ||
						(event.keyCode === 9 && !this.keyModifierDown)
					) {
						event.stopPropagation();
						event.preventDefault();
						_this.findNextMenuLink(event, el, "down");
					}
				} else {
					if (event.keyCode === 38) {
						event.stopPropagation();
						event.preventDefault();
						_this.findNextMenuLink(event, el, "up");
					}

					if (event.keyCode === 40) {
						event.stopPropagation();
						event.preventDefault();
						_this.findNextMenuLink(event, el, "down");
					}
				}
			});

			elem.addEventListener("keyup", function (event) {
				//Close menu and focus on closest button when Escape is pressed on a menu item
				if (event.keyCode === 27) {
					_this.closeAllMenus(navigationContainer);
					el.querySelector("button").focus();
				}
			});
		});
	});
};

PortentToggleNav.prototype.checkDirection = function (event) {
	if (this.touchendX < this.touchstartX) {
		//this.findNextMenuLink(event, this.getTopLevelParentFromFocus(), 'up')
	}
	if (this.touchendX > this.touchstartX) {
		//this.findNextMenuLink(event, this.getTopLevelParentFromFocus(), 'down')
	}
};

PortentToggleNav.prototype.getTopLevelParentFromFocus = function () {
	let currentItem = document.activeElement;
	return currentItem.parentElement;
};

/*
This function essentially serves as a keyboard trap for the current menu.
I don't love this at the moment. It feels like it is doing more work that it should
 */
PortentToggleNav.prototype.findNextMenuLink = function (
	event,
	topLevelParent,
	direction,
	topLevel
) {
	console.log(`topLevelParent`);
	console.log(topLevelParent);
	let allLinks;

	if (!direction || typeof direction == "undefined") {
		direction = "down";
	}

	/*
	don't love this part but we need to know if the menu is at its highest level or not
	 */
	if (!topLevel) {
		topLevel = false;
	}

	if (window.outerWidth <= this.mobileWidth) {
		let mobileElements;

		/**
		 * Available elements are different depending on the level
		 */
		if (topLevel) {
			console.log(`Pulling from top level`);
			mobileElements = Array.from(
				this.menu.querySelectorAll(".mobile-close-btn")
			);
			allLinks = Array.from(
				topLevelParent.querySelectorAll(":scope > li > button, :scope > li > a")
			);
		} else {
			mobileElements = Array.from(
				this.menu.querySelectorAll(".mobile-back-btn, .mobile-close-btn")
			);
			allLinks = Array.from(topLevelParent.querySelectorAll("a"));
		}
		allLinks = [...mobileElements, ...allLinks];
	} else {
		allLinks = Array.from(topLevelParent.querySelectorAll("a"));
	}

	console.log("Outputting All Links");
	console.log(allLinks);
	let firstFocusableLink = allLinks[0];
	let lastFocusableLink = allLinks[allLinks.length - 1];
	let currentElement = document.activeElement;

	/**
	 * If the user has pressed up on the final focusable in the set, shift focus to the last
	 * It is important that we return if this statement is true so that we do not duplicate the action.
	 */
	if (currentElement === firstFocusableLink && direction === "up") {
		lastFocusableLink.focus();
		return;
	}

	/**
	 * If the user has pressed down on the final focusable item in the list shift focus to the first item in the set
	 * It is important that we return if this statement is true so that we do not duplicate the action.
	 */
	if (currentElement === lastFocusableLink && direction === "down") {
		firstFocusableLink.focus();
		return;
	}

	/**
	 * If a user has pressed the up or down arrow while a menu item is focused and neither is the first or last element
	 * then loop through the list until
	 */
	allLinks.forEach(function (link, index) {
		if (currentElement === link) {
			if (direction === "down") {
				allLinks[index + 1].focus();
			} else if (direction === "up") {
				allLinks[index - 1].focus();
			}
		}
	});

	console.log(document.activeElement);
};

PortentToggleNav.prototype.closeAllMenus = function (navigationContainer) {
	let openMenus = navigationContainer.querySelectorAll(
		"button[aria-expanded=true]"
	);

	openMenus.forEach(function (elem) {
		elem.parentNode.dataset.open = "false";
		elem.setAttribute("aria-expanded", "false");
	});
	console.log(openMenus);
	if (openMenus.length > 0) {
		openMenus.item(0).focus();
	}
	this.setSubMenuStatus(false);
};

PortentToggleNav.prototype.setDocumentAttribute = function () {
	const bodyElement = document.querySelector("body");
	bodyElement.setAttribute("data-menu", "open");
};

PortentToggleNav.prototype.removeDocumentAttribute = function () {
	let bodyElement = document.querySelector("body");
	bodyElement.removeAttribute("data-menu");
};

PortentToggleNav.prototype.openMobileMenu = function (menuElement) {
	menuElement.setAttribute("data-mobile", "open");
	this.setDocumentAttribute();
	const firstMenuItem = this.menu.querySelector(".mobile-close-btn");
	firstMenuItem.focus();
};

PortentToggleNav.prototype.closeMobileMenu = function () {
	this.removeDocumentAttribute();
	this.closeAllMenus(this.menu);

	if (this.menu.getAttribute("data-mobile") === "open") {
		this.menu.removeAttribute("data-mobile");
	}

	this.toggleButton.focus();

	this.setSubMenuStatus(false);
};

PortentToggleNav.prototype.focusFirstOption = function (topLevelItem) {
	let firstLink = topLevelItem.querySelector(".sub-menu a");
	firstLink.focus({ preventScroll: true });
};

/**
 * Execute a function given a delay time
 *
 * @param {type} cb
 * @param {type} wait
 * @param {type} immediate
 * @returns {Function}
 */
PortentToggleNav.prototype.debouceKeys = function (cb, wait, immediate) {
	var timeout;
	return function () {
		var context = this,
			args = arguments;
		var later = function () {
			timeout = null;
			if (!immediate) cb.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) cb.apply(context, args);
	};
};

/**
 * Setup and init the toggle menu
 */
function setupToggleNav() {
	performance.mark("nav-build-start");
	const primaryNavigation = new PortentToggleNav();
	primaryNavigation.menu = document.getElementById("slider-menu");
	primaryNavigation.toggleButton =
		document.getElementById("slider-menu-toggle");
	primaryNavigation.logo =
		"https://www.enercare.ca/wp-content/uploads/2021/11/EC_LOGO_H_P_4C.svg";
	primaryNavigation.cta =
		'<div class="site-header__header-phone header-phone"><span class="header-phone__cta"><strong>Speak with an expert</strong></span><a class="header-phone__link cl-phone" href="tel:1-855-642-8607"><span class="screen-reader-text">Click to call Enercare1-855-642-8607</span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M19.23 15.26l-2.54-.29c-.61-.07-1.21.14-1.64.57l-1.84 1.84c-2.83-1.44-5.15-3.75-6.59-6.59l1.85-1.85c.43-.43.64-1.03.57-1.64l-.29-2.52c-.12-1.01-.97-1.77-1.99-1.77H5.03c-1.13 0-2.07.94-2 2.07.53 8.54 7.36 15.36 15.89 15.89 1.13.07 2.07-.87 2.07-2v-1.73c.01-1.01-.75-1.86-1.76-1.98z"></path></svg><strong class="header-phone__number">1-855-642-8607</strong></a></div>';
	primaryNavigation.extraMobileElements = [".addsearch-searchfield input"];
	primaryNavigation.init();
	performance.mark("nav-build-end");

	performance.measure("nav-build-total", "nav-build-start", "nav-build-end");

	console.log(loginMeasure.duration);
}
window.addEventListener("load", setupToggleNav);

/**
 * Create caption element from the figcaption if a table is present on page
 */

function createTableCaption() {
	let tableFigureBlocks = document.querySelectorAll(".wp-block-table");
	if (
		tableFigureBlocks.length > 0 &&
		typeof tableFigureBlocks !== "undefined"
	) {
		tableFigureBlocks.forEach(function (elem) {
			let innerTable = elem.querySelector(":scope > table");
			let tableFigCaption = elem.querySelector(":scope > figcaption");
			let caption = innerTable.createCaption();

			caption.textContent = tableFigCaption.innerHTML;
		});
	}
}

window.addEventListener("load", createTableCaption);

jQuery( function( $ ) {

	// Accessibility for search
	$( window ).on( 'load', function() {
		$( 'input#wp-block-search__input-1' ).attr( 'title', 'Keywords for a site-wide search' );
		$( 'input#wp-block-search__input-1' ).attr( 'aria-label', 'Keywords for a site-wide search' );
	});

});