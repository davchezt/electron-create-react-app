const log = (text) => {
  console.log('%c📢 log =>', 'color: orange; background: #171; border-radius: 2px; padding: 0 6px; text-align: center; text-shadow: 1px 1px 0 #1b1b1b', text);
}

const warn = (text) => {
  console.log('%c📢 warning =>', 'color: white; background: #faa; border-radius: 2px; padding: 0 6px; text-align: center; text-shadow: 1px 1px 0 #1b1b1b', text);
}

const info = (text) => {
  console.log('%c📢 info =>', 'color: yellow; background: #171; border-radius: 2px; padding: 0 6px; text-align: center; text-shadow: 1px 1px 0 #1b1b1b', text);
}

const json = (data) => {
  console.log('%c✔ data =>', 'color: white; background: #171; border-radius: 2px; padding: 0 6px; text-align: center; text-shadow: 1px 1px 0 #1b1b1b', JSON.parse(data));
}
export default { log, warn, info, json };