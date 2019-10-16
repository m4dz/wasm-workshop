use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Stats(pub f64, pub usize);

#[wasm_bindgen]
pub fn mine(nodes: &JsValue, limit: usize) -> Stats {
    let mut rounds = 0;

    let window = web_sys::window().expect("should have a window in this context");
    let performance = window
        .performance()
        .expect("performance should be available");
    let t = performance.now();

    Stats(performance.now() - t, rounds)
}
