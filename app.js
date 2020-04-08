//There is a README file in the folder.
import { requester } from './app-service.js';
import {createFormEntity} from './form-helpers.js';


// In case something fails from using imports comment the imports below and uncomment all of the functions below
import {detailsHandler, editHandler, createHandler} from './scripts/articleController.js';
import {loginHandler, registerHandler, logOutHandler} from './scripts/loginRegisterLogoutController.js';
import homeViewHandler from './scripts/homeViewController.js';

//----Don't touch this.
const apiKey = 'https://jsexam-ed676.firebaseio.com/';
requester.init(apiKey, sessionStorage.getItem('token'));
//----

//Notification pre-exam prep leftovers. Not used since there are no notifications in this exam
async function showNotification(type, message){
	//ADJUST THE QUERY SELECTORS AND AJAX REQUESTS APPROPRIATELY 
    let navBarEl = document.querySelector('nav[class="navbar navbar-expand-lg navbar-light bg-light "]');
    if(navBarEl === null) return;
    if(type === 'success'){
        let notifications = Handlebars.compile(await fetch('templates/notifications.hbs').then(x => x.text()));
        let obj = {
            isSuccess: true,
            isError: false,
            isLoading: false,
            message: message
        }
        navBarEl.insertAdjacentHTML('afterend', notifications(obj));
    }
    else if(type === 'error'){
        let notifications = Handlebars.compile(await fetch('templates/notifications.hbs').then(x => x.text()));
        let obj = {
            isSuccess: false,
            isError: true,
            isLoading: false,
            message: message
        }
        navBarEl.insertAdjacentHTML('afterend',notifications(obj));
    }
    else if(type === 'loading'){
		//If there is already a loading notification dont do anything. If there is already a non-loading notification remove it.
        let existingNotification = document.querySelector('#notifications');
        if(existingNotification !== null){
            if(existingNotification.querySelector('#loadingBox') !== null) return;
            existingNotification.remove();
        }
		//Place loading notification
        let notifications = Handlebars.compile(await fetch('templates/notifications.hbs').then(x => x.text()));
        let obj = {
            isSuccess: false,
            isError: false,
            isLoading: true,
            message: message
        }
        navBarEl.insertAdjacentHTML('afterend',notifications(obj));
		return
    }
    else{//If the html for the page doesn't already exist(Such as in the case of a refresh) don't do anything.
        return;
    }
	
    let errorOrSuccessBox = document.querySelector('#successBox,#errorBox');
    errorOrSuccessBox.addEventListener('click', (e)=>{
        errorOrSuccessBox.parentElement.remove();
    })
    sessionStorage.setItem('notificationType', 'null');
    sessionStorage.setItem('notificationMessage', 'null');
    setTimeout(()=>{
        errorOrSuccessBox.remove();
    }, 5000)
}

async function removeLoadingNotification(){
    let loadingBox = document.querySelector('#loadingBox') || document.createElement('noscript');
    loadingBox.remove();
}

// async function commonHandler(){
// 	this.partials = {};
// 	// Implement partials here //DO NOT FORGET TO PUT AWAIT BEFORE THE LOADING OF PARTIALS. PLEASE DONT SPEND ANOTHER 30 MINUTES TRYING TO FIGURE OUT THE ERROR YOU GET BY MISSING THIS LIKE YESTERDAY
//     //IT GIVE A FUCKING "cannot call toString() of null" IN THE FUCKING SAMMY-HANDLEBARS PLUGIN AND DOESNT GIVE ANY USEFUL INFO ABOUT HOW TO FIX IT.
//     this.partials.navBar = await this.load('templates/navBar.hbs');
//     this.partials.footer = await this.load('templates/footer.hbs');
//     this.isLogged = !!sessionStorage.getItem('token');
// }

// async function homeViewHandler(){
//     this.isLogged = !!sessionStorage.getItem('token');
//     await commonHandler.call(this);
//     if(this.isLogged === true){
//         await homeHandler.call(this);
//     }
//     else{
//         await loginHandler.call(this);
//     }
// }

// async function loginHandler(){
//     await commonHandler.call(this);
//     //Implement partials here if needed----
    
//     //----
//     await this.partial('templates/login.hbs');
//     let formRef = document.querySelector('form');

//     formRef.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         let formController = createFormEntity(formRef, ['email', 'password']);
//         let formData = formController.getValue();
//         let userUID;
//         try{
//             userUID = await firebase.auth().signInWithEmailAndPassword(formData.email, formData.password).catch(err=>{
//                 throw err;
//             });
//         }catch(err){
//             //TODO: add error message
//             alert("Invalid credentials. User with same email and password doesn' exist");
//             return;
//         }
//         sessionStorage.setItem('username', formData.email);
//         sessionStorage.setItem('uid', userUID.user.uid);
//         let userToken = await firebase.auth().currentUser.getIdToken();
//         sessionStorage.setItem('token', userToken);
//         requester.setAuthToken(userToken);
//         this.redirect('#/home');
//     })
// }

// async function registerHandler(){
//     await commonHandler.call(this);
//     //Implement partials here if needed----
    
//     //----
//     await this.partial('templates/register.hbs');

//     let formRef = document.querySelector('form');

//     formRef.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         let formController = createFormEntity(formRef, ['email', 'password', 'rep-pass']);
//         let formData = formController.getValue();
//         if(formData.password !== formData['rep-pass']){
//             //TODO: add error message
//             alert('password dont match');
//             return;
//         }
//         let userUID;
//         try{
//             userUID = await firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password).catch(err=>{
//                 throw err;
//             });
//         }catch(err){
//             //TODO: add error message
//             alert('Invalid credentials. User with same email already exists or email or password are not in correct format');
//             return;
//         }
//         sessionStorage.setItem('username', formData.email);
//         sessionStorage.setItem('uid', userUID.user.uid);
//         let userToken = await firebase.auth().currentUser.getIdToken();
//         sessionStorage.setItem('token', userToken);
//         requester.setAuthToken(userToken);
//         this.redirect('#/home');
//     })
// }

// async function logOutHandler(){
//     await firebase.auth().signOut();
//     sessionStorage.clear();
//     this.redirect('#/login');
// }

// function filterArticlesByCategory(allArticles, category){
//     let articlesFiltered = Object.keys(allArticles).reduce((acc, x)=>{
//         if(allArticles[x].category === category) {
//             let article = allArticles[x];
//             let articleData = {
//                 articleId: x,
//                 title: article.title,
//                 category: article.category,
//                 content: article.content,
//                 creatorName: article.creatorName,
//                 creatorUID: article.creatorUID,
//             }
//             acc.push(articleData);
//         }
//         return acc;
//     },[]) || [];
//     return articlesFiltered;
// }

// async function homeHandler(){
//     await commonHandler.call(this);
//     let allArticles = await requester.articles.getAll() || {};
//     let simpleSortFunc = (a, b)=>{
//         if(a.title > b.title) return 1;
//         else if(a.title < b.title) return -1;
//         else return 0;
//     };
//     //Javascript
//     this.javascriptArticles = filterArticlesByCategory(allArticles, 'Javascript');
//     this.javascriptArticles = this.javascriptArticles.sort(simpleSortFunc);
//     this.anyJavascriptArticles = this.javascriptArticles.length > 0;

//     //CSharp
//     this.CSharpArticles = filterArticlesByCategory(allArticles, 'CSharp');
//     this.CSharpArticles = this.CSharpArticles.sort(simpleSortFunc);
//     this.anyCSharpArticles = this.CSharpArticles.length > 0;

//     //Java
//     this.javaArticles = filterArticlesByCategory(allArticles, 'Java');
//     this.javaArticles = this.javaArticles.sort(simpleSortFunc);
//     this.anyJavaArticles = this.javaArticles.length > 0;

//     //Python
//     this.pythonArticles = filterArticlesByCategory(allArticles, 'Python');
//     this.pythonArticles = this.pythonArticles.sort(simpleSortFunc);
//     this.anyPythonArticles = this.pythonArticles.length > 0;

//     await this.partial('templates/home.hbs');
// }

// function validateCategory(formData){
//     if(formData.category !== 'Javascript' && 
//     formData.category !== 'CSharp' &&
//     formData.category !== 'C#' &&
//     formData.category !== 'Java' && 
//     formData.category !== 'Python'
//     ){
//         alert('TODO error. Category is incorrect. Must be "Javascript", "CSharp", "C#", "Java", "Python"');
//         return false;
//     }
//     if(formData.category === 'C#') formData.category = 'CSharp';
//     return true;
// }

// async function createHandler(){
//     await commonHandler.call(this);
//     await this.partial('templates/create.hbs');
    
//     let formRef = document.querySelector('form');

//     formRef.addEventListener('submit',async (e)=>{
//         e.preventDefault();
//         e.stopPropagation();

//         let formController = createFormEntity(formRef,['title', 'category', 'content']);
//         let formData = formController.getValue();
        
//         if(validateCategory(formData) === false) return;

//         formData.creatorUID = sessionStorage.getItem('uid');
//         formData.creatorName = sessionStorage.getItem('username'); 
//         await requester.articles.createEntity(formData);

//         this.redirect('#/home');
//     })
// }

// async function detailsHandler(){
//     await commonHandler.call(this);
//     let articleId = this.params.articleId;
//     let articleInfo = await requester.articles.getById(articleId);
//     Object.keys(articleInfo).forEach(x =>{
//         this[x] = articleInfo[x];
//     })
//     this.articleId = articleId;
//     this.isCreator = articleInfo.creatorUID === sessionStorage.getItem('uid');
//     await this.partial('templates/details.hbs', articleInfo);
 
//     if(this.isCreator === true){
//         let deleteBtn = document.querySelector('[class="btn delete"]');
//         deleteBtn.addEventListener('click', async (e)=>{
//             e.preventDefault();
//             e.stopPropagation();
//             await requester.articles.deleteEntity(articleId);
//             this.redirect('#/home');
//         })
//     }
// }

// async function editHandler(){
//     await commonHandler.call(this);
//     let articleId = this.params.articleId;
//     let existingArticleInfo = await requester.articles.getById(articleId);
//     await this.partial('templates/edit.hbs');

//     let formRef = document.querySelector('form');
//     let formController = createFormEntity(formRef,['title', 'category', 'content']);
//     formController.setValue({title: existingArticleInfo.title, category: existingArticleInfo.category, content: existingArticleInfo.content});

//     formRef.addEventListener('submit', async (e)=>{
//         e.preventDefault();
//         e.stopPropagation();

//         let formData = formController.getValue();
//         if(validateCategory(formData) === false) return;

//         await requester.articles.patchEntity(formData, articleId);
//         this.redirect('#/home');
//     })
// }


/**
 * Configure the application with all it's routes and the template engine that it uses 
 */
const app = Sammy('#root', function () {
    /**
     * Setting handlebars as template engine
     */
    this.use('Handlebars', 'hbs');

    /**
     * Define routes to be used by the application
     */
    this.get('#/', homeViewHandler);
    this.get('#/home', homeViewHandler);
	this.get('#/register', registerHandler);
    this.get('#/login', loginHandler);
    this.get('#/logout', logOutHandler);
    this.get('#/create', createHandler);
    this.get('#/details/:articleId', detailsHandler);
    this.get('#/details/edit/:articleId', editHandler);
});
/**
 * Start the application
 */
app.run('#/');
