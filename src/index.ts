import { isElementNode, isTextNode, isCommentNode } from 'dom-node-type';

const DEPTH = '/';
const PART = '&';
const NODE = ',';

interface NodeInterface {
  nodeType: number;
}

interface ElementInterface extends NodeInterface {
  tagName: string;
  attributes: Record<string, string | number>;
}

interface TextInterface extends NodeInterface {
  nodeValue: string;
}

interface CommentInterface extends NodeInterface {
  nodeValue: string;
}

interface AttributeInterface {
  [key: string]: string | number;
}

function encodeData(data: string): string {
  return encodeURIComponent(data);
}

function decodeData(data: string): string {
  return decodeURIComponent(data);
}

function isEncodingAvailableNode(node: Node): boolean {
  return isElementNode(node) || isTextNode(node) || isCommentNode(node);
}

function extractDataFromElement(node: Element): ElementInterface {
  const { nodeType, tagName } = node;
  const attributes: AttributeInterface = {};

  for (let i = 0; i < node.attributes.length; i++) {
    const { name, value } = node.attributes[i];
    attributes[name] = value;
  }

  return {
    nodeType,
    tagName,
    attributes,
  };
}

function extractDataFromTextNode({ nodeType, nodeValue }: Text): TextInterface {
  return {
    nodeType,
    nodeValue,
  };
}

function extractDataFromComment({
  nodeType,
  nodeValue,
}: Comment): TextInterface {
  return {
    nodeType,
    nodeValue,
  };
}

function extractDataFromNode(
  node: Node,
):
  | NodeInterface
  | ElementInterface
  | CommentInterface
  | Record<string, string | number> {
  if (isElementNode(node)) {
    return extractDataFromElement(node as Element);
  }

  if (isTextNode(node)) {
    return extractDataFromTextNode(node as Text);
  }

  if (isCommentNode(node)) {
    return extractDataFromComment(node as Comment);
  }

  return {};
}

function createElementFromDecodedData(decodedData: ElementInterface): Element {
  const { attributes, tagName } = decodedData;
  const element = document.createElement(tagName);

  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value as string);
  }

  return element;
}

function createTextNodeFromDecodedData(decodedData: TextInterface): Text {
  const { nodeValue } = decodedData;
  const textNode = document.createTextNode(nodeValue);

  return textNode;
}

function createCommentFromDecodedData(decodedData: CommentInterface): Comment {
  const { nodeValue } = decodedData;
  const comment = document.createComment(nodeValue);

  return comment;
}

function createNodeFromDecodedData(
  decodedData: ElementInterface | TextInterface | CommentInterface,
): Node | null {
  const { nodeType } = decodedData;

  switch (nodeType) {
    case Node.ELEMENT_NODE:
      return createElementFromDecodedData(decodedData as ElementInterface);
    case Node.TEXT_NODE:
      return createTextNodeFromDecodedData(decodedData as TextInterface);
    case Node.COMMENT_NODE:
      return createCommentFromDecodedData(decodedData as CommentInterface);
    default:
      return null;
  }
}

function serialize(root: Node): string {
  const code = [];
  const queue = [
    {
      node: root,
      nth: 0,
      path: '0',
    },
  ];

  while (queue.length > 0) {
    const { node, nth, path } = queue.shift();
    const { childNodes } = node;

    if (!isEncodingAvailableNode(node)) {
      continue;
    }

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

function deserialize(code: string): Node {
  const map: { [key: string]: Node } = {};

  code.split(NODE).forEach((parts) => {
    const [depth, nth, encodedData] = parts.split(PART);
    const decodedData = JSON.parse(decodeData(encodedData));
    const node = createNodeFromDecodedData(decodedData);

    map[`${depth}/${nth}`] = node;

    const parent = map[depth];
    if (parent) parent.appendChild(node);
  });

  return map[`0${DEPTH}0`];
}

export { serialize, deserialize };
