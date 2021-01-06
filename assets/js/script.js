var tasks = [];
var localStorageName = "simple-day-scheduler-items";
var startTime = 9;
var endTime = 17;

var createTask = function(taskTime, taskText) {
  // create elements that make up a task item
  var taskDivRowEl = $("<div>")
  .addClass("row");

  var taskTimeEl = $("<div>")
  .addClass("time-block col-2 col-lg-1")
  .text(taskTime);

  var taskTextEl = $("<p>")
  .addClass("description col-8 col-lg-10")
  .text(taskText);

  var taskSaveBtnEl = $("<button>")
  .addClass("saveBtn col-2  col-lg-1")
  .attr('type', 'button');

  var taskSaveBtnIconEl = $("<span>")
  .addClass("oi oi-task mr-2");

  taskSaveBtnEl.append(taskSaveBtnIconEl);
  // append span and p element to parent li
  taskDivRowEl.append(taskTimeEl, taskTextEl, taskSaveBtnEl);

  // append to ul list on the page
  $("#schedule").append(taskDivRowEl);
};

var loadTasks = function() {
    tasks = JSON.parse(localStorage.getItem(localStorageName));
  
    // if nothing in localStorage, create a new object to track all task status arrays
    if (!tasks) {
      initializeTask();
    }
  else{
    for(const property in tasks){
      createTask(property, tasks[property]);
    }
  }
};
  
var saveTasks = function() {
  localStorage.setItem(localStorageName, JSON.stringify(tasks));
};
  
var auditTask = function(taskEl) {
  // get date from task element
  var taskTime = $(taskEl)
  .find(".time-block")
  .text()
  .trim();

  var taskTimeNum = parseInt(taskTime.replace( /^\D+/g, ''));

  if(taskTimeNum < 12 && taskTime.includes("pm")){
    taskTimeNum += 12;
  }

  // convert to moment object at 5:00pm, L for local time
  var currentHour = parseInt(moment().format("k"));

  $(taskEl).removeClass("past present future");

  if(taskTimeNum < currentHour){
    $(taskEl).find(".description").addClass("past");
  }
  else if(taskTimeNum > currentHour){
    $(taskEl).find(".description").addClass("future");
  }
  else{
    $(taskEl).find(".description").addClass("present");
  }

};

var initializeTask = function() {
  tasks = {};

  for(var i = startTime; i <= endTime; i++){
    var taskTime = (i<=12?i:i-12) + (i<12?"am":"pm");
    tasks[taskTime] = "";
    createTask(taskTime, "");
  }

  saveTasks();

  var time = moment().format('kk');
}

var displayCurrentDate = function() {
  $("#currentDay").text(moment().format('dddd, MMMM Do YYYY, h:mm a'));
}

$("#schedule").on("click", "p", function() {
  // console.log("<p> was clicked");
  var text = $(this)
  .text()
  .trim();
  var textInput = $("<textarea>")
  .addClass("description col")
  .val(text);
  $(this).replaceWith(textInput);
  textInput.trigger("focus");
  // console.log(text);
});

$("#schedule").on("blur", "textarea", function(){
  // get the textarea's current value/text
  var text = $(this)
    .val()
    .trim();

  // recreate p element
  var taskP = $("<p>")
  .addClass("description col")
  .text(text);

  // replace textarea with p element
  $(this).replaceWith(taskP);

  auditALlTasks();
});

$(document).ready(function(){
  $(".saveBtn").click(function() {

    var taskTime = $(this).siblings().closest(".time-block").text();
    var taskText = $(this).siblings().closest(".description").text();

    tasks[taskTime] = taskText;
    saveTasks();
  });
});

var auditALlTasks = function() {
  $(".row").each(function(index, el) {
    // console.log("el: " + el);
    auditTask(el);
  });
}

setInterval(function () {
  auditALlTasks();
},  (1000 * 60) * 1);

// localStorage.removeItem(localStorageName);
displayCurrentDate();
loadTasks();
auditALlTasks();

