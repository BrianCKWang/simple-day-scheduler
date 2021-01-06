var tasks = [];
var localStorageName = "simple-day-scheduler-items";
var startTime = 9;
var endTime = 17;

var createTask = function(taskTime, taskText) {
  // create elements that make up a task item
  var taskDivRowEl = $("<div>")
  .addClass("row");

  var taskTimeEl = $("<div>")
  .addClass("time-block col-1")
  .text(taskTime);

  var taskTextEl = $("<p>")
  .addClass("description col")
  .text(taskText);

  var taskSaveBtnEl = $("<button>")
  .addClass("saveBtn col-1")
  .attr('type', 'button');

  var taskSaveBtnIconEl = $("<span>")
  .addClass("oi oi-task mr-2");

  taskSaveBtnEl.append(taskSaveBtnIconEl);
  // append span and p element to parent li
  taskDivRowEl.append(taskTimeEl, taskTextEl, taskSaveBtnEl);

  // check due date
  auditTask(taskDivRowEl);

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
  var date = $(taskEl)
  .find("span")
  .text()
  .trim();

  // convert to moment object at 5:00pm, L for local time
  var time = moment(date, "L").set("hour", 17);
  
  // remove any old classes from element
  $(taskEl).removeClass("list-group-item-warning list-group-item-danger");

  // apply new class if task is near/over due date
  if (moment().isAfter(time)) {
    $(taskEl).addClass("list-group-item-danger");
  } 
  else if (Math.abs(moment().diff(time, "days")) <= 2) {
    $(taskEl).addClass("list-group-item-warning");
  }

  // console.log(taskEl);
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
  $("#currentDay").text(moment().format('dddd, MMMM Do YYYY'));
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
});

$(document).ready(function(){
  $(".saveBtn").click(function() {

    var taskTime = $(this).siblings().closest(".time-block").text();
    var taskText = $(this).siblings().closest(".description").text();

    tasks[taskTime] = taskText;
    saveTasks();
  });
});

// localStorage.removeItem(localStorageName);
loadTasks();
displayCurrentDate();
