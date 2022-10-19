// source: https://github.com/chidiwilliams/expression-evaluator

function MATHtokenize(input) {
    let scanner = 0;
    const tokens = [];
  
    while (scanner < input.length) {
      const char = input[scanner];
  
      if (/[0-9]/.test(char)) {
        let digits = '';
  
        while (scanner < input.length && /[0-9\.]/.test(input[scanner])) {
          digits += input[scanner++];
        }
  
        const number = parseFloat(digits);
        tokens.push(number);
        continue;
      }
      if (/[a-zA-Z%]/.test(char)) {
        let chars = '';

        while(scanner < input.length && /[a-zA-z%]/.test(input[scanner])) {
            chars += input[scanner++]
        }

        tokens.push(chars)
        continue;
      }
  
      if (/[+\-/*()^<>]/.test(char)) {
        tokens.push(char);
        scanner++;
        continue;
      }
  
      if (char === ' ') {
        scanner++;
        continue;
      }
  
        throw new Error(`Invalid token ${char} at position ${scanner}`);
    }
  
    return tokens;
  }
  
  function toRPN(tokens) {
    const operators = [];
    const out = [];
  
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
  
      if (/[+\-/*<>=^]/.test(token)) {
        while (shouldUnwindOperatorStack(operators, token)) {
          out.push(operators.pop());
        }
        operators.push(token);
        continue;
      }
  
      if (token === '(') {
        operators.push(token);
        continue;
      }
  
      if (token === ')') {
        while (operators.length > 0 && operators[operators.length - 1] !== '(') {
          out.push(operators.pop());
        }
        operators.pop();
        continue;
      }
  
      if (typeof token == 'number' || typeof token === "string") {
        out.push(token);
        continue;
      }

      throw new Error(`Unparsed token ${token} at position ${i}`);
    }
  
    for (let i = operators.length - 1; i >= 0; i--) {
      out.push(operators[i]);
    }
  
    return out;
  }
  
  
  function shouldUnwindOperatorStack(operators, nextToken) {
    if (operators.length === 0) {
      return false;
    }
  
    const lastOperator = operators[operators.length - 1];
    return precedence[lastOperator] >= precedence[nextToken];
  }

  
  function math2RPN(input) {
    return toRPN(MATHtokenize(input));
  }
  
console.log(math2RPN("%abc + 2 + (4*3)"))