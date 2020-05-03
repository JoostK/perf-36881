
export function dedupePathsMap(paths: string[]): string[] {
  const root: Node = { children: new Map(), path: undefined };
  for (const path of paths) {
    addPath(root, path);
  }
  const deduped: string[] = [];
  flattenTree(root, deduped);
  return deduped.sort().reverse();
}

/**
 * Add a path (defined by the `segments`) to the current `node` in the tree.
 */
function addPath(node: Node, path: string): void {
  const segments = path.split('/');
  for (let i = 0, len = segments.length; i < len; i++) {
    if (node.path !== undefined) {
      // We hit a leaf so don't bother processing any more of the path
      return;
    }
    // This is not the end of the path continue to process the rest of this path.
    const next = segments[i];

    if (!node.children.has(next)) {
      node.children.set(next, { children: new Map(), path: undefined });
    }
    node = node.children.get(next)!;
  }
  // This path has finished so convert this node to a leaf
  convertToLeaf(node, path);
}

/**
 * Flatten the tree of nodes back into an array of absolute paths
 */
function flattenTree(root: Node, paths: string[]): void {
  const nodes: Node[] = [root];
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    if (isLeaf(node)) {
      // We found a leaf so store the currentPath
      paths.push(node.path);
    } else {
      for (const child of node.children.values()) {
        nodes.push(child);
      }
    }
  }
}

function isLeaf(node: Node): node is Leaf {
  return node.path !== undefined;
}

function convertToLeaf(node: Node, path: string) {
  node.path = path;
}

interface Node {
  children: Map<string, Node>;
  path?: string;
}

type Leaf = Required<Node>;
