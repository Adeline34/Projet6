// Variables  pour les url de l'API
let apiWorks = "http://localhost:5678/api/works";
let apiCategories = "http://localhost:5678/api/categories";
// Constantes
// container de la galerie
const gallery = document.querySelector(".gallery");
//const barre en mode édition
const heading = document.getElementById("heading");
// Tous les boutons "modifié" apparaissant lors du login
const modalCallButtons = document.querySelectorAll(".modifier");
// bouton de login/logout en fonction du token
const loginLink = document.getElementById("login-link");
//Modale
// container de la 1ére modale
const modalContent1 = document.querySelector(".modal-content1");
// container de la galerie de la modale
const modal1 = document.querySelector(".modal1");
//container de la 2ème modale
const modalContent2 = document.querySelector(".modal-content2");
// container de l'ajout de project
const modal2 = document.querySelector(".modal2");
//tous les éléments qui permettent d'ouvrir ou fermer la 1ére modale
const modalTrigger = document.querySelectorAll(".modal-trigger");
// pour ouvrir la 2éme modale
const buttonmodal2 = document.getElementById("addPhotoButton");
// container de la galerie de la modale
const imageGallery = document.querySelector(".image-gallery");
// modale d'ajout de projet
//tous les éléments pour ouvrir et fermer la 2éme modale
const modalTrigger2 = document.querySelectorAll(".modal-trigger2");
//bouton de validation d'envoie de l'ajout du projet
const roundButton = document.getElementById("round-button");
// messages pour les erreurs de tailles ou de type de fichier des images lors de la sélection
const infoFile = document.querySelector(".info-file");
// fléches de retour vers la 1ére modale
const previousArrow = document.getElementById("previous-arrow");
//containers pour l'ajout des projets
const blueRectangle = document.querySelector(".blue-rectangle");
const rectangle = document.querySelector(".selected-image-container");
// const pour mesage d'erreur de l'API, display="none" par défaut
const errorApi = document.querySelector(".errorApi");
//variables
//le tableau works qui viendra de l'api
let works = [];
// les poubelles
let trashButton;
//les messages d'erreur pour l'effacement des projets
let warning = document.querySelector(".warning");

//check la connexion avec l'API "works"
// récupération des données
async function getWorks(apiWorks) {
  const response = await fetch(apiWorks);
  if (response.ok) {
    return await response.json();
  } else {
    errorApi.style.display = "flex";
    return Promise.reject(`Erreur HTTP fetch 1 => ${response.status}`);
  }
}

//récupération des données à partir de l'api "catégories"
async function getCategories(apiCategories) {
  const response = await fetch(apiCategories);
  if (response.ok) return await response.json();
}
//création des boutons de trie en passant par l'api catégorie
async function workByCategory() {
  let category = await getCategories(apiCategories);
  //création dynamique des 3 boutons de trie en récupérant l'intitulé 
  function buttonsCreation() {
    for (let i = 0; i < category.length; i++) {
      let newButton = document.createElement("button");
      newButton.type = "button";
      newButton.name = category[i].name;
      newButton.innerHTML = category[i].name;
      //split pour ne récupérer que le premier mot pour créer l'ID
      newButton.id = "btn-" + category[i].name.split(" ")[0];
      newButton.className = "button-filter";
      let portfolio = document.getElementById("filterButton");
      portfolio.appendChild(newButton);
    }
  }
  buttonsCreation();
  //création de la liste déroulante pour la 2ème modale en fonction des catégories de l'API
  function creationDropdownList() {
    const select = document.querySelector("#category");
    for (let i = 0; i < category.length; i++) {
      let option = document.createElement("option");
      option.value = category[i].id;
      option.innerHTML = category[i].name;
      select.appendChild(option);
    }
  }
  creationDropdownList();
}
workByCategory();
//appel des fonctions de création des galerie et des filtres
async function createWorks() {
  // object array 
  works = await getWorks(apiWorks);
  filterCreation();
  projectCreation();
  worksModal1();
  //effacement des images
  trashButton = document.querySelectorAll(".fa-trash-can");

  trashButton.forEach((trash) =>
    trash.addEventListener("click", function (e) {
      let figure = this.parentNode;
      let idPhoto = figure.id;
      //appel de l'API avec la méthode "DELETE" pour effacer les travaux
      async function deleteProject() {
        await fetch(`${apiWorks}/${idPhoto}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then(function (response) {
          //si status 204 (ok), projet effacé
          if (response.status === 204) {
            figure.remove();
            let figureDelete = figure.id;
            const figureToDelete = document.getElementById(figureDelete);
            figureToDelete.remove();
          } else if (response.status === 401) {
            //ne trouve pas les autorisations nécessaire (token) 
            resStatus = response.status;
            warning.style.display = "flex";
            warning.innerHTML =
              "Vous n'avez pas les autorisations pour effacer le fichier, statut " +
              resStatus;
          } else {
            // connexion avec l'API perdu
            resStatus = response.status;
            warning.style.display = "flex";
            warning.innerHTML =
              "Impossible d'effacer le fichier, problème d'accès à l'API." +
              resStatus;
          }
        });
      }
      deleteProject();
    })
  );
}
createWorks();

//création de la galerie principale
function projectCreation() {
  for (const work of works) {
    let idPhoto = work.id;
    let figure = document.createElement("figure");
    figure.id = idPhoto;
    figure.className = "figure-gallery";
    let img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    figure.appendChild(img);
    let figcaption = document.createElement("figcaption");
    figcaption.innerHTML = work.title;
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  }
}
// création de la galerie de la 1ére modale
async function worksModal1() {
  for (const work of works) {
    let idPhoto = work.id;
    let figure = document.createElement("figure");
    figure.id = idPhoto;
    figure.className = "figure-gallery";
    let img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    figure.appendChild(img);
    let figcaption = document.createElement("figcaption");
    figcaption.innerHTML = "éditer";
    figure.appendChild(figcaption);
    //ajout des poubelles
    let trashGallery = document.createElement("i");
    trashGallery.className = "fa-solid fa-trash-can trash";
    trashGallery.innerHTML = "";
    figure.appendChild(trashGallery);
    // création de la balise figure
    imageGallery.appendChild(figure);
  }
}
// Ajouter un nouveau projet dans la galerie/
function NewProjectGallery() {
  console.log("nouveau travail")
  let idPhoto = works.length + 1;
  let figure = document.createElement("figure");
  figure.id = idPhoto;
  figure.className = "figure-gallery";
  let img = document.createElement("img");
  img.src = addedImage;
  img.alt = title.value;
  figure.appendChild(img);
  let figcaption = document.createElement("figcaption");
  figcaption.innerHTML = title.value;
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}
// Ajouter un nouveau projet dans la modale
function NewProjectModall() {
  console.log("nouvelle modale ")
  let idPhoto = works.length + 1;
  let figure = document.createElement("figure");
  figure.id = idPhoto;
  figure.className = "figure-gallery";
  let img = document.createElement("img");
  img.src = addedImage;
  img.alt = "";
  figure.appendChild(img);
  let figcaption = document.createElement("figcaption");
  figcaption.innerHTML = "éditer";
  figure.appendChild(figcaption);
  let trashGallery = document.createElement("i");
  trashGallery.className = "fa-solid fa-trash-can trash";
  trashGallery.innerHTML = "";
  figure.appendChild(trashGallery);
  imageGallery.appendChild(figure);
}

//  fonction pour la création du trie par catégorie
let choiceOfFilter;
function filterCreation() {
  const btnFilter = document.querySelectorAll(".button-filter");
  btnFilter.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      if (e.target.name === "Tous") {
        choiceOfFilter = works;
        displayFilter(choiceOfFilter);
      } else {
        choiceOfFilter = works.filter((obj) => obj.category.name === e.target.name);
        displayFilter(choiceOfFilter);
      }
    });
  });
}
//affichage du filtre
function displayFilter(choiceOfFilter) {
  gallery.innerHTML = "";
  for (const filter of choiceOfFilter) {
    container = choiceOfFilter;
    let figure = document.createElement("figure");
    figure.id = filter.id;
    figure.className = "figure-gallery";
    let img = document.createElement("img");
    img.src = filter.imageUrl;
    img.alt = filter.title;
    figure.appendChild(img);
    let figcaption = document.createElement("figcaption");
    figcaption.innerHTML = filter.title;
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  }
}

// Modification des éléments en fonction de la présence ou non du token
const filters = document.querySelector(".filters");
const mesProjetsMarginH2 = document.querySelector(".mes-projets");
let token = sessionStorage.getItem("token");
if (token === null) {
    heading.remove()
    document.getElementById("login-link").innerHTML = "login"
    filters.style.display = "flex" 
    mesProjetsMarginH2.style.marginBottom = "30px"
    filters.style.marginBotton = "" 
    header.style.marginTop = "50px"
} else {
  heading.style.display = "flex";
  document.getElementById("login-link").innerHTML = "logout"
  filters.style.display = "none"
  mesProjetsMarginH2.style.marginBottom = "92px"
  filters.style.marginBotton = "none"
  header.style.marginTop = "38px"
}

//boutons "modifier"
modalCallButtons.forEach(function (item) {
  token === null ? item.remove() : item.style.display = "flex";
});

// Gestion du bouton login/logout 

// écoute du bouton login/logout
loginLink.addEventListener("click", function () {
  logInLogOut();
});

// redirection de la page en fonction du token 
function logInLogOut() {
  if (token === null) {
    console.log("null")
    window.location.replace("./login.html");
  } else {
    sessionStorage.clear();
    window.location.replace("./index.html");
  }
}

//  Partie des modales

// désactiver le bouton d'envoie d'un nouveau projet
roundButton.disabled = true;

// liste des éléments écoutés sous la class "trigger" dans la 1ere modale
modalTrigger.forEach((trigger) =>
  trigger.addEventListener("click", toggleModal)
);

/**** change le nom de la  class avec le toggle ****/
function toggleModal() {
  modalContent1.classList.toggle("active");
  warning.style.display = "none";

  // apparition ou non de la modale 1 en fonction de la Class
  modalContent1.className === "modal-content1 active"
    ? (modal1.style.display = "flex")
    : (modal2.style.display = "none");
}

// fermeture ouverture des modales
modal1.addEventListener("click", function () { warning.style.display = "none"; });
warning.innerHTML = " ";

// la modale se ferme en cliquant en dehors de la modale et pas de l'intérieur
modalContent1.addEventListener("click", (e) => { toggleModal(); });
modalContent1.children[1].addEventListener("click", function (e) { e.stopPropagation(); });
modalContent2.addEventListener("click", (e) => { toggleModal2(); });
modalContent2.children[1].addEventListener("click", function (e) { e.stopPropagation(); })

// liste des éléments écoutés sous la class trigger dans la 2éme modale
modalTrigger2.forEach((trigger) => trigger.addEventListener("click", toggleModal2));

// conditions d'apparitions ou pas  de la 2éme modale
function toggleModal2() {
  modalContent2.classList.toggle("active");
  modalContent2.className === "modal-content2 active"
    ? (modal2.style.display = "flex")
    : (modal1.style.display = "none");
  resetblueRectangle();
  errorMessageRemove()
}

// bouton toggle pour visualiser ou pas les modales
buttonmodal2.addEventListener("click", function () {
  toggleModal();
  toggleModal2();
});

// fléche pour revenir à la 1éré modale
previousArrow.addEventListener("click", function () {
  modalContent1.classList.toggle("active");
  errorMessageRemove();
  toggleModal2();
  modalContent1.className === "modal-content1 active"
    ? modal1.style.display = "flex"
    : modal2.style.display = "none";
});

// partie pour l'input file
let fileUploadInput = document.querySelector("#inputFile");
infoFile.innerHTML = "jpg png : 4 mo max";
fileUploadInput.addEventListener("change", previewNewWork);
//constante pour le titre  
const inputTitle = document.getElementById("title");
// constante de la liste deroulante des catégories
const selectCategory = document.getElementById("category")
//la partie titre est désactivée pour empécher de la remplir tant qu'il n'y a pas d'image de sélectionné
inputTitle.disabled = true;
// la liste déroulante est désactivée
selectCategory.disabled = true;
// variable de l'image sélectionné
let selectedImage;
//remise à zéro du message d'erreur
function errorMessageRemove() {
  errorMessage.style.display = "none";
  errorMessage.innerHTML = " ";
}
// Message si le fichier est trop grand ou n'est pas un jpeg, jpg or png
function infoFileNotOk() {
  infoFile.classList.remove("infoFileOk");
  infoFile.classList.add("infoFileNotOk");
  fileUploadInput.value = "";
}

/**** pévisualisation de l'image ****/
function previewNewWork() {
  const sizeFile = this.files[0].size;
  console.log(this.files[0])
  selectedImage = this.files[0];
  const fileExtensionRegex = /\.(jpe?g|png)$/i;
  //contrôle du type de fichier
  if (!fileExtensionRegex.test(this.files[0].name)) {
    infoFile.innerHTML = "Le fichier n'est pas au format jp(e)g ou png";
    infoFileNotOk();
    return;
  }
  // contrôle de la taille du fichier
  if (sizeFile > 4194304) {//4*1024*1024 octets
    infoFile.innerHTML = "Le fichier fait plus de 4 mo";
    infoFileNotOk();
    return;
  }

  const newselectedImage = new FileReader();
  newselectedImage.readAsDataURL(selectedImage);
  newselectedImage.addEventListener("load", (event) =>
    imageDisplay(event)
  );
  fileUploadInput.value = "";
}
// fonction pour la création de la prévisualisation
function imageDisplay(event) {
  let idPhoto = works.length + 1;
  let figure = document.createElement("figure");
  figure.id = idPhoto;
  figure.className = "figure-gallery";
  let img = document.createElement("img");
  img.src = event.target.result;
  img.alt = "";
  figure.appendChild(img);
  let figcaption = document.createElement("figcaption");
  figcaption.innerHTML = "";
  figure.appendChild(figcaption);
  rectangle.appendChild(figure);
  addedImage = event.target.result;
  rectangle.style.display = "flex";
  blueRectangle.style.display = "none";
  // réactivation de l'input qui contient le titre
  inputTitle.disabled = false;
  // réactivation de la liste déroulante
  selectCategory.disabled = false;
}

//  partie formdata 
let validateContentForm = document.querySelectorAll(".input-add-project");
validateContentForm.forEach((controle) =>
  controle.addEventListener("change", function (e) {
    // si le titre et la liste déroulante ne sont pas vide, réactivation du bouton de validation
    if (title.value !== " " && category.options.selectedIndex !== -1) {
      roundButton.style.background = "#1D6154";
      roundButton.style.cursor = "pointer";
      roundButton.disabled = false;
    }
  })
);

// fonction d'envoie du nouveau projet de l'API
function sendNewWork(e) {
  const formData = new FormData();
 //files[0]
  formData.append("image", selectedImage);
  // texte
  formData.append("title", title.value);
  //envoie de la valeur de category.value qui est un entier (integer)
  formData.append("category", category.value);

// fetch post avec token
  fetch(apiWorks, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then(function (response) {
      // reponse O.K
      if (response.status === 201) {
        //les 2 fonctions pour créer l'affichage du nouveau projet sans rafraichissement
        NewProjectGallery();
        NewProjectModall();
        // Message pour informer de la réussite de l'envoie du projet vers l'API
        errorMessage.style.display = "flex";
        errorMessage.innerHTML = `Votre projet a été ajouté !`;
        //remise à zéro des input et de la liste déroulante
        category.value = " ";
        title.value = " ";
        //désactivation du bouton de validation
        roundButton.disabled = true;
        // tempo pour laisser le message affiché 3secondes avant de retourné à la galerie
        setTimeout(resetblueRectangle, 3000);
        setTimeout(toggleModal2, 3000);
      } else if (response.status === 400) {
        // response 400, not all fields are filled in
        roundButton.disabled = true;
        //affichage du message confirmant que tous les champs n'ont pas été remplis
        errorMessage.style.display = "flex";
        errorMessage.innerHTML = "Veuillez compléter tous les champs.";
        //remise à zéro du titre et de la liste déroulante
        category.value = " ";
        title.value = " ";
        //bouton de validation désactivé
        roundButton.style.background = "#A7A7A7";
        roundButton.style.cursor = "default";
        roundButton.disabled = true;
        // laisse le message d'erreur affiché 3 secondes
        setTimeout(errorMessageRemove, 3000);
      } else {
        // autres réponse 
        // désactivation du bouton de validation
        roundButton.disabled = true;
        // affichage du message signalant l'absence de connexion avec l'API
        errorMessage.style.display = "flex";
        errorMessage.innerHTML = "Problème de connexion avec l'API, contacter votre administrateur.";
      }
    });
}
//
const titleValue = document.querySelector("#title")

titleValue.addEventListener("input", function(e){
 if(e.target.value === ""){
  errorMessage.style.display = "flex";
        errorMessage.innerHTML = "veuillez compléter le titre";
 }
})

/*Bouton de validation du projet*/
roundButton.addEventListener("click", function () {
  sendNewWork();
});

// fonction pour tout remettre à zéro après l'envoie d'un nouveau projet
function resetblueRectangle() {
  rectangle.innerHTML = " ";
  rectangle.style.display = "none";
  blueRectangle.style.display = "flex";
  infoFile.innerHTML = "jpg png : 4 mo max";
  infoFile.classList.remove("infoFileNotOk");
  infoFile.classList.add("infoFileOK");
  title.value = " ";
  category.value = " ";
  roundButton.style.background = "#A7A7A7";
  roundButton.style.cursor = "default";
  inputTitle.disabled = true;
  selectCategory.disabled = true;
  roundButton.disabled = true;
}
