import init, { greet } from './lib/pkg/wasm_workshop.js'

let $btn = document.querySelector('button')
let $input = document.querySelector('input')
init().then($btn.addEventListener('click', () => greet($input.value)))
