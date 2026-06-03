const filtersContainer = document.querySelector(".filters");

document.getElementById("scrollLeft").addEventListener("click", () => {
  filtersContainer.scrollBy({ left: -200, behavior: "smooth" });
});

document.getElementById("scrollRight").addEventListener("click", () => {
  filtersContainer.scrollBy({ left: 200, behavior: "smooth" });
});

let taxSwitch = document.getElementById("switchCheckDefault");
taxSwitch.addEventListener("click", () => {
  let taxInfo = document.querySelectorAll(".tax-info");
  for (let tax of taxInfo) {
    tax.style.display = tax.style.display !== "inline" ? "inline" : "none";
  }
});

const filters = document.querySelectorAll(".filter");
for (let filter of filters) {
  filter.addEventListener("click", async () => {
    filters.forEach(f => f.classList.remove("active"));
    filter.classList.add("active");

    const category = filter.getAttribute("data-category");
    const response = await fetch(`/listings/category/${category}`);
    const html = await response.text();

    document.querySelector(".row").innerHTML =
      new DOMParser().parseFromString(html, "text/html").querySelector(".row").innerHTML;
  });
}
