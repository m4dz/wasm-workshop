import init, { mine } from './lib/pkg/wasm_workshop.js'

const NODES = [0, 1, 2]

/**
 * NODES BUFFERING
 */
const _loadNode = (idx) => fetch(`data/node_${idx}.json`)
  .then(res => res.json())
  .then(records => ({
    id: idx.toString(),
    parent: idx > 0 ? (idx - 1).toString() : '-',
    nonce: '0',
    records
  }))

const load = (nodes, store) => Promise
  .all(nodes.map(_loadNode))
  .then(values => store._state = values)

const resetState = ({_state}) => _state.forEach((node, idx) => {
  node.id = idx.toString()
  node.nonce = '0'
  node.parent = idx > 0 ? (idx - 1).toString() : '-'
})

/**
 * UI THREAD RENDERING
 */
const renderRecord = (record) => new Promise((resolve, reject) => {
    const {id, email} = record
    const $el = document.createElement('li')
    $el.textContent = `${id.substr(0,6)} - ${email}`
    resolve($el)
  })

function renderNode (node, $) {
  $.querySelector('h2').innerText = node.id
  $.querySelector('.parent_id').innerText = node.parent
  $.querySelector('.nonce').innerText = node.nonce

  const $records = $.querySelector('ul')

  Promise.all(node.records
    .filter((_, idx) => idx < 10)
    .map(renderRecord)
  )
  .then($ul => $ul.forEach(($li, idx) => {
    $records.replaceChild($li, $records.children[idx])
  }))
}

function initRender (nodes, store) {
  if (initRender.done) { return }

  store._$template = document.querySelector('#node')
  store._$nodes = document.querySelector('ul.nodes')

  for(let i = 0; i < nodes.length; i++) {
    const $node = document.importNode(store._$template.content, true)
    const $ul = document.createDocumentFragment()

    for(let j = 0; j < 10; j++) {
      $ul.appendChild(document.createElement('li'))
    }
    $node.querySelector('ul').appendChild($ul)

    store._$nodes.appendChild($node)
  }

  initRender.done = true
}

function renderResult (p, r) {
  return `${((p) / 1000).toFixed(3)}s / ${r} rounds<br>(~${Math.round(p / r)}ms per round)`
}

function render (nodes, store) {
  initRender.apply(this, arguments)
  store._state
    .forEach((node, idx) => renderNode(node, store._$nodes.children[idx]))

  window.requestAnimationFrame(() => render.apply(this, arguments))
}

/**
 *
 */
document.addEventListener('DOMContentLoaded', () => {
  load(NODES, document).then(() => render(NODES, document))
})

init().then(() => {
  let $btn = document.querySelector('button')
  let $res = document.querySelector('.res')
  let $select = document.querySelector('select')

  $btn.addEventListener('click', () => {
    resetState(document)
    const res = mine(document._state, +$select.value)
    $res.innerHTML = renderResult(res[0], res[1])
  })
})
