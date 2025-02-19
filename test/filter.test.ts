/* global describe, it, beforeEach */

import type { Tree } from '../src/types'
import { expect } from 'chai'
import { filter } from '../src/index'
import 'mocha'

describe('[filter]', () => {
  const tree: Tree<'children'> = {
    key: 1,
    children: [
      {
        key: 11,
        children: [
          {
            key: 111,
          },
        ],
      },
      {
        key: 12,
        children: [
          {
            key: 112,
            children: [
              {
                key: 1111,
              },
            ],
          },
        ],
      },
    ],
  }

  const treeSubItems: Tree<'subItems'> = {
    key: 1,
    subItems: [
      {
        key: 11,
        subItems: [
          {
            key: 111,
          },
        ],
      },
      {
        key: 12,
        subItems: [
          {
            key: 112,
            subItems: [
              {
                key: 1111,
              },
            ],
          },
        ],
      },
    ],
  }

  const treeMultiChildrenKey: Tree = {
    key: 1,
    children: [
      {
        key: 11,
        subItems: [
          {
            key: 111,
          },
        ],
      },
      {
        key: 12,
        subItems: [
          {
            key: 112,
            subItems: [
              {
                key: 1111,
              },
            ],
          },
        ],
      },
    ],
  }

  it('by default strategy (pre)', () => {
    const res: any[] = []
    const newTree: Tree<'children'> | undefined = filter(tree, (t) => {
      res.push(t.key)
      return t.key <= 100
    })
    expect(newTree?.key).to.be.equal(1)
    expect(newTree?.children?.[0]?.key).to.be.equal(11)
    expect(newTree?.children?.[0]?.children?.[0]?.key).to.be.equal(undefined)
    expect(res.length).to.be.equal(5)
    expect(res[0]).to.be.equal(1)
    expect(res[1]).to.be.equal(11)
    expect(res[2]).to.be.equal(111)
    expect(res[3]).to.be.equal(12)
  })
  it('by post strategy ', () => {
    const res: any[] = []
    const newTree: Tree<'children'> | undefined = filter(tree, (t) => {
      res.push(t.key)
      return t.key <= 100
    }, { strategy: 'post' })
    expect(newTree?.key).to.be.equal(1)
    expect(newTree?.children?.[0]?.key).to.be.equal(11)
    expect(newTree?.children?.[0]?.children?.[0]?.key).to.be.equal(undefined)
    expect(res.length).to.be.equal(6)
    expect(res[0]).to.be.equal(111)
    expect(res[1]).to.be.equal(11)
    expect(res[2]).to.be.equal(1111)
    expect(res[3]).to.be.equal(112)
  })
  it('by breadth strategy ', () => {
    const res: any[] = []
    const newTree: Tree<'children'> | undefined = filter(tree, (t) => {
      res.push(t.key)
      return t.key <= 100
    }, { strategy: 'breadth' })
    expect(newTree?.key).to.be.equal(1)
    expect(newTree?.children?.[0]?.key).to.be.equal(11)
    expect(newTree?.children?.[0]?.children?.[0]?.key).to.be.equal(undefined)
    expect(res.length).to.be.equal(5)
    expect(res[0]).to.be.equal(1)
    expect(res[1]).to.be.equal(11)
    expect(res[2]).to.be.equal(12)
    expect(res[3]).to.be.equal(111)
  })
  it('by tree childrenKey is "subItems"', () => {
    const res: any[] = []
    const newTree: Tree<'subItems'> | undefined = filter(treeSubItems, (t) => {
      res.push(t.key)
      return t.key <= 100
    }, { childrenKey: 'subItems' })
    expect(newTree?.key).to.be.equal(1)
    expect(newTree?.subItems?.[0]?.key).to.be.equal(11)
    expect(newTree?.subItems?.[0]?.subItems?.[0]?.key).to.be.equal(undefined)
    expect(res.length).to.be.equal(5)
    expect(res[0]).to.be.equal(1)
    expect(res[1]).to.be.equal(11)
    expect(res[2]).to.be.equal(111)
    expect(res[3]).to.be.equal(12)
  })
  it('by tree childrenKey is wrong', () => {
    const res: any[] = []
    const newTree: Tree | undefined = filter(tree, (t) => {
      res.push(t.key)
      return t.key === 1 || t.key === 11
    }, { childrenKey: 'babies' })
    expect(newTree?.key).to.be.equal(1)
    expect(newTree?.children?.[0]?.key).to.be.equal(11)
    expect(newTree?.children?.[0]?.children?.[0]?.key).to.be.equal(111)
    expect(res.length).to.be.equal(1)
    expect(res[0]).to.be.equal(1)
  })
  it('for forest by default strategy (pre)', () => {
    const res: any[] = []
    const newForest: Tree<'children'>[] | [] = filter([tree], (t) => {
      res.push(t.key)
      return t.key <= 100
    })
    expect(newForest[0]?.key).to.be.equal(1)
    expect(newForest[0]?.children?.[0]?.key).to.be.equal(11)
    expect(newForest[0]?.children?.[0]?.children?.[0]?.key).to.be.equal(undefined)
    expect(res.length).to.be.equal(5)
    expect(res[0]).to.be.equal(1)
    expect(res[1]).to.be.equal(11)
    expect(res[2]).to.be.equal(111)
    expect(res[3]).to.be.equal(12)
  })
  it('for forest by post strategy', () => {
    const res: any[] = []
    const newForest: Tree<'children'>[] | [] = filter([tree], (t) => {
      res.push(t.key)
      return t.key <= 100
    }, { strategy: 'post' })
    expect(newForest[0]?.key).to.be.equal(1)
    expect(newForest[0]?.children?.[0]?.key).to.be.equal(11)
    expect(newForest[0]?.children?.[0]?.children?.[0]?.key).to.be.equal(undefined)
    expect(res.length).to.be.equal(6)
    expect(res[0]).to.be.equal(111)
    expect(res[1]).to.be.equal(11)
    expect(res[2]).to.be.equal(1111)
    expect(res[3]).to.be.equal(112)
  })
  it('for forest by breadth strategy', () => {
    const res: any[] = []
    const newForest: Tree<'children'>[] | [] = filter([tree], (t) => {
      res.push(t.key)
      return t.key <= 100
    }, { strategy: 'breadth' })
    expect(newForest[0]?.key).to.be.equal(1)
    expect(newForest[0]?.children?.[0]?.key).to.be.equal(11)
    expect(newForest[0]?.children?.[0]?.children?.[0]?.key).to.be.equal(undefined)
    expect(res.length).to.be.equal(5)
    expect(res[0]).to.be.equal(1)
    expect(res[1]).to.be.equal(11)
    expect(res[2]).to.be.equal(12)
    expect(res[3]).to.be.equal(111)
  })

  it('for forest no-matched item by default strategy (pre)', () => {
    const res: any[] = []
    const newForest: Tree<'children'>[] | [] = filter([tree], (t) => {
      res.push(t.key)
      return t.key <= 0
    })
    expect(newForest.length).to.be.equal(0)
    expect(res.length).to.be.equal(1)
  })

  it('for forest no-matched item by post strategy', () => {
    const res: any[] = []
    const newForest: Tree<'children'>[] | [] = filter([tree], (t) => {
      res.push(t.key)
      return t.key <= 0
    }, { strategy: 'post' })
    expect(newForest.length).to.be.equal(0)
    expect(res.length).to.be.equal(6)
  })

  it('for forest no-matched item by breadth strategy', () => {
    const res: any[] = []
    const newForest: Tree<'children'>[] | [] = filter([tree], (t) => {
      res.push(t.key)
      return t.key <= 0
    }, { strategy: 'breadth' })
    expect(newForest.length).to.be.equal(0)
    expect(res.length).to.be.equal(1)
  })

  it('by default strategy (pre) and getChildrenKey', () => {
    const res: any[] = []
    const newTree: Tree<'children'> | undefined = filter(treeMultiChildrenKey, (t) => {
      res.push(t.key)
      return t.key <= 100
    }, {
      getChildrenKey(tree) {
        return tree.key < 10 ? 'children' : 'subItems'
      },
    })
    expect(newTree?.key).to.be.equal(1)
    expect(newTree?.children?.[0]?.key).to.be.equal(11)
    expect(newTree?.children?.[0]?.children?.[0]?.key).to.be.equal(undefined)
    expect(res.length).to.be.equal(5)
    expect(res[0]).to.be.equal(1)
    expect(res[1]).to.be.equal(11)
    expect(res[2]).to.be.equal(111)
    expect(res[3]).to.be.equal(12)
  })
  it('by post strategy and getChildrenKey', () => {
    const res: any[] = []
    const newTree: Tree<'children'> | undefined = filter(treeMultiChildrenKey, (t) => {
      res.push(t.key)
      return t.key <= 100
    }, {
      strategy: 'post',
      getChildrenKey(tree) {
        return tree.key < 10 ? 'children' : 'subItems'
      },
    })
    expect(newTree?.key).to.be.equal(1)
    expect(newTree?.children?.[0]?.key).to.be.equal(11)
    expect(newTree?.children?.[0]?.children?.[0]?.key).to.be.equal(undefined)
    expect(res.length).to.be.equal(6)
    expect(res[0]).to.be.equal(111)
    expect(res[1]).to.be.equal(11)
    expect(res[2]).to.be.equal(1111)
    expect(res[3]).to.be.equal(112)
  })
  it('by breadth strategy and getChildrenKey', () => {
    const res: any[] = []
    const newTree: Tree<'children'> | undefined = filter(treeMultiChildrenKey, (t) => {
      res.push(t.key)
      return t.key <= 100
    }, {
      strategy: 'breadth',
      getChildrenKey(tree) {
        return tree.key < 10 ? 'children' : 'subItems'
      },
    })
    expect(newTree?.key).to.be.equal(1)
    expect(newTree?.children?.[0]?.key).to.be.equal(11)
    expect(newTree?.children?.[0]?.children?.[0]?.key).to.be.equal(undefined)
    expect(res.length).to.be.equal(5)
    expect(res[0]).to.be.equal(1)
    expect(res[1]).to.be.equal(11)
    expect(res[2]).to.be.equal(12)
    expect(res[3]).to.be.equal(111)
  })
})
