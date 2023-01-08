function toggleForm() {
	section = document.querySelector("section");
	container = document.querySelector(".container-application");
	container.classList.toggle("active");
	section.classList.toggle("active");
}
const signinBtn = document.querySelector(".signinBtn1");
const signupBtn = document.querySelector(".signupBtn1");
const formBX = document.querySelector(".formBX1");
const body = document.querySelector(".body-index");

signupBtn.onclick = function () {
	formBX.classList.add("active");
	body.classList.add("active");
};
signinBtn.onclick = function () {
	formBX.classList.remove("active");
	body.classList.remove("active");
};
