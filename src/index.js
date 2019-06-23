import _ from 'lodash';

const { ELEMENT_NODE, TEXT_NODE, COMMENT_NODE } = Node;
const DEPTH = '/';
const PART = '&';
const NODE = ',';

const isNode = arg =>
  _.isObjectLike(arg) &&
  _.isPlainObject(arg) === false &&
  typeof arg.nodeType !== 'undefined';

const isElementNode = arg => isNode(arg) && arg.nodeType === ELEMENT_NODE;

const isTextNode = arg => isNode(arg) && arg.nodeType === TEXT_NODE;

const isCommentNode = arg => isNode(arg) && arg.nodeType === COMMENT_NODE;

const encodeData = str => encodeURIComponent(str);

const decodeData = str => decodeURIComponent(str);

const isEncodingAvailableNode = node =>
  isElementNode(node) || isTextNode(node) || isCommentNode(node);

const extractDataFromNode = node => {
  if (isElementNode(node)) {
    return extractDataFromElement(node);
  }

  if (isTextNode(node)) {
    return extractDataFromTextNode(node);
  }

  if (isCommentNode(node)) {
    return extractDataFromComment(node);
  }

  return {};
};

const extractDataFromElement = ({ nodeType, tagName, attributes }) => {
  const attribute = {};

  for (let { name, value } of attributes) {
    attribute[name] = value;
  }

  return {
    nodeType,
    tagName,
    attribute,
  };
};

const extractDataFromTextNode = ({ nodeType, nodeValue }) => ({
  nodeType,
  nodeValue,
});

const extractDataFromComment = ({ nodeType, nodeValue }) => ({
  nodeType,
  nodeValue,
});

const createNodeFromDecodedData = decodedData => {
  const { nodeType } = decodedData;

  switch (nodeType) {
    case Node.ELEMENT_NODE:
      return createElementFromDecodedData(decodedData);
    case Node.TEXT_NODE:
      return createTextNodeFromDecodedData(decodedData);
    case Node.COMMENT_NODE:
      return createCommentFromDecodedData(decodedData);
    default:
      return {};
  }
};

const createElementFromDecodedData = decodedData => {
  const { attribute, tagName } = decodedData;
  const element = document.createElement(tagName);

  for (let [name, value] of Object.entries(attribute)) {
    element.setAttribute(name, value);
  }

  return element;
};

const createTextNodeFromDecodedData = decodedData => {
  const { nodeValue } = decodedData;
  const textNode = document.createTextNode(nodeValue);

  return textNode;
};

const createCommentFromDecodedData = decodedData => {
  const { nodeValue } = decodedData;
  const comment = document.createComment(nodeValue);

  return comment;
};

export function serialize(root) {
  const code = [];
  const queue = [
    {
      node: root,
      nth: '0',
      path: '0',
    },
  ];

  while (queue.length > 0) {
    const { node, nth, path } = queue.shift();
    const { childNodes } = node;

    if (!isEncodingAvailableNode(node)) continue;
    code.push(
      `${path}${PART}${nth}${PART}${encodeData(
        JSON.stringify(extractDataFromNode(node)),
      )}`,
    );

    for (let i = 0; i < childNodes.length; i++) {
      queue.push({
        node: childNodes[i],
        nth: i,
        path: `${path}${DEPTH}${nth}`,
      });
    }
  }

  return code.join(NODE);
}

export function deserialize(code) {
  const map = {};

  code.split(NODE).forEach(parts => {
    const [depth, nth, encodedData] = parts.split(PART);
    const decodedData = JSON.parse(decodeData(encodedData));
    const node = createNodeFromDecodedData(decodedData);

    map[`${depth}/${nth}`] = node;

    const parent = map[depth];
    if (parent) parent.appendChild(node);
  });

  return map[`0${DEPTH}0`];
}
