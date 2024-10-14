/* global describe, it, beforeEach */

import type { Tree } from '../src/types'
import { expect } from 'chai'
import { some } from '../src/index'
import 'mocha'

describe('[some]', () => {
  const tree: Tree = {
    key: '1',
    children: [
      {
        key: '2',
        children: [
          {
            key: '3',
          },
        ],
      },
      {
        key: '4',
        children: [
          {
            key: '5',
          },
        ],
      },
    ],
  }

  it('by default strategy (pre)', () => {
    const node4Exist = some(tree, t => t.key === '4')
    const node6Exist = some(tree, t => t.key === '6')
    expect(node4Exist).to.be.equal(true)
    expect(node6Exist).to.be.equal(false)
  })
})
