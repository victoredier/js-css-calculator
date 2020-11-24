let previousNumber  = '';
let currentNumber   = '0';
let currentOperator = '';
let limitSegment    = 0;
let lastOption      = '';
let blockByBlink    = false;
function clearDisplay() {
  const numberDoms = document.getElementsByClassName('number');
  for (let index = 0; index < numberDoms.length; index++) {
    const numDom = numberDoms[index];
    numDom.classList.remove('neg','dot','num0','num1','num2','num3','num4','num5','num6','num7','num8','num9');
  }
}
function clearNumber() {
  setNumber(0);
  currentOperator = '';
  previousNumber = '';
}
function setNumber(integer, decimal=0) {
  let stringNumber = integer.toString(10);
  currentNumber = stringNumber;
  showNumber(stringNumber);
}
function clickNumber(number) {
  if (currentNumber == '0') {
    currentNumber = '';
  }
  if ((currentNumber.replace('.', '').length + number.length) > limitSegment) {
    return;
  }
  currentNumber = currentNumber + '' + number;
  setNumber(currentNumber);
}
function clickDot() {
  if (currentNumber.search(/\./) == -1) {
    currentNumber = currentNumber + '.';
    setNumber(currentNumber);
  }
}
function getLimit() {
  return document.getElementsByClassName('number').length;
}
function fitNumberToShow(stringNumber) {
  stringNumber = stringNumber.trim();
  let parts   = stringNumber.split('.');
  let integer = parts[0];
  let decimal = parts[1] == undefined ? '' : parts[1];
  if (integer.length > limitSegment) {
    console.log('Error max value');
    return '0';
  }
  let allString = integer + '' + decimal;
  if (allString.length > limitSegment) {
    let excess = allString.length - limitSegment;
    if (excess < decimal.length) {
      decimal = decimal.slice(0, -excess);
      return integer + '.' + decimal;
    }
    else{
      return integer;
    }
  }
  return stringNumber;
}
function getReverseString(stringNumber) {
  return stringNumber.split('').reverse().join('');
}
function getDotPosition(stringNumber) {
  let parts = stringNumber.split('.');
  let position = parts[1] == undefined ? -1 : parts[0].length;
  return position;
}
function showNumber(stringNumber) {
  clearDisplay();
  stringNumber = fitNumberToShow(stringNumber);
  stringNumber = getReverseString(stringNumber);
  let dotPosition = getDotPosition(stringNumber);
  stringNumber = stringNumber.replace('.', '');
  stringNumber = stringNumber.padEnd(limitSegment, ' ');
  let allChars = stringNumber.split('');
  for (let index = 0; index < allChars.length; index++) {
    const char = allChars[index];
    if (char != ' '){
      const numDom = document.getElementById('number'+index);
      if (char == '-') {
        numDom.classList.add('neg');
      }
      else if (/[0-9]/.test(char)){
        numDom.classList.add('num'+char); 
      }
      if (index == dotPosition) {
        numDom.classList.add('dot');
      }
    }
  }
}
function initCalc()
{
  limitSegment = getLimit();
  setNumber(0);
  let buttons = document.getElementsByClassName('button');
  for (let index = 0; index < buttons.length; index++) {
    const button = buttons[index];
    button.addEventListener("click", () => {
      let option = button.dataset.opt;
      eventOption(option);
      button.classList.add('buttonPressed');
      setTimeout(()=>{
        button.classList.remove('buttonPressed');
      }, 200);
    });
  }
}
function eventOption(option) {
  if (blockByBlink) {
    return;
  }
  const operators = ['x', '+', '-', '/'];
  if (lastOption == option && operators.includes(option)) {
    // double click on an operation, ignore this event
    return;
  }
  if (['C', 'N'].includes(option)) {
    clearNumber();
  }
  if (option == '.') {
    clickDot();
  }
  if (/[0-9]/.test(option)){
    clickNumber(option);
  }
  if (operators.includes(option) || option == '=') {
    if (currentOperator != '' && previousNumber != '' && currentNumber != '') {
      let number1 = parseFloat(previousNumber);
      let number2 = parseFloat(currentNumber);
      let result  = 0;
      switch (currentOperator) {
        case '+': result = number1 + number2; break;
        case '-': result = number1 - number2; break;
        case 'x': result = number1 * number2; break;
        case '/': result = number1 / number2; break;
        case '=': result = number1; break;
      }
      previousNumber = result.toString(10);
      showNumber(previousNumber);
    }
    else{
      previousNumber = currentNumber;
    }
    currentNumber = '0';
    if (operators.includes(option)) {
      currentOperator = option;
    }
  }
  lastOption = option;
  blink();
}
function blink() {
  blockByBlink = true;
  let display = document.getElementById('display');
  display.classList.add('forceOff');
  setTimeout(()=>{
    display.classList.remove('forceOff');
    blockByBlink = false;
  }, 200);
}
setTimeout(initCalc, 200);
