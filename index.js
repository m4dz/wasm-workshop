import init, { greet } from './lib/pkg/wasm_workshop.js'

let $btn = document.querySelector('button')
init().then($btn.addEventListener('click', greet))
