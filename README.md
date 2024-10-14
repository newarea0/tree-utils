# tree-utils

一些树结构数据（数组、对象）操作的工具函数，所提供的函数都是 “纯函数”，并不会对原数据结构直接产生修改。

## 安装

```bash
pnpm install tree-utils
```

## 使用

```ts
import { filter } from 'tree-utils'

const tree = [
  { id: 1, children: [{ id: 2, children: [{ id: 3 }] }] },
  { id: 4, children: [{ id: 5 }] },
]

const result = filter(tree, node => node.id > 2)

console.log(result)
```

## 配置项

### strategy

设置搜索策略。默认策略为 `pre`，所有本库提供的方法都支持以下三种策略:

- `pre`: 深度优先，正序搜索；
  ![](https://image.newarea.site/2024-10-14_11-26-00.gif)
- `post`: 深度优先，反序搜索；
  ![](https://image.newarea.site/2024-10-14_11-28-60.gif)
- `breadth`: 广度优先
  ![](https://image.newarea.site/2024-10-14_11-29-60.gif)

```ts
import { filter } from 'tree-utils'

const result = filter(tree, node => node.id > 2, { strategy: 'post' })
```

### childrenKey

自定义子节点 key 名。默认值为 `children`:

```ts
import { filter } from 'tree-utils'

const result = filter(tree, node => node.id > 2, { childrenKey: 'items' })
```

### getChildrenKey

设置一棵树上多种自定义子节点 key 名。

```ts
import { filter } from 'tree-utils'

const treeMultiChildrenKey: Tree = {
  key: '1',
  children: [
    {
      key: '2',
      subItems: [
        {
          key: '3'
        }
      ]
    },
    {
      key: '4',
      subItems: [
        {
          key: '5'
        }
      ]
    }
  ]
}

const result = filter(
  treeMultiChildrenKey,
  node => node.key > 2,
  {
    getChildrenKey: (tree, meta) => {
      if (meta.depth === 1) {
        return 'subItems'
      }
    }
  }
)
```

## 方法列表

### foreach

遍历树形数组/对象，对每个节点执行回调。

```ts
foreach(tree, predicate, [options])
```

- `tree`: 树形数组/对象
- `predicate`: 回调函数，对每个节点执行回调
- `options`: 配置项，可选，对象类型，支持 `strategy` 和 `childrenKey`

<details>
  <summary>示例</summary>

  ```ts
  import { foreach } from 'tree-utils'

  const data = {
    key: 1,
    children: [
      {
        key: 11,
        children: [
          {
            key: 111
          },
          {
            key: 112
          }
        ]
      },
      {
        key: 12,
        children: [
          {
            key: 122,
            children: [
              {
                key: 1221
              },
              {
                key: 1222
              }
            ]
          }
        ]
      }
    ]
  }
  foreach(data, t => console.log(t.key))
  // 1
  // 11
  // 111
  // 112
  // 12
  // 122
  // 1221
  // 1222
  ```
</details>

### filter

遍历树形数组/对象，并把返回非真值的节点剔除。（不会影响原结构，返回的树是新生成的）

```ts
filter(tree, predicate, [options])
```

- `tree`: 树形数组/对象
- `predicate`: 每次迭代调用的函数，返回非真值时，该节点会从树上剔除。
- `options`: 配置项，可选，支持 `strategy` 和 `childrenKey`

<details>
  <summary>示例</summary>

  ```ts
  import { filter } from 'tree-utils'

  const data = {
    key: 1,
    children: [
      {
        key: 11,
        children: [
          {
            key: 99
          },
          {
            key: 112
          }
        ]
      },
      {
        key: 12,
        children: [
          {
            key: 122,
            children: [
              {
                key: 1221
              },
              {
                key: 1222
              }
            ]
          }
        ]
      }
    ]
  }
  const res = filter(data, t => t.key < 100)
  console.log(res)
  // {
  //   "key": 1,
  //   "children": [
  //     {
  //       "key": 11,
  //       "children": [
  //         {
  //           "key": 99
  //         }
  //       ]
  //     },
  //     {
  //       "key": 12,
  //       "children": []
  //     }
  //   ]
  // }
  ```
</details>

### map

遍历树形数组/对象，根据返回的对象，组成新的树。

```ts
map(tree, predicate, [options])
```

- `tree`: 树形数组/对象
- `predicate`: 每次迭代调用的函数，需要返回一个对象，返回的对象上无需包括子节点。
- `options`: 配置项，可选，支持 `strategy` 和 `childrenKey`

<details>
  <summary>示例</summary>

  ```ts
  import { map } from 'tree-utils'

  const data = {
    key: 1,
    children: [
      {
        key: 11,
        children: [
          {
            key: 111
          },
          {
            key: 112
          }
        ]
      },
      {
        key: 12,
        children: [
          {
            key: 122,
            children: [
              {
                key: 1221
              },
              {
                key: 1222
              }
            ]
          }
        ]
      }
    ]
  }
  const res = map(data, t => ({ name: `No.${t.key}` }))
  console.log(res)
  // {
  //   "name": "No.1",
  //   "children": [
  //     {
  //       "name": "No.11",
  //       "children": [
  //         { "name": "No.111" },
  //         { "name": "No.112" }
  //       ]
  //     },
  //     {
  //       "name": "No.12",
  //       "children": [
  //         {
  //           "name": "No.122",
  //           "children": [
  //             { "name": "No.1221" },
  //             { "name": "No.1222" }
  //           ]
  //         }
  //       ]
  //     }
  //   ]
  // }
  ```
</details>

### find

遍历树形数组/对象，找到第一个返回非空值的节点。

```ts
find(tree, predicate, [options])
```

- `tree`: 树形数组/对象
- `predicate`: 每次迭代调用的函数
- `options`: 配置项，可选，支持 `strategy` 和 `childrenKey`

<details>
  <summary>示例</summary>

  ```ts
  import { find } from 'tree-utils'

  const data = {
    key: 1,
    children: [
      {
        key: 11,
        children: [
          {
            key: 111
          },
          {
            key: 112
          }
        ]
      },
      {
        key: 12,
        children: [
          {
            key: 122,
            children: [
              {
                key: 1221
              },
              {
                key: 1222
              }
            ]
          }
        ]
      }
    ]
  }
  const res = find(data, t => t.key < 100 && t.key > 10)
  console.log(res)
  // {
  //     "key": 11,
  //     "children": [
  //         {
  //             "key": 111
  //         },
  //         {
  //             "key": 112
  //         }
  //     ]
  // }
  ```
</details>

### some

遍历树形数组/对象，判断是否存在符合条件的节点。

```ts
some(tree, predicate, [options])
```

- `tree`: 树形数组/对象
- `predicate`: 每次迭代调用的函数
- `options`: 配置项，可选，支持 `strategy` 和 `childrenKey`

<details>
  <summary>示例</summary>

  ```ts
  import { some } from 'tree-utils'

  const data = {
    key: 1,
    children: [
      {
        key: 11,
        children: [
          {
            key: 111
          },
          {
            key: 112
          }
        ]
      },
      {
        key: 12,
        children: [
          {
            key: 122,
            children: [
              {
                key: 1221
              },
              {
                key: 1222
              }
            ]
          }
        ]
      }
    ]
  }
  const res = some(data, t => t.key < 100 && t.key > 10)
  console.log(res)
  // true
  ```
</details>

### toArray

将树形数组/对象转换为一维数组，数组会包含所有节点。

```ts
toArray(tree, [options])
```

- `tree`: 树形数组/对象
- `options`: 配置项，可选，支持 `strategy` 和 `childrenKey`

<details>
  <summary>示例</summary>

  ```ts
  import { toArray } from 'tree-utils'

  const tree = {
    key: '1',
    children: [
      {
        key: '2',
        children: [
          {
            key: '3'
          }
        ]
      }
    ]
  }
  toArray(tree).map(t => t.key)
  // ['1', '2', '3']
  ```
</details>

### fromArray

将数组转换为树形数组/对象。

```ts
fromArray(array, [options])
```

- `array`: 数组
- `options`: 配置项，可选
  - `itemKey`: 指定节点 key 字段名，默认值：`id`
  - `parentKey`: 指定节点 key 字段名，默认值：`pid`
  - `childrenKey`: 指定节点 key 字段名，默认值：`children`

<details>
  <summary>示例</summary>

  ```ts
  import { fromArray } from 'tree-utils'
  const tree = [
    {
      id: '1',
      name: '1',
    },
    {
      id: '2',
      name: '2',
      pid: '1',
    },
    {
      id: '3',
      name: '3',
      pid: '1',
    },
    {
      id: '4',
      name: '4',
      pid: '2',
    },
    {
      id: '5',
      name: '5',
    },
  ]
  fromArray(tree)
  // =>
  // [
  //   {
  //     id: '1',
  //     name: '1',
  //     children: [
  //       {
  //         id: "2",
  //         name: "2",
  //         pid: "1",
  //         children: [
  //           {
  //             id: "4",
  //             name: "4",
  //             pid: "2",
  //           }
  //         ]
  //       },
  //       {
  //         id: "3",
  //         name: "3",
  //         pid: "1",
  //       },
  //     ]
  //   },
  //   {
  //     id: "5",
  //     name: "5",
  //   },
  // ]
  ```
</details>
