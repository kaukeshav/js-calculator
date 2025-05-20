
(function () {
    const calculator = document.querySelector('#calc');
    const screen = document.querySelector('#screen');
    const output = document.querySelector('#calculator-output');

    const orderOfOperator = Object.freeze({
        '/': 4,
        '*': 3,
        '+': 1,
        '-': 1,
        '=': 0
    });

    let prevKeyIsOperator;
    let prevNumKeyPressed;

    function clearScreen(e) {
        screen.replaceChildren();
        prevNumKeyPressed = null;
        prevKeyIsOperator = null;
    }

    function calculate(num1, num2, operator) {
        if (operator === '/' && num1 === 0) {
            return 'ERORR';
        }
        if (operator === '/') {
            return num2 / num1;
        }
        if (operator === '*') {
            return num2 * num1;
        }
        if (operator === '+') {
            return num2 + num1;
        }
        if (operator === '-') {
            return num2 - num1;
        }
    }

    function tokenizeInput(inputArr) {
        if (
            (inputArr[0] === '-' || inputArr[0] === '+') &&
            !isNaN(inputArr[1])
        ) {
            return inputArr = [inputArr[0] + inputArr[1], ...inputArr.slice(2)];
        }
        return inputArr
    }

    function caclulator() {
        const stackOfOperators = []; // FIFO
        const stackOfNumbers = []; // FIFO

        const inputs = Array.from(
            screen.querySelectorAll('span[data-val]')
        ).map(span => span.dataset.val);


        if (inputs.length < 3) {
            return inputs.join('');
        }


        const user_input = tokenizeInput(
            inputs
        );

        user_input.push('=');

        for (let i = 0; i < user_input.length; i++) {
            const inp = user_input[i]; // first input 
            const isOperator = orderOfOperator.hasOwnProperty(inp);

            if (!isOperator) {
                stackOfNumbers.push(inp);
            } else {
                while (
                    stackOfOperators.length &&
                    orderOfOperator[inp] <=
                    orderOfOperator[
                    stackOfOperators[stackOfOperators.length - 1]
                    ]
                ) {
                    const num1 = Number(stackOfNumbers.pop());
                    const num2 = Number(stackOfNumbers.pop());
                    const operator = stackOfOperators.pop();
                    const result = calculate(num1, num2, operator);
                    stackOfNumbers.push(result);
                }
                stackOfOperators.push(inp);
            }
        }
        if (stackOfNumbers.length) {
            const res = stackOfNumbers.pop();
            output.value = res;

            return res;
        }
    }

    function displayKey(e, val) {
        let spanTag;
        if (prevNumKeyPressed) {
            prevNumKeyPressed += val;
            spanTag = screen.querySelector('span:last-child');
            spanTag.dataset.val = prevNumKeyPressed;
            spanTag.textContent = prevNumKeyPressed;
        } else {
            spanTag = document.createElement('span');
            spanTag.dataset.val = val;
            spanTag.textContent = val;
            screen.appendChild(spanTag);
        }
    }

    function deleteLast() {
        const last = screen.querySelector('span:last-child');
        last && screen.removeChild(last);
    }


    function handleNumKey(e, val) {
        output.value += val;
    }

    function onKeyDown(evt) {
        if (evt.target && !(evt.target instanceof HTMLButtonElement)) {
            return;
        }

        const keyVal = evt.target.dataset && evt.target.dataset.val;

        switch (keyVal) {
            case "AC":
                clearScreen(evt)
                break;
            case "DEL":
                deleteLast();
                break;
            case "=":
                const res = caclulator();
                clearScreen();
                displayKey(evt, res);
                break;
            case "%":
            case "/":
            case "*":
            case "-":
            case "+":
                if (prevKeyIsOperator)
                    deleteLast();
                prevKeyIsOperator = keyVal;
                prevNumKeyPressed = null;
                displayKey(evt, keyVal);
                break;
            default:
                prevKeyIsOperator = null;
                displayKey(evt, keyVal);
                prevNumKeyPressed = prevNumKeyPressed ? prevNumKeyPressed : keyVal;
                break;
        }
    }

    calculator.addEventListener('click', onKeyDown);
})();




