import { defineComarkPlugin } from 'comark';
import type { ElementNode, Node } from 'comark';
import { visit } from 'comark/utils';

function isWhitespaceText(node: Node): boolean {
  return typeof node === 'string' && node.trim() === '';
}

function isElement(node: Node): node is ElementNode {
  return Array.isArray(node) && typeof node[0] === 'string';
}

function getMeaningfulChildren(node: ElementNode): Node[] {
  const children: Node[] = [];
  for (let i = 2; i < node.length; i++) {
    const child = node[i] as Node;
    if (!isWhitespaceText(child)) {
      children.push(child);
    }
  }
  return children;
}

function isImageOnlyParagraph(node: Node): node is ElementNode {
  if (!isElement(node) || node[0] !== 'p') {
    return false;
  }

  const children = getMeaningfulChildren(node);
  const only = children[0];
  if (children.length !== 1 || only === undefined || !isElement(only)) {
    return false;
  }
  // <p><img></p>
  if (only[0] === 'img') {
    return true;
  }

  // <p><a><img></a></p>
  return (
    only[0] === 'a' &&
    getMeaningfulChildren(only).some((child) => isElement(child) && child[0] === 'img')
  );
}

/**
 * CommonMark wraps standalone images in <p>. ProseImg renders <figure>,
 * so leave them wrapped and the DOM becomes invalid `p > figure`.
 * Lift image-only paragraphs to top-level img (or a>img) nodes.
 */
export default defineComarkPlugin(() => ({
  name: 'unwrap-images',
  post(state) {
    visit(
      state.tree,
      (node) => isElement(node) && node[0] === 'p',
      (node) => {
        if (!isImageOnlyParagraph(node)) {
          return;
        }
        return getMeaningfulChildren(node)[0];
      },
    );
  },
}));
