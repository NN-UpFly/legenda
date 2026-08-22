const menuBtn = document.querySelector(".header__menu");
const mobileMenu = document.querySelector(".mobile-menu");
const menuClose = document.querySelector(".mobile-menu__close");
const evalModal = document.querySelector("#eval-modal");
const evalOpenTriggers = document.querySelectorAll("[data-eval-open]");

let setEvalModalOpen = () => {};

if (evalModal && evalOpenTriggers.length) {
  let lastEvalTrigger = null;
  const evalCloseBtn = evalModal.querySelector(".eval-modal__close");

  setEvalModalOpen = (open, { restoreFocus = true } = {}) => {
    evalModal.classList.toggle("is-open", open);
    evalModal.setAttribute("aria-hidden", open ? "false" : "true");
    document.documentElement.classList.toggle("is-modal-open", open);
    document.body.classList.toggle("is-modal-open", open);
    evalModal.inert = !open;

    if (open) {
      evalCloseBtn?.focus();
    } else if (restoreFocus && lastEvalTrigger) {
      const menuIsClosed =
        mobileMenu &&
        mobileMenu.contains(lastEvalTrigger) &&
        !mobileMenu.classList.contains("is-open");
      if (menuIsClosed && menuBtn) {
        menuBtn.focus();
      } else {
        lastEvalTrigger.focus();
      }
    }
  };

  evalModal.inert = true;

  evalOpenTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      lastEvalTrigger = trigger;
      setEvalModalOpen(true);
    });
  });

  evalModal.querySelectorAll("[data-eval-close]").forEach((el) => {
    el.addEventListener("click", () => setEvalModalOpen(false));
  });

  const evalScroll = evalModal.querySelector(".eval-modal__scroll");
  if (evalScroll) {
    evalScroll.addEventListener("click", (event) => {
      if (event.target === evalScroll) {
        setEvalModalOpen(false);
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && evalModal.classList.contains("is-open")) {
      setEvalModalOpen(false);
    }
  });

  const evalForm = evalModal.querySelector(".eval-modal__form");
  const evalPhotos = evalModal.querySelector("#eval-photos");
  const evalUploadText = evalModal.querySelector(".eval-modal__upload-text");
  const evalUploadDefault =
    evalUploadText?.textContent?.trim() || "Загрузите или перетащите фото";

  if (evalPhotos && evalUploadText) {
    evalPhotos.addEventListener("change", () => {
      const files = [...(evalPhotos.files || [])].slice(0, 3);
      if (evalPhotos.files && evalPhotos.files.length > 3) {
        const dt = new DataTransfer();
        files.forEach((file) => dt.items.add(file));
        evalPhotos.files = dt.files;
      }
      evalUploadText.textContent = files.length
        ? files.map((file) => file.name).join(", ")
        : evalUploadDefault;
    });
  }

  if (evalForm) {
    evalForm.addEventListener("submit", (event) => {
      event.preventDefault();
    });
  }
}

if (menuBtn && mobileMenu && menuClose) {
  const setMenuOpen = (open, { restoreFocus = true } = {}) => {
    if (open) {
      setEvalModalOpen(false, { restoreFocus: false });
    }

    mobileMenu.classList.toggle("is-open", open);
    mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    document.documentElement.classList.toggle("is-menu-open", open);
    document.body.classList.toggle("is-menu-open", open);
    mobileMenu.inert = !open;

    if (open) {
      menuClose.focus();
    } else if (restoreFocus) {
      menuBtn.focus();
    }
  };

  mobileMenu.inert = true;

  menuBtn.addEventListener("click", () => setMenuOpen(true));
  menuClose.addEventListener("click", () => setMenuOpen(false));

  mobileMenu.querySelectorAll("a, [data-eval-open]").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMenu.classList.contains("is-open")) {
      setMenuOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1440 && mobileMenu.classList.contains("is-open")) {
      setMenuOpen(false, { restoreFocus: false });
    }
  });
}

document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq-item").forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

const categoriesSwiper = new Swiper(".categories-swiper", {
  slidesPerView: 2,
  spaceBetween: 11,
  breakpoints: {
    668: {
      slidesPerView: "auto",
      spaceBetween: 22,
    },
    1440: {
      slidesPerView: 4,
      spaceBetween: 22,
    },
  },
});

const approachSwiper = new Swiper(".approach-swiper", {
  slidesPerView: "auto",
  spaceBetween: 17,
  scrollbar: {
    el: ".approach-swiper .swiper-scrollbar",
    draggable: true,
  },
  breakpoints: {
    668: {
      spaceBetween: 22,
    },
    1440: {
      slidesPerView: 4,
      spaceBetween: 22,
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
    668: {
      spaceBetween: 22,
    },
    1440: {
      slidesPerView: 3,
      spaceBetween: 22,
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
document.querySelectorAll(".stores-photos-swiper").forEach((el) => {
  const container = el.parentElement;
  const prevEl = container
    ? container.querySelector(".stores__btn--prev")
    : null;
  const nextEl = container
    ? container.querySelector(".stores__btn--next")
    : null;

  photoSwipers.push(
    new Swiper(el, {
      slidesPerView: "auto",
      spaceBetween: 5,
      navigation: {
        prevEl: prevEl,
        nextEl: nextEl,
      },
      breakpoints: {
        668: {
          spaceBetween: 22,
        },
        1440: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
      },
    }),
  );
});

const storeTabs = [...document.querySelectorAll(".stores__tab")];
const galleries = [...document.querySelectorAll(".stores-photos-swiper")];

const setActiveStore = (index) => {
  storeTabs.forEach((tab, i) => {
    const active = i === index;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", active ? "true" : "false");
  });

  galleries.forEach((gallery, i) => {
    if (i === index) {
      gallery.style.display = "";
      gallery.classList.add("is-active");
      if (photoSwipers[i]) {
        photoSwipers[i].update();
      }
    } else {
      gallery.style.display = "none";
      gallery.classList.remove("is-active");
    }
  });
};

storeTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const index = Number(tab.dataset.store);
    setActiveStore(index);
    storesTabsSwiper.slideTo(index);
  });
});

const initContactsMap = async () => {
  const container = document.getElementById("contacts-map");
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
      const pin = document.createElement("div");
      pin.className = "contacts-pin";
      pin.innerHTML = `<span class="contacts-pin__count">${count}</span>`;
      return pin;
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
  } catch (error) {
    console.error("Не удалось инициализировать карту:", error);
  }
};

initContactsMap();
