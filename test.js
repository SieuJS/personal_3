const mark = "21321";
const template = `<h1>${mark}{X}</h1>
${mark}{if Y }
  <h1>Y</h1>
  ${mark}{for a in arr}
    ${mark}{for b in a.list.board}
      <h1>${mark}{b}</h1>
    {/for} 
  {/for}
{else}
  <h1>Not Y</h1>
{/if}`;

const context = {
  X: "HELLO",
  Y: false,
  arr: [
     {c:1,list : {board :[1,2,3,4,5]}} ,
     {list : {board :[1,2,3,4,7,9]}}
  ],
};

const parseTemplate = (content, context) => {
  // extract the command
  let result = "";
  content = content.trim();
  let commandPos = content.indexOf(mark);
  if (commandPos === -1) return content.trim();
  // process the command ;
  result += content.slice(0, commandPos);

  let nextContent = content.slice(commandPos);

  // get the statement

  let commandState = nextContent.substring(
    mark.length + 1,
    nextContent.indexOf("}")
  );
  let contentCmd = nextContent.substring(nextContent.indexOf("}") + 1);
  let gap = commandState.indexOf(" ");
  let typeCmd = commandState.substring(0, gap);
  let stateCmd = commandState.substring(gap);

  switch (typeCmd) {
    case "if":
      result += ifHandler(stateCmd, contentCmd, context);
      break;
    case "for":
      result += forHandler(stateCmd, contentCmd, context);
      break;
    case "+":
      break;
    default:
      if (context[stateCmd]) {
        result += context[stateCmd];
        result += parseTemplate(contentCmd,context)
      } else {
        throw new Error(`Not define ${stateCmd}`);
      }
      break;
  }
  // console.log(result);
  // nextContent = nextContent.substring(nextContent.indexOf("}") + 1);
  return result;
};

const evaluateIfCondition = (components, context) => {
  // search in context ;
  if (components.length === 1) {
    // check is defined or not
    if(context[components[0]])
      return true;
    return false;
    
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

function ifHandler(stateCmd, content, context) {
  let result = "";
  // start to push if yes command

  content = content.trim();
  let closeTag = findClosingTag(content, "if");
  let processBlock = content.slice(0, closeTag-1);

  let elsePos = findElsePos(processBlock);
  let beforeElseBlock = processBlock.slice(0,elsePos);
  let afterElseBlock = processBlock.slice(elsePos+"{else}".length)

  let nextBlock = content.slice(closeTag + `{/if}`.length);
  

  if(evaluateIfCondition(stateCmd.trim().split(' '), context)){
    result += parseTemplate(beforeElseBlock,context);
  }
  else {
    
    result += parseTemplate(afterElseBlock,context);
  }

  result += parseTemplate(nextBlock, context);
  // find the closest closing tag

  
  return result;

  //check if done or not
}

function findElsePos(content) {

  // this content had been cut to 1 block if 
  let curPos = 0;
  let el = '{else}';
  let cmd = `${mark}{if`;
  let beforeElse, afterElse;
  let x = 0
  const tagLength = '{else}'.length;
  elseTag = content.indexOf(`{else}`, curPos);
  if(elseTag === -1) return -1
  do {
    beforeElse = content.slice(curPos, elseTag);
    
    afterElse = content.slice(elseTag + tagLength )
    

    // if beforeElse have any if command, find next else

    if(beforeElse.indexOf(`${mark}{if`) === -1)
    {
      // not find that's mean else we found is true
      return elseTag;
    }
    curPos = content.indexOf(cmd, curPos  + cmd.length);

    curPos = content.indexOf("}",curPos) + 1;
    elseTag = content.indexOf(el , elseTag + el.length);
  } while (
    curPos < content.length
  );
  return -1;
}

function findClosingTag(content, tag) {
  content = content.trim();
  let beforeClose, afterClose;
  let curPos = 0;
  let openTag = 0;
  let x = 0;
  let closeTag = content.indexOf(`{/${tag}}`) + `/{${tag}}`.length;
  if (closeTag === -1) throw new Error("No closing tag");
  do {
    // get before
    beforeClose = content.slice(curPos, closeTag - 1);

    // get after
    afterClose = content.slice(closeTag);

    openTag = beforeClose.indexOf(`${mark}{${tag}`);

    // if not exist open tag in before, that mean the close tag we found is belong to open tag at the start
    if (openTag === -1) break;

    // if exist open tag in before, set curPos to after that tag
    curPos = openTag + `${mark}{${tag}`.length;

    curPos = content.indexOf("}", curPos) + 1;

    if (content.indexOf(`{/${tag}}`, closeTag) === -1) {
      throw new Error("Missing close tag");
    }
    closeTag = content.indexOf(`{/${tag}}`, closeTag) + `/{${tag}}`.length + 1;
  } while (closeTag < content.length);
  return closeTag - `{/${tag}}`.length;
}

function forHandler (stateCmd, content, context ){

  let result = "";
  content = content.trim();
  let closeTag = findClosingTag(content,"for");
  
  let processBlock = content.slice(0,closeTag-1).trim();
  
  let stateComponents = stateCmd.trim().split(" ");
  
  let [itor, word, itObj ] = stateComponents;
  
  
  itObj = itObj.split('.');
  
  let myObj

  if(itObj.length === 1)
  {
  myObj = context[itObj[0]];
  }
  else{
  myObj = context[itObj[0]];
  
  while(itObj.length > 1)
  {  
    myObj = myObj[itObj[1]]
    itObj.shift()
  }
    
  }
  if(!myObj) 
  {
    throw new Error(`itor ${myObj} not defined`)
  }
  for( let i in myObj) {
      let myContext = context;
      myContext[itor] = myObj[i];
      result += parseTemplate(processBlock,myContext);
  }
  return result;
}

function getHandler(stateCmd, contentCmd, context) {
  console.log(stateCmd)
}


function getOpenTag(content) {}

const afterP = parseTemplate(template, context);
console.log(afterP)