/*const state = {    // contains list of card and each array element contain different values to store
    taskList: [
        {
                url: " ",
                title: "",
        },
        {
            url: " ",
            title: "",
        },
        {
            url: " ",
            title: "",
        },
    ]     
}    */   //  this will not be good way as it will make it static as we are one by one adding number of array element , as here only 3 elements are there
// we want that the number of item to not be fixed and it should be added based on user action.


const state = {
    taskList: [],
};
// we need to get card on UI means we need to perform some DOM manipulations
const taskContent = document.querySelector(".task__content");//using query selector we can manipulate in DOM using Selectors of CSS
// console.log(taskModel);         //we can't make change in html  using getElementById or getElementsByClassName

/* using getElementById or getElementsByClassName we only can access html and can perform action on it in javascript  like we do in form 
but can't manipulate html because in all these getElement...   we are gettting something from HTML getting acees to it 
but we can't manipulate HTML i.e.  we are not able to push something from Javascript to html   */
// it can only done using queryselector()



//to create a card on home page below search bar
const htmlTaskContent = ({ id, url, title, description, type }) => {   //  5 arguments
    return `    <div class="col-md-6 col-lg-4 mt-3" id=${id} key="${id}">
        <div class="card shadow-sm task__card">
            <div class="card-header d-flex gap-2 justify-content-end task__card__header">
                <button type="button" class="btn btn-outline-info mr-2" name=${id}  onclick="editTask()">
                        <i class="fa fa-pencil-alt" name="${id}"></i>
                </button>
                <button type="button" class="btn btn-outline-danger mr-2" name=${id} onclick="deleteTask()">
                    <i class="fa fa-trash-alt" name="${id}"></i>
                </button>
            </div>
            <div class="card-body">
                ${url
            ? `<img   width="100%" height="150px" src=${url} style="object-fit: cover; object-position: center" alt="card image here" class="card-image-top md-3  rounded-lg "/>`
            : `<img   width="100%" height="150px" style="object-fit: cover; object-position: center" src="https://tse4.mm.bing.net/th?id=OIP.331GjjPitU9zLBRx6caEFgHaF3&pid=Api&P=0" 
                alt="card image here" class="card-image-top md-3 rounded-lg"  />`}
                <h4 class="task__card__title">${title}</h4>
                <p class="description trim-3-lines text-muted" data-gram_editor="false">${description}</p>
                <div class="tags text-white d-flex flex-wrap">
                        <span class="badge bg-primary m-1">${type}</span>
                </div>
            </div>
            <div class="card-footer">
                <button type="button" class="btn btn-outline-primary float-right" data-bs-toggle="modal" data-bs-target="#showTask" id=${id} onclick='openTask()'>Open Task</button>
            </div>
        </div>
    </div>   `
}


//we can call this function n number of times based on user action and that number of cards will formed



// on click of Open task button  we need a new container modal
const taskModal = document.querySelector(".task__modal__body");
const htmlModalContent = ({ id, url, title, description }) => {   //for open task
    const date = new Date(parseInt(id));
    return ` <div id=${id}>
        ${url ? `<img width="100%" src=${url} alt="card image here" class="img-fluid place__holder__image md-3" />`
            : `<img width="100%" src="https://tse4.mm.bing.net/th?id=OIP.331GjjPitU9zLBRx6caEFgHaF3&pid=Api&P=0" 
        alt="card image here" class="img-fluid place__holder__image md-3" />`}
        <strong class="text-sm text-muted">
            Created on ${date.toDateString()}
        </strong>
        <h2 class="my-3">${title}</h2>
        <p class="lead"> ${description}</p>
    </div>  `;
};



// here we will be updating our local storage (i.e. , the modals/cards which we see on our UI home page and on click of Open task button)
const updateLocalStorage = () => {    //in local storage all data stored in form of string so need to use JSON to stringify
    localStorage.setItem('task', JSON.stringify({     //setItem  stores value in (key,value) form   but it local storage stores in form of string
        tasks: state.taskList,  // accessing taskList array from state object we created above  and storing it in key value form
    })
    );
};    //localstorage.setItem, localstorage.getItem, localstorage.removeItem


// to get data or card or modal on our ui from local storage(Browser Storage)
const loadInitialData = () => {
    const localStorageCopy = JSON.parse(localStorage.task);    //we can add javascript code to html so need in form of object

    // it might be initially there will be nothing in local storage
    if (localStorageCopy) {    //if there is something in local storage then show it
        state.taskList = localStorageCopy.tasks;
    }

    // we can apply operation like map, filter, reduce on array in javascript
    state.taskList.map((cardData) => {
        taskContent.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
    });
};

const handleSubmit = (event) => {    //on click of submit changes button need to submit
    const id = `${Date.now()}`;    // id must be unique which we made based on time we saved
    const input = {
        url: document.getElementById('imageUrl').value,
        title: document.getElementById('taskTitle').value,
        type: document.getElementById('taskType').value,
        description: document.getElementById('taskDecription').value,
    };
    if (input.title === "" || input.type === "" || input.description === "") {
        return alert("Please fill all the fields");
    }
    // adding the above value we got from form to UI home page
    taskContent.insertAdjacentHTML("beforeend", htmlTaskContent({ id, ...input }));

    // we need to also add it to the taskList object we created as well as local storage
    state.taskList.push({ id, ...input });   // tasklist is an array so need to push values in array
    // when we don't want object withinobject we use spread operator

    // adding the same to local storage too     using function we created
    updateLocalStorage();

}


// we want that on opening of particular task using     open task button     that correct particular task must be open
// opens new modal on our ui when user clicks open task
const openTask = (e) => {
    if (!e) {            //default feature i.e. when button not clicked
        e = window.event;
    }

    // find the correct card opened
    const getTask = state.taskList.find(({ id }) => id === e.target.id);
    taskModal.innerHTML = htmlModalContent(getTask);
    // console.log(getTask);
};


// delete operation
const deleteTask = (e) => {
    if (!e) {  //default feature i.e. when button not clicked
        e = window.event;
    }
    const targetID = e.target.getAttribute("name");  //name attribute is given in htmlModalContent above which stores id
    console.log(targetID);

    // filter returns an array
    const removeTask = state.taskList.filter(({ id }) => id !== targetID);   //it filters and store id of all element other than we want to delete
    console.log(removeTask);    //removeTask contains id of all element other than which we want to delete

    state.taskList = removeTask;  //now only id of element other than which we want delete is present in local storage 
    updateLocalStorage();
    // but now it actually got deleted but this does not happen dynamically i.e. we need to refresh page for make it visibly removed

    const type = e.target.tagName;   // type returns tag type like here in <button> tag we have <i> tag
    // console.log(type);  

    // This function is called only when either of button tag or i tag selected
    // we need to reach to previous parent using parentNode until we reach the div tag which is containing whole modal
    if (type === "BUTTON") { //if we clicked on button tag   then we need to reach the 3 step back to reach parent container 
        // console.log(e.taget.parentNode.parentNode.parentNode);
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(  //for removing child need to move one more step back and then remove it's child
            e.target.parentNode.parentNode.parentNode
        );
    }
    else {  //else if we selected <i> tag    we need to move one more step back as <i> is more tag inside button
        return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild( //need to remove child by moving one more step back
            e.target.parentNode.parentNode.parentNode.parentNode
        );
    }
}

const editTask = (e) => {
    if (!e) {  //default feature i.e. when button not clicked
        e = window.event;
    }

    const targetID = e.target.id;
    const type = e.target.tagName;

    let parentNoD;   // listing some variable as we will repeatedly using them
    let taskList;
    let taskDescription;
    let taskType;
    let submitButton;

    if (type === "BUTTON") {
        parentNoD = e.target.parentNode.parentNode;
    } else {  //<i> tag selected
        parentNoD = e.target.parentNode.parentNode.parentNode;
    }

    // accessing the contents 
    taskTitle = parentNoD.childNodes[3].childNodes[3];   //childNodes property will return a list of array all childs of given parent
    // console.log(taskTitle);
    taskDescription = parentNoD.childNodes[3].childNodes[5];   
    // console.log(taskDescription);
    taskType= parentNoD.childNodes[3].childNodes[7].childNodes[1]; //it is present in span tag  
    submitButton = parentNoD.childNodes[5].childNodes[1];


    taskTitle.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");

    // now we only did accessed the button but we need to remove that on click it should not open the opentask modal
    submitButton.setAttribute("onclick","saveEdit()")   //on click we want to save so calling funtion
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");

    submitButton.innerHTML = "Save Changes";

    // //   const getTask = state.taskList.find(({ id }) => id === e.target.id);
    // //   const taskModal = document.querySelector(".task__modal__body");


    //   // const urlx= document.querySelector("#imageUrl").value;
    //   // const titlex= document.querySelector("#taskTitle");
    //   // const typex= document.querySelector('#taskType').value;
    //   // const descriptionx= document.querySelector('#taskDecription').value;

    // urlx.innerHTML = `hello1`;
    // titlex.innerHTML = `hello1`;
    // typex.innerHTML = "hello1";

    // const getTask = state.taskList.find(({ id }) => id === e.target.id);
    // taskModal.innerHTML = htmlModalContent(getTask);
    // document.querySelector('taskTitle').value = getTask.taskList.title;
    // document.querySelector('taskTitle').value = getTask.taskList.title;
    //     document.querySelector('taskType').value = getTask.taskList.type;
    //     document.querySelector('taskDecription').value = getTask.taskList.description 

    // //    const type = e.target.tagName;   // type returns tag type like here in <button> tag we have <i> tag
    // //    console.log(type); 
    // //    console.log(urlx);
    // return `<div data-bs-toggle="modal" data-bs-target="#exampleModal" > </div>"`
    // return taskConten = document.getElementById("#exampleModal");//using query selector we can manipulate in DOM using Selectors of CSS

}

const saveEdit = (e) => {
    if (!e) {
        e = window.event;
    }

    const targetID = e.target.id;
    const parentNoD = e.target.parentNode.parentNode;

    const taskTitle = parentNoD.childNodes[3].childNodes[3];   
    const taskDescription = parentNoD.childNodes[3].childNodes[5];
    const taskType = parentNoD.childNodes[3].childNodes[7].childNodes[1];  
    const submitButton = parentNoD.childNodes[5].childNodes[1];

    const updateData = {
        taskTitle: taskTitle.innerHTML,
        taskDescription: taskDescription.innerHTML,
        taskType: taskType.innerHTML
    };

    // we will copy our array which we made changes into an variable
    let stateCopy = state.taskList;
}