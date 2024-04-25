/*Utility Classes*/

const clone = (jsonObject) => { return JSON.parse(JSON.stringify(jsonObject)); };
const swapClasses = (target, c1, c2) => { target.classList.remove(c1); target.classList.add(c2); };

function siblingIndex(child) {
  const parent = child.parentNode;
  return Array.prototype.indexOf.call(parent.children, child);
}

function newElement(tag, classes) {
  const newElem = document.createElement(tag);
  newElem.className = classes;
  return newElem;
}

function shiftElementOrder(element, direction) {
  //direction can be 'next' or 'previous'
  const adjacentSibling = element[`${direction}ElementSibling`];
  if(adjacentSibling === null || adjacentSibling === undefined) { return; }
  (direction === "next") ?
    adjacentSibling.insertAdjacentElement("afterend", element) :
    adjacentSibling.insertAdjacentElement("beforebegin", element) ;
}


/* DOM Elements*/
const addSliderButton = document.getElementById("add-slider-button");
const sliderBox = document.getElementById("slider-box");
const sliderTemplate = document.getElementById("slider-template");

/* Constants*/

const mathOperations = {
  add: { name: "add", symbol: "+", calc: (n1, n2) => {return n1 + n2; } },
  sub: { name: "sub", symbol: "-", calc: (n1, n2) => {return n1 - n2; } },
  mul: { name: "mul", symbol: "x", calc: (n1, n2) => {return n1 * n2; } },
  div: { name: "div", symbol: "÷", calc: (n1, n2) => {return n1 / n2; } },
};


// Append a new slider
function addNewSlider(insertionIndex=null) {

  // Instantiate new slider instance in DOM
  const newSliderFromTemplate = sliderTemplate.cloneNode(true).content;
  const newSlider = newElement("div", "slider-instance");
  newSlider.append(newSliderFromTemplate);

  // Append to end of list by default (results in -1 if empty)
  if (insertionIndex === null) { insertionIndex = sliderBox.childElementCount - 1; }

  // Adds new slider with append if list is empty; else inserts at specific sibling index
  if (insertionIndex < 0) {
    sliderBox.append(newSlider);
  } else {
    sliderBox.children[insertionIndex].insertAdjacentElement("afterend", newSlider);
  }

  const sliderSlider = newSlider.querySelector(".slider-slider");
  const sliderDisplay = newSlider.querySelector(".display-default");

  const defaultInputs = [
    { name: "name",    value: "...",  type: String, attribute: "" },
    { name: "lower",   value: 0,      type: Number, attribute: "min" },
    { name: "default", value: 50,     type: Number, attribute: "value" },
    { name: "upper",   value: 100,    type: Number, attribute: "max" },
    { name: "step",    value: 1,      type: Number, attribute: "step" }
  ]

  // Initialize behavior for each text input box
  defaultInputs.forEach(inputParams => {
    const inputBox = newSlider.querySelector(`.value-${inputParams.name}`);
    const displayBox = newSlider.querySelector(`.display-${inputParams.name}`);


    inputBox.value = inputParams.value;
    sliderSlider[inputParams.attribute] = inputParams.value;

    displayBox.textContent = inputParams.value;

    // Update slider on change of text input box
    inputBox.addEventListener("input", () => {
      const newValue = (inputParams.type === Number) ?
        parseFloat(inputBox.value) :
        inputBox.value ;

      // Only update if newValue is a valid number or of type String
      if (newValue || inputParams.type === String) {
        sliderSlider[inputParams.attribute] = newValue;
        displayBox.textContent = newValue;
      }
    });

  });

  sliderDisplay.textContent = sliderSlider.value;

  // Update display value when slider is slid
  sliderSlider.addEventListener("input", () => {
    sliderDisplay.textContent = sliderSlider.value;
    updateCalculation();
  });


  // Define button events //

  const sliderAdd = newSlider.querySelector(".slider-button-add");
  const sliderDelete = newSlider.querySelector(".slider-button-delete");
  const sliderShiftPrev = newSlider.querySelector(".slider-button-prev");
  const sliderShiftNext = newSlider.querySelector(".slider-button-next");

  sliderAdd.addEventListener("mouseup", () => { addNewSlider(siblingIndex(newSlider)); });
  sliderDelete.addEventListener("mouseup", () => { newSlider.remove(); });
  sliderShiftPrev.addEventListener("mouseup", () => { shiftElementOrder(newSlider, "previous"); });
  sliderShiftNext.addEventListener("mouseup", () => { shiftElementOrder(newSlider, "next"); });

  // Intantiate Math Operations List //

  const sliderOperations = newSlider.querySelector(".slider-operations");
  Object.keys(mathOperations).forEach(key => {
    const newOption = newElement("option", "math-operation");
    sliderOperations.append(newOption);

    const operation = mathOperations[key];
    newOption.value = operation.name;
    newOption.textContent = operation.symbol;
  });

  updateCalculation();

}

addSliderButton.addEventListener("click", () => {
  addNewSlider();
});

function updateCalculation() {
  const sliderList = document.querySelectorAll(".slider-instance");

  let number;

  for (let i = 0; i < sliderList.length; i++) {
    const sliderInstance = sliderList[i];

    const sliderValue = parseFloat(sliderInstance.querySelector(".slider-slider").value);
    const operation = sliderInstance.querySelector(".slider-operations").value;

    if (i === 0) {
      number = sliderValue;
    } else {
      number = mathOperations[operation].calc(number, sliderValue);
    }
  }

  const calculationResultDisplay = document.getElementById("calculation-result");
  calculationResultDisplay.textContent = number;
}
