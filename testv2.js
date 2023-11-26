const mark = "21321";

function findClosingTagIndex(content, closingTag, startIndex) {
  let level = 0;
  const openingTag = closingTag.slice(0, -1) + '/';
  
  for (let i = startIndex; i < content.length; i++) {
    const currentBlock = content.slice(i, i + closingTag.length);
    if (currentBlock === closingTag && level === 0) {
      return i;
    } else if (content.slice(i, i + mark.length) === mark) {
      const nextCommand = content.indexOf('}', i + mark.length) + 1;
      if (nextCommand === 0) {
        break;
      }
      const nextClosing = content.indexOf(closingTag, i + mark.length);
      if (nextClosing !== -1 && nextClosing < nextCommand) {
        level--;
        i = nextClosing - 1;
      } else {
        level++;
        i = nextCommand - 1;
      }
    }
  }
  return -1;
}

function evaluateCondition(condition, context) {
  if (condition.includes('===')) {
    const parts = condition.split('===');
    const [left, right] = parts.map(part => context[part.trim()]);
    return left === right;
  } else {
    return context[condition.trim()];
  }
}

// Existing code remains the same

// Existing code remains the same

function templateParser(template, context) {
    const stack = [];
    const maxIterations = 10000; // Limit the number of iterations
    let output = '';
  
    stack.push({ template, context });
    let iterations = 0;
  
    while (stack.length > 0 && iterations < maxIterations) {
      iterations++;
  
      const { template, context } = stack.pop();
      let currentIndex = 0;
  
      let startVariable = template.indexOf(`${mark}{`, currentIndex);
      if (startVariable !== -1) {
        output += template.slice(currentIndex, startVariable);
      } else {
        output += template;
        continue;
      }
  
      const endVariable = template.indexOf('}', startVariable + mark.length + 1);
      const variable = template.slice(startVariable + mark.length + 1, endVariable);
  
      if (variable.startsWith('if')) {
        const condition = variable.slice(3).trim();
        const isConditionTrue = evaluateCondition(condition, context);
  
        let blockStartIndex = template.indexOf('{', endVariable);
        let blockEndIndex = findClosingTagIndex(template, '{/if}', endVariable);
  
        let blockContent = template.slice(blockStartIndex + 1, blockEndIndex).trim();
  
        if (isConditionTrue) {
          stack.push({ template: blockContent, context });
        }
  
        currentIndex = blockEndIndex + 5; // Update the current index after the if block
      } else if (variable.startsWith('for')) {
        const [iterator, arrayName] = variable.slice(4, -1).split(' in ');
        const array = context[arrayName];
  
        let blockStartIndex = template.indexOf('{', endVariable);
        let blockEndIndex = findClosingTagIndex(template, '{/for}', endVariable);
  
        let blockContent = template.slice(blockStartIndex + 1, blockEndIndex).trim();
  
        for (let i = array.length - 1; i >= 0; i--) {
          const newContext = { ...context, [iterator]: array[i] };
          stack.push({ template: blockContent, context: newContext });
        }
  
        currentIndex = blockEndIndex + 6; // Update the current index after the for block
      } else {
        output += context[variable.trim()];
        currentIndex = endVariable + 1;
      }
    }
  
    return output;
  }
  
  // Test cases
  // ... (Same as provided earlier)
  
  

// Test cases
const template = `<h1>${mark}{X}</h1>
${mark}{if Y }
  <h1>Y</h1>
  ${mark}{for a in arr}
    ${mark}{if a}
      <h1> arr True</h1>
    {else}
      <h1> arr False</h1>
    {/if}
  {/for}
{else}
  <h1>Not Y</h1>
{/if}`;

const context1 = {
  X: "HELLO",
  Y: true,
  arr: [true, false, true],
};

console.log(templateParser(template, context1));

const context2 = {
  X: "HELLO",
  Y: false,
  arr: [true, false, true],
};

console.log(templateParser(template, context2));
