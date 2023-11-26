const mark = "21321";
const template = `
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
  e{/if}
  HHH
`;

const context = {
  X: "HELLO",
  Y: true,
  arr: [true, false, true],
};

const parseTemplate = (content, context) => {
  // extract the command
  let result = "";
  let commandPos = content.indexOf(mark)
    if (commandPos !== -1)
  {
    // process the command ;
    result += content.slice(0,commandPos);
    
    let nextContent = content.slice(commandPos);

    // get the statement

    let commandState = nextContent.substring(mark.length + 1, nextContent.indexOf("}")) ;
    let contentCmd = nextContent.substring(nextContent.indexOf('}') + 1)
    let gap = commandState.indexOf(' ')
    let typeCmd = commandState.substring(0, gap);
    let stateCmd = commandState.substring(gap)

    switch (typeCmd) {
        case "if" :
            ifHandler(stateCmd, contentCmd, context);
            break;
        case "for" :
            break;
        case "+" :
            break;
        default :
            if(context[stateCmd]){
                result += context[stateCmd]
            }
            else {
                throw new Error(`Not define ${stateCmd}`)
            }
            break;
    }
    console.log(result)
    nextContent = nextContent.substring(nextContent.indexOf("}") + 1)
    return result;
    
  }
};

const evaluateIfCondition = (components, context) => {
  // search in context ;
  if (components.length === 1) {
    // check is defined or not
    return context[components[0]] ? true : false;
  } else {
    //if component > 1 => it must have an operator
    let operator = components[1];
    switch (operator) {
      case "===":
        return context[components[0]] === context[components[2]];
        break;
      case ">":
        return context[components[0]] > context[components[2]];
        break;
      case "<":
        return context[components[0]] < context[components[2]];
        break;
      case ">=":
        return context[components[0]] >= context[components[2]];
        break;
      case "<=":
        return context[components[0]] >= context[components[2]];
        break;
    }
  }
};



function ifHandler(stateCmd, content , context ) {
  let result = "";
  // start to push if yes command

  let yesCmd = [];
  let noCmd = [];
  let closeTag = findClosingTag(content, "if");


  // find the closest closing tag 

  
  
  
  //check if done or not 
}

function findElsePos (content) {
  let curPos = 0 ;
  let elseTag ;
  let beforeElse, afterElse;

  do{
    elseTag = content.indexOf(`{else}`, curPos) ;
    beforeElse = content.slice(curPos, elseTag)
    curPos = elseTag ;
    afterElse = content.slice(curPos + `{else}`.length);
    elseTag = afterElse.indexOf(`{else}`, curPos)
  }
  while(beforeElse.indexOf(`${mark}{if`) !== -1 && curPos < content.length && elseTag !== -1);

}

function findClosingTag (content, tag) {
  content = content.trim();
  let beforeClose, afterClose ;
  let curPos = 0;
  let openTag = 0;
  let x = 0;
  let closeTag = content.indexOf(`{/${tag}}`) + `/{${tag}}`.length;
  if(closeTag === -1) throw new Error('No closing tag') 
  do {
    // get before
    console.log("new loop")
    beforeClose = content.slice(curPos, closeTag - 1);

    // get after
    afterClose = content.slice(closeTag )

    openTag = beforeClose.indexOf(`${mark}{${tag}`)

    // if not exist open tag in before, that mean the close tag we found is belong to open tag at the start
    if(openTag === -1) break 
    
    // if exist open tag in before, set curPos to after that tag
    curPos = openTag + `${mark}{${tag}`.length;

    curPos = content.indexOf('}', curPos) + 1

    if (content.indexOf(`{/${tag}}`, closeTag) === -1) 
    {
      throw new Error('Missing close tag')
    }
    closeTag = content.indexOf(`{/${tag}}`, closeTag) + `/{${tag}}`.length +1; 
  }
  while(closeTag < content.length) 
  return closeTag
}


function pushChildProcess(content, context) {
    content.indexOf()
}

function getOpenTag (content) {
    
}

parseTemplate(template, context);
