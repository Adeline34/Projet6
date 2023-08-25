// constante url login
let apiLogin = "http://localhost:5678/api/users/login";
const submitSeConnecter = document.getElementById("submit-connecter");
//constante pour le message d'information
const messageInformation = document.getElementById("messageInformation");
//remise à zéro du "style" du message d'information
messageInformation.classList.remove = "messageInformation";
// focus sur l'input de l'email
document.getElementById("emailUser").focus()
// écoute d'évennement sur le bouton de connexion
 submitSeConnecter.addEventListener("click", (e) => {
    e.preventDefault();
    //const pour email et password
    let email = document.getElementById("emailUser").value;
    let password = document.getElementById("password").value;
    //Expression régulière pour contrôler le format de l'adresse. la "regex" a été récupéré sur internet.
    if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i)) {
        //message d'information en fonction du problème
        document.getElementById("messageInformation").innerHTML =
            "Entrer un E-mail valide!"
            messageInformation.classList = "messageInformation";
        return;
    }
      else if (!password){
        //message d'information en fonction du problème
        document.getElementById("messageInformation").innerHTML =
            "Entrer un mot de passe !"
            messageInformation.classList = "messageInformation";
        return;
    }
   
    // fetch en mode post pour la connexion en mode édition
    fetch(apiLogin, {
        method: "POST",
        headers: {
            accept: "application/json",
            "Content-type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
    })
       
    //Check du status de la connexion
        .then(function (authResponse) {
            
            if(authResponse.status === 404){
                //message d'information pour signaler l'absence de ce compte dans la base de donnée (email=valide, password=présent)
                messageInformation.innerHTML =
                    "Votre compte n'existe pas";
                    messageInformation.classList = "messageInformation";
            } else if (authResponse.status === 200) {
                return authResponse.json();
            } else {
                //message signalant l'absence de remplissage d'un des 2 inputs (email ou password) et remise à zéro des 2.
                messageInformation.innerHTML =
                    "Mauvais identifiant ou mot de passe";
                email.value = ""
                password.value = ""
                messageInformation.classList  = "messageInformation";
                return Promise.reject();
            }
        })
        
        //  sauvegarde du token dans le "sessionStorage"
        .then(function (userInformation) {
            sessionStorage.setItem("token", userInformation.token);
            window.location.replace("./index.html");
        })
        .catch((error) => console.error(error));
});
