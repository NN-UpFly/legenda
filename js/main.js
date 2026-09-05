$(function () {
  const $header = $(".header");
  const $menuBtn = $(".header__menu");
  const $mobileMenu = $(".mobile-menu");
  const $menuBackdrop = $(".mobile-menu__backdrop");
  const $evalModal = $("#eval-modal");
  const $cityModal = $("#city-modal");
  const $evalOpenTriggers = $("[data-eval-open]");
  const $cityOpenTriggers = $("[data-city-open]");

  let setEvalModalOpen = () => {};
  let setCityModalOpen = () => {};

  const updateModalScrollLock = () => {
    const anyOpen =
      $evalModal.hasClass("is-open") || $cityModal.hasClass("is-open");
    $("html, body").toggleClass("is-modal-open", anyOpen);
  };

  if ($evalModal.length && $evalOpenTriggers.length) {
    let lastEvalTrigger = null;
    const $evalCloseBtn = $evalModal.find(".eval-modal__close");

    setEvalModalOpen = (open, { restoreFocus = true } = {}) => {
      $evalModal.toggleClass("is-open", open);
      $evalModal.attr("aria-hidden", open ? "false" : "true");
      $evalModal.prop("inert", !open);

      if (open) {
        setCityModalOpen(false, { restoreFocus: false });
        $evalCloseBtn.trigger("focus");
      } else if (restoreFocus && lastEvalTrigger) {
        const menuIsClosed =
          $mobileMenu.length &&
          $.contains($mobileMenu[0], lastEvalTrigger) &&
          !$mobileMenu.hasClass("is-open");
        if (menuIsClosed && $menuBtn.length) {
          $menuBtn.trigger("focus");
        } else {
          $(lastEvalTrigger).trigger("focus");
        }
      }

      updateModalScrollLock();
    };

    $evalModal.prop("inert", true);

    $evalOpenTriggers.on("click", function (event) {
      event.preventDefault();
      lastEvalTrigger = this;
      setEvalModalOpen(true);
    });

    $evalModal
      .find("[data-eval-close]")
      .on("click", () => setEvalModalOpen(false));

    const $evalScroll = $evalModal.find(".eval-modal__scroll");
    if ($evalScroll.length) {
      $evalScroll.on("click", function (event) {
        if (event.target === this) {
          setEvalModalOpen(false);
        }
      });
    }

    $(document).on("keydown", (event) => {
      if (event.key === "Escape" && $evalModal.hasClass("is-open")) {
        setEvalModalOpen(false);
      }
    });

    const $evalForm = $evalModal.find(".eval-modal__form");
    const $evalPhotos = $evalModal.find("#eval-photos");
    const $evalUploadText = $evalModal.find(".eval-modal__upload-text");
    const evalUploadDefault =
      $evalUploadText.text().trim() || "Загрузите или перетащите фото";

    if ($evalPhotos.length && $evalUploadText.length) {
      $evalPhotos.on("change", function () {
        const input = this;
        const files = [...(input.files || [])].slice(0, 3);
        if (input.files && input.files.length > 3) {
          const dt = new DataTransfer();
          files.forEach((file) => dt.items.add(file));
          input.files = dt.files;
        }
        $evalUploadText.text(
          files.length
            ? files.map((file) => file.name).join(", ")
            : evalUploadDefault,
        );
      });
    }

    if ($evalForm.length) {
      $evalForm.on("submit", (event) => {
        event.preventDefault();
      });
    }
  }

  if ($cityModal.length && $cityOpenTriggers.length) {
    let lastCityTrigger = null;
    const $cityCloseBtn = $cityModal.find(".city-modal__close");

    setCityModalOpen = (open, { restoreFocus = true } = {}) => {
      $cityModal.toggleClass("is-open", open);
      $cityModal.attr("aria-hidden", open ? "false" : "true");
      $cityModal.prop("inert", !open);

      if (open) {
        setEvalModalOpen(false, { restoreFocus: false });
        $cityCloseBtn.trigger("focus");
      } else if (restoreFocus && lastCityTrigger) {
        const menuIsClosed =
          $mobileMenu.length &&
          $.contains($mobileMenu[0], lastCityTrigger) &&
          !$mobileMenu.hasClass("is-open");
        if (menuIsClosed && $menuBtn.length) {
          $menuBtn.trigger("focus");
        } else {
          $(lastCityTrigger).trigger("focus");
        }
      }

      updateModalScrollLock();
    };

    $cityModal.prop("inert", true);

    $cityOpenTriggers.on("click", function (event) {
      event.preventDefault();
      lastCityTrigger = this;
      setEvalModalOpen(false, { restoreFocus: false });
      if ($mobileMenu.hasClass("is-open") && $menuBtn.length) {
        $mobileMenu.removeClass("is-open");
        $mobileMenu.attr("aria-hidden", "true");
        $menuBtn.removeClass("is-open");
        $menuBtn.attr("aria-expanded", "false");
        $("html, body").removeClass("is-menu-open");
        $mobileMenu.prop("inert", true);
      }
      setCityModalOpen(true);
    });

    $cityModal
      .find("[data-city-close]")
      .on("click", () => setCityModalOpen(false));

    const $cityScroll = $cityModal.find(".city-modal__scroll");
    if ($cityScroll.length) {
      $cityScroll.on("click", function (event) {
        if (event.target === this) {
          setCityModalOpen(false);
        }
      });
    }

    $cityModal.find(".city-modal__option").on("click", (event) => {
      event.preventDefault();
      setCityModalOpen(false);
    });

    $(document).on("keydown", (event) => {
      if (event.key === "Escape" && $cityModal.hasClass("is-open")) {
        setCityModalOpen(false);
      }
    });
  }

  if ($menuBtn.length && $mobileMenu.length) {
    const $menuPanel = $mobileMenu.find(".mobile-menu__panel");
    const DESKTOP_MENU_MIN = 960;

    const positionDesktopMenu = () => {
      if (!$menuPanel.length || window.innerWidth < DESKTOP_MENU_MIN) {
        $menuPanel.css("left", "");
        return;
      }

      const { left } = $menuBtn[0].getBoundingClientRect();
      $menuPanel.css("left", `${left}px`);
    };

    const MENU_CLOSE_MS = 300;
    let menuCloseTimer = null;

    const setMenuOpen = (open, { restoreFocus = true } = {}) => {
      if (menuCloseTimer) {
        clearTimeout(menuCloseTimer);
        menuCloseTimer = null;
      }

      if (open) {
        setEvalModalOpen(false, { restoreFocus: false });
        setCityModalOpen(false, { restoreFocus: false });
        positionDesktopMenu();
        $mobileMenu.prop("inert", false);
        $("html, body").addClass("is-menu-open");
      }

      $mobileMenu.toggleClass("is-open", open);
      $mobileMenu.attr("aria-hidden", open ? "false" : "true");
      $menuBtn.toggleClass("is-open", open);
      $menuBtn.attr("aria-expanded", open ? "true" : "false");

      if (!open) {
        $mobileMenu.prop("inert", true);
        menuCloseTimer = setTimeout(() => {
          menuCloseTimer = null;
          $("html, body").removeClass("is-menu-open");
          if (restoreFocus) {
            $menuBtn.trigger("focus");
          }
        }, MENU_CLOSE_MS);
      }
    };

    const setActiveNavLink = () => {
      const page = window.location.pathname.split("/").pop() || "index.html";
      const hash = window.location.hash;

      $mobileMenu.find(".mobile-menu__nav a").each(function () {
        const href = $(this).attr("href") || "";
        let isActive = false;

        if (href.endsWith(".html")) {
          isActive = page === href;
        } else if (href.startsWith("#")) {
          isActive = (page === "index.html" || page === "") && hash === href;
        }

        $(this).toggleClass("is-active", isActive);
      });
    };

    $mobileMenu.prop("inert", true);
    setActiveNavLink();

    $menuBtn.on("click", () => {
      setMenuOpen(!$mobileMenu.hasClass("is-open"));
    });

    $menuBackdrop.on("click", () => setMenuOpen(false));

    $mobileMenu
      .find("a, [data-eval-open]")
      .on("click", () => setMenuOpen(false));

    $(document).on("keydown", (event) => {
      if (event.key === "Escape" && $mobileMenu.hasClass("is-open")) {
        setMenuOpen(false);
      }
    });

    $(window).on("resize", () => {
      if ($mobileMenu.hasClass("is-open")) {
        positionDesktopMenu();
      }
    });
  }

  if ($header.length) {
    const updateHeaderScroll = () => {
      $header.toggleClass("is-scrolled", window.scrollY > 0);
    };

    updateHeaderScroll();
    $(window).on("scroll", updateHeaderScroll);
  }

  $(".faq-item").on("toggle", function () {
    if (!this.open) return;
    $(".faq-item").not(this).prop("open", false);
  });

  const categoriesSwiper = new Swiper(".categories-swiper", {
    slidesPerView: 2,
    spaceBetween: 11,
    breakpoints: {
      640: {
        slidesPerView: "auto",
        spaceBetween: 22,
      },
      960: {
        enabled: false,
      },
    },
  });

  const approachSwiper = new Swiper(".approach-swiper", {
    slidesPerView: "auto",
    spaceBetween: 17,
    breakpoints: {
      640: {
        spaceBetween: 21,
      },
      960: {
        enabled: false,
      },
    },
  });

  const reviewsSwiper = new Swiper(".reviews-swiper", {
    slidesPerView: "auto",
    spaceBetween: 11,
    rewind: true,
    navigation: {
      nextEl: ".reviews__btn--next",
      prevEl: ".reviews__btn--prev",
    },
    breakpoints: {
      640: {
        spaceBetween: 22,
      },
      960: {
        spaceBetween: 16,
      },
      1200: {
        spaceBetween: 16,
      },
    },
  });

  const storesTabsSwiper = new Swiper(".stores-tabs-swiper", {
    slidesPerView: "auto",
    spaceBetween: 4,
    freeMode: true,
    breakpoints: {
      1440: {
        enabled: false,
      },
    },
  });

  const photoSwipers = [];
  $(".stores-photos-swiper").each(function () {
    const $gallery = $(this);
    const $container = $gallery.parent();

    photoSwipers.push(
      new Swiper(this, {
        slidesPerView: "auto",
        spaceBetween: 5,
        navigation: {
          prevEl: $container.find(".stores__btn--prev")[0] || null,
          nextEl: $container.find(".stores__btn--next")[0] || null,
        },
        breakpoints: {
          640: {
            spaceBetween: 22,
          },
          1200: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
        },
      }),
    );
  });

  const $storeTabs = $(".stores__tab");
  const $galleries = $(".stores-photos-swiper");

  const setActiveStore = (index) => {
    $storeTabs.each(function (i) {
      const active = i === index;
      $(this).toggleClass("is-active", active);
      $(this).attr("aria-selected", active ? "true" : "false");
    });

    $galleries.each(function (i) {
      const $gallery = $(this);
      if (i === index) {
        $gallery.css("display", "");
        $gallery.addClass("is-active");
        if (photoSwipers[i]) {
          photoSwipers[i].update();
        }
      } else {
        $gallery.css("display", "none");
        $gallery.removeClass("is-active");
      }
    });
  };

  $storeTabs.on("click", function () {
    const index = Number($(this).data("store"));
    setActiveStore(index);
    storesTabsSwiper.slideTo(index);
  });

  const initContactsMap = async () => {
    const container = $("#contacts-map")[0];
    if (!container || typeof ymaps3 === "undefined") return;

    try {
      await ymaps3.ready;

      ymaps3.import.registerCdn("https://cdn.jsdelivr.net/npm/{package}", [
        "@yandex/ymaps3-clusterer@0.0",
        "@yandex/ymaps3-default-ui-theme@latest",
      ]);

      const {
        YMap,
        YMapDefaultSchemeLayer,
        YMapDefaultFeaturesLayer,
        YMapMarker,
        YMapControls,
      } = ymaps3;
      const { YMapClusterer, clusterByGrid } = await ymaps3.import(
        "@yandex/ymaps3-clusterer",
      );
      const { YMapZoomControl } = await ymaps3.import(
        "@yandex/ymaps3-default-ui-theme",
      );

      const points = [
        [39.723, 43.599],
        [39.924, 43.437],
        [39.331, 43.909],
        [39.725, 43.585],
        [37.317, 44.895],
        [37.347, 44.898],
        [38.077, 44.562],
        [37.769, 44.724],
        [37.771, 44.726],
        [38.975, 45.036],
        [39.05, 44.15],
        [37.55, 45.02],
        [40.21, 44.42],
        [36.48, 45.03],
        [38.5, 44.1],
        [39.2, 44.8],
        [37.9, 44.55],
        [40.0, 43.9],
        [36.9, 44.6],
        [38.2, 44.9],
      ].map((coordinates, index) => ({
        type: "Feature",
        id: String(index + 1),
        geometry: { type: "Point", coordinates },
      }));

      const getBounds = (coordinates) => {
        let minLng = Infinity;
        let minLat = Infinity;
        let maxLng = -Infinity;
        let maxLat = -Infinity;

        coordinates.forEach(([lng, lat]) => {
          minLng = Math.min(minLng, lng);
          minLat = Math.min(minLat, lat);
          maxLng = Math.max(maxLng, lng);
          maxLat = Math.max(maxLat, lat);
        });

        return [
          [minLng, minLat],
          [maxLng, maxLat],
        ];
      };

      const createPin = (count) => {
        const $pin = $("<div>", { class: "contacts-pin" });
        $pin.html(`<span class="contacts-pin__count">${count}</span>`);
        return $pin[0];
      };

      const map = new YMap(container, {
        location: {
          center: [38.5, 44.5],
          zoom: 6,
        },
        showScaleInCopyrights: true,
      });

      map.addChild(new YMapDefaultSchemeLayer({}));
      map.addChild(new YMapDefaultFeaturesLayer({}));

      const marker = (feature) =>
        new YMapMarker(
          { coordinates: feature.geometry.coordinates },
          createPin(1),
        );

      const cluster = (coordinates, features) =>
        new YMapMarker(
          {
            coordinates,
            onClick() {
              map.update({
                location: {
                  bounds: getBounds(
                    features.map((item) => item.geometry.coordinates),
                  ),
                  duration: 400,
                },
              });
            },
          },
          createPin(features.length),
        );

      map.addChild(
        new YMapClusterer({
          method: clusterByGrid({ gridSize: 64 }),
          features: points,
          marker,
          cluster,
        }),
      );

      map.addChild(
        new YMapControls({ position: "bottom" }).addChild(
          new YMapZoomControl({}),
        ),
      );

      // API для фокуса на выбранный магазин из вкладки адреса
      $(document).trigger("contacts-map-ready", {
        focusStore(coordinates) {
          map.update({
            location: {
              center: coordinates,
              zoom: 15,
              duration: 400,
            },
          });
        },
      });
    } catch (error) {
      console.error("Не удалось инициализировать карту:", error);
    }
  };

  initContactsMap();

  const $contactsSection = $(".contacts");
  if ($contactsSection.length) {
    const $toggles = $contactsSection.find("[data-contacts-view]");
    const $mapPanel = $contactsSection.find('[data-contacts-panel="map"]');
    const $listPanel = $contactsSection.find('[data-contacts-panel="list"]');
    const $detailPanel = $contactsSection.find(
      '[data-contacts-panel="detail"]',
    );
    const $detailBack = $contactsSection.find("[data-contacts-detail-back]");
    const $detailTitle = $contactsSection.find("[data-contacts-detail-title]");
    const $detailHours = $contactsSection.find("[data-contacts-detail-hours]");
    const $detailPhone = $contactsSection.find("[data-contacts-detail-phone]");
    const $detailMax = $contactsSection.find("[data-contacts-detail-max]");
    const $detailTelegram = $contactsSection.find(
      "[data-contacts-detail-telegram]",
    );
    const $detailRoute = $contactsSection.find("[data-contacts-detail-route]");
    const $detailPhoto = $contactsSection.find("[data-contacts-detail-photo]");

    // Данные магазинов для вкладки адреса
    const storesById = {
      "sochi-donskaya-58": {
        title: "Сочи, Донская, 58",
        hours: "Ежедневно 10:00 - 20:00",
        phone: "+7 999 888-00-00",
        phoneHref: "tel:+79998880000",
        max: "https://max.ru/",
        telegram: "https://t.me/",
        photo: "assets/store-1.png",
        coords: [39.723, 43.599],
      },
      "adler-demokraticheskaya": {
        title: "Адлер, Демократическая, 75/1",
        hours: "Ежедневно 10:00 - 20:00",
        phone: "+7 999 888-00-00",
        phoneHref: "tel:+79998880000",
        max: "https://max.ru/",
        telegram: "https://t.me/",
        photo: "assets/store-2.png",
        coords: [39.924, 43.437],
      },
      "lazarevskoye-pavlova": {
        title: "Лазаревское, пер.Павлова, 2/3Б",
        hours: "Ежедневно 10:00 - 20:00",
        phone: "+7 999 888-00-00",
        phoneHref: "tel:+79998880000",
        max: "https://max.ru/",
        telegram: "https://t.me/",
        photo: "assets/store-1.png",
        coords: [39.331, 43.909],
      },
      "sochi-moskovskaya": {
        title: "Сочи, Московская, 18, стр 1а",
        hours: "Ежедневно 10:00 - 20:00",
        phone: "+7 999 888-00-00",
        phoneHref: "tel:+79998880000",
        max: "https://max.ru/",
        telegram: "https://t.me/",
        photo: "assets/store-2.png",
        coords: [39.725, 43.585],
      },
      "anapa-krymskaya": {
        title: "Анапа, Крымская, 260",
        hours: "Ежедневно 10:00 - 20:00",
        phone: "+7 999 888-00-00",
        phoneHref: "tel:+79998880000",
        max: "https://max.ru/",
        telegram: "https://t.me/",
        photo: "assets/store-1.png",
        coords: [37.317, 44.895],
      },
      "anapa-promyshlennaya": {
        title: "Анапа, Промышленная, 17",
        hours: "Ежедневно 10:00 - 20:00",
        phone: "+7 999 888-00-00",
        phoneHref: "tel:+79998880000",
        max: "https://max.ru/",
        telegram: "https://t.me/",
        photo: "assets/store-2.png",
        coords: [37.347, 44.898],
      },
      "gelendzhik-kirova": {
        title: "Геленджик, Кирова, 60Б",
        hours: "Ежедневно 10:00 - 20:00",
        phone: "+7 999 888-00-00",
        phoneHref: "tel:+79998880000",
        max: "https://max.ru/",
        telegram: "https://t.me/",
        photo: "assets/store-1.png",
        coords: [38.077, 44.562],
      },
      "novorossiysk-lenina": {
        title: "Новороссийск, пр.Ленина, 23",
        hours: "Ежедневно 10:00 - 20:00",
        phone: "+7 999 888-00-00",
        phoneHref: "tel:+79998880000",
        max: "https://max.ru/",
        telegram: "https://t.me/",
        photo: "assets/store-2.png",
        coords: [37.769, 44.724],
      },
      "novorossiysk-svobody": {
        title: "Новороссийск, ул.Свободы, 3/5",
        hours: "Ежедневно 10:00 - 20:00",
        phone: "+7 999 888-00-00",
        phoneHref: "tel:+79998880000",
        max: "https://max.ru/",
        telegram: "https://t.me/",
        photo: "assets/store-1.png",
        coords: [37.771, 44.726],
      },
    };

    let contactsView = "map";
    let contactsMapApi = null;

    const setContactsView = (view) => {
      contactsView = view;
      $contactsSection.removeClass("is-detail-open");
      $detailPanel.prop("hidden", true);

      $toggles.each(function () {
        const active = $(this).data("contactsView") === view;
        $(this).toggleClass("is-active", active);
        $(this).attr("aria-selected", active ? "true" : "false");
      });

      $mapPanel.prop("hidden", view !== "map");
      $listPanel.prop("hidden", view !== "list");
    };

    const fillStoreDetail = (store) => {
      $detailTitle.text(store.title);
      $detailHours.text(store.hours);
      $detailPhone.text(store.phone).attr("href", store.phoneHref);
      $detailMax.attr("href", store.max);
      $detailTelegram.attr("href", store.telegram);
      $detailPhoto
        .attr("src", store.photo)
        .attr("alt", `Магазин ${store.title}`);

      const [lng, lat] = store.coords;
      $detailRoute.attr(
        "href",
        `https://yandex.ru/maps/?rtext=~${lat},${lng}&rtt=auto`,
      );
    };

    const openStoreDetail = (storeId) => {
      const store = storesById[storeId];
      if (!store) return;

      fillStoreDetail(store);
      $contactsSection.addClass("is-detail-open");
      $listPanel.prop("hidden", true);
      $detailPanel.prop("hidden", false);

      // С 960px карта остаётся рядом; на мобиле — только вкладка адреса
      const isDesktop = window.matchMedia("(min-width: 960px)").matches;
      $mapPanel.prop("hidden", !isDesktop);

      if (isDesktop && contactsMapApi) {
        contactsMapApi.focusStore(store.coords);
      }

      $detailBack.trigger("focus");
    };

    const closeStoreDetail = () => {
      $contactsSection.removeClass("is-detail-open");
      $detailPanel.prop("hidden", true);

      // На десктопе снова список + карта; на мобиле — список
      const isDesktop = window.matchMedia("(min-width: 960px)").matches;
      if (isDesktop) {
        $listPanel.prop("hidden", false);
        $mapPanel.prop("hidden", false);
      } else {
        setContactsView("list");
      }
    };

    $toggles.on("click", function () {
      setContactsView($(this).data("contactsView"));
    });

    $contactsSection.on("click", ".contacts-card__address", function () {
      openStoreDetail($(this).data("storeId"));
    });

    $detailBack.on("click", closeStoreDetail);

    $(document).on("keydown.contactsDetail", (event) => {
      if (
        event.key === "Escape" &&
        $contactsSection.hasClass("is-detail-open")
      ) {
        closeStoreDetail();
      }
    });

    // Пробрасываем API фокуса карты после инициализации
    $(document).on("contacts-map-ready", function (_event, api) {
      contactsMapApi = api;
    });
  }
});
