document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  if (hamburger) {
    hamburger.addEventListener("click", function () {
      const menu = document.getElementById("navLinks");
      if (menu) {
        menu.classList.toggle("active");
      }
    });
  }

  const defaultUsernameText = "User";
  const username = localStorage.getItem("username") || defaultUsernameText;

  const navUsernameElement = document.querySelector("#nav-username");
  const navSignupElement = document.querySelector("#nav-signup");
  const navLoginElement = document.querySelector("#nav-login");
  const navCreateElement = document.querySelector("#nav-create");
  const navUserElement = document.querySelector("#nav-user");

  navUsernameElement.textContent = username;

  if (username === defaultUsernameText) {
    navUserElement.style.display = "none";
    navCreateElement.style.display = "none";
    navSignupElement.style.display = "block";
    navLoginElement.style.display = "block";
  } else {
    navUserElement.style.display = "block";
    navCreateElement.style.display = "block";
    navSignupElement.style.display = "none";
    navLoginElement.style.display = "none";
  }

  const logoutLink = document.querySelector(".logout");
  logoutLink.addEventListener("click", function () {
    localStorage.removeItem("username");
    localStorage.removeItem("accessToken");
    window.location.reload();
  });

  const dataList = document.getElementById("blogCarousel");
  const name = localStorage.getItem("username") || "ukonu";

  async function fetchData() {
    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/blog/posts/${name}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const responseData = await response.json();
      const data = responseData.data;

      const listItems = data.map((item) => {
        const li = document.createElement("li");
        li.className = "carousel-card";

        li.innerHTML = `
                
        <div class="cardImg" style="background-image: url('${item.media.url}');">
        <button class="blogBtn">
        <a href="./post/index.html?id=${item.id}">Read More</a> 
        <!-- Pass the ID as a URL parameter -->
    </button>
                
                <div class="blogDescription">
                    <p><i class="fa-solid fa-user"></i> ${item.author.name}</p>
                    <p><i class="fa-regular fa-calendar-days"></i> ${item.created}</p>
                </div>
            </div>
            <h2 class="blogTitle">${item.title}</h2>
            `;

        return li;
      });

      dataList.innerHTML = "";
      listItems.forEach((li) => dataList.appendChild(li));
    } catch (error) {
      console.error("Error fetching data:", error);
      dataList.innerHTML = "<li>Error loading data</li>";
    }
  }

  fetchData();

  fetchData().then(() => {
    const carouselTrack = document.querySelector(".carousel-track");
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");
    const carouselItems = document.querySelectorAll(".carousel-card");
    const totalItems = carouselItems.length;

    function getItemsPerView() {
      const screenWidth = window.innerWidth;
      if (screenWidth < 480) {
        return 1;
      } else if (screenWidth < 750) {
        return 2;
      } else {
        return 3;
      }
    }

    let itemsPerView = getItemsPerView();

    function updateItemWidth() {
      if (carouselItems.length === 0) {
        return 0;
      }
      return carouselItems[0].offsetWidth;
    }

    let itemWidth = updateItemWidth();
    let maxOffset = (totalItems - itemsPerView) * itemWidth;
    let currentOffset = 0;

    function updateTrackPosition() {
      carouselTrack.style.transform = `translateX(-${currentOffset}px)`;
    }

    function updateCarousel() {
      itemsPerView = getItemsPerView();
      itemWidth = updateItemWidth();
      maxOffset = (totalItems - itemsPerView) * itemWidth;

      if (currentOffset > maxOffset) {
        currentOffset = maxOffset;
      }

      updateTrackPosition();
    }

    function moveLeft() {
      currentOffset -= itemWidth * itemsPerView;
      if (currentOffset < 0) {
        currentOffset = maxOffset;
        carouselTrack.style.transition = "none";
        updateTrackPosition();
        setTimeout(() => {
          carouselTrack.style.transition = "transform 0.5s ease-in-out";
        }, 0);
      } else {
        updateTrackPosition();
      }
    }

    function moveRight() {
      currentOffset += itemWidth * itemsPerView;
      if (currentOffset > maxOffset) {
        currentOffset = 0;
        carouselTrack.style.transition = "none";
        updateTrackPosition();
        setTimeout(() => {
          carouselTrack.style.transition = "transform 0.5s ease-in-out";
        }, 0);
      } else {
        updateTrackPosition();
      }
    }

    prevButton.addEventListener("click", moveLeft);
    nextButton.addEventListener("click", moveRight);

    window.addEventListener("resize", updateCarousel);
    updateCarousel();
  });

  const gridList = document.getElementById("gridContainer");

  async function fetchGridData() {
    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/blog/posts/${name}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const responseData = await response.json();
      const data = responseData.data;

      const gridItems = data.map((item) => {
        const div = document.createElement("div");
        div.className = "gridCard";

        div.innerHTML = `
        <a href="./post/index.html?id=${item.id}"><div class="gridImg" style="background-image:url('${item.media.url}');">
        <div class="gridDescription">
        <h3>${item.title}</h3>
          <p><i class="fa-regular fa-calendar-days"></i> ${item.created}</p>
      </div>
      </div></a>

      
          `;
        return div;
      });

      gridList.innerHTML = "";
      gridItems.forEach((div) => gridList.appendChild(div));
    } catch (error) {
      console.error("Error fetching data:", error);
      gridList.innerHTML = "<li>Error loading data</li>";
    }
  }

  fetchGridData();
});
